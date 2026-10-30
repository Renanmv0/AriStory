import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { ItemDef, MedidasCorpo } from '../core/types';
import { novaTextura, sorteio } from './texturasDeChao';
import { fundir } from './fundir';
import { raioDoTronco } from './uniformeDosGatitos';
import { camadaDeSola, formaDaSola, pe } from './roupasDePiscina';
import { tiara } from './roupas';
import {
  alturaDaAba, cintaNaPele, corpete, lacoDeFita, linho, malha, naPele, noTronco, palha, poa, saiaViva, torneada, veludo, vivoNaPele,
} from './roupasDaBoutique';
import {
  capaViva, chapa, corpoDe, espelhada, feltro, forroDe, listrasDeMeia, medidorDePasso,
} from './fantasias';

/**
 * ===================================== AS FANTASIAS DA CAÇA (a etapa 5b)
 *
 * As outras cinco fantasias do Halloween (`docs/HALLOWEEN.md`, §5.1 e §5.2):
 * uma INTEIRA a cada duas paradas da caça de doces ou travessuras, todas
 * costuradas pela Estella e entregues por quem está na parada. Cada uma ocupa
 * as seis vagas do corpo, e vai direto para o guarda-roupa dos dois (e para
 * o filtro 🎃 Fantasias):
 *
 * | vaga      | 🎃 abóbora (Cookie)              | 🏴‍☠️ pirata (Jean-Luc)                 | 🐈‍⬛ gato preto (coelhinhas)        | 🌾 espantalho (Josefina)           | 🧙 bruxinho (Noel)                 |
 * |-----------|----------------------------------|-----------------------------------------|------------------------------------|------------------------------------|------------------------------------|
 * | cabeça    | chapeuzinho de gomos, cabinho, folha e gavinha | tricórnio, caveirinha e pena   | orelhinhas de gato com lacinho     | chapéu de palha amassado e o corvinho | chapéu pontudo e torto, fivela, estrela |
 * | tronco    | macacão-abóbora com a carinha    | camisa listrada, colete e faixa         | moletom preto, babador e coleira   | camisa xadrez de remendos, palha na manga | túnica roxa de manga larga, saia e cinto |
 * | pernas    | meia-calça verde de tricô        | calça bufante até o joelho              | legging preta com punho de pelúcia | calça de remendo e cinto de corda  | meia listrada roxa e verde         |
 * | pés       | botinha verde de cálice          | bota de cano dobrado com fivela         | pantufa de patinha                 | bota gasta de cadarço              | botinha de bico curvo com estrela  |
 * | mãos      | luvinhas verdes com folhinha     | luva de punho largo e a espadinha       | luva de patinha com almofadinha    | luva de couro com palha            | a vassoura, na mão esquerda        |
 * | acessório | gola de folhas                   | o papagaio no ombro                     | o rabo com laço e sininho          | a bandana de poá                   | a capa de estrelinhas              |
 *
 * O referencial de cada vaga é o da skill `aristory-roupa` (o mesmo do
 * vampiro e do morceguinho, `world/fantasias.ts`, de onde vem o kit): tronco e
 * acessório do corpo com y = 0 no CHÃO; pernas e pés no pivô de cada perna
 * (y = 0 no quadril); mãos e `extraBraco` no pivô de cada braço (y = 0 no
 * ombro); cabeça no centro do crânio. O que vai para o lado multiplica pelo
 * `lado` (o membro esquerdo nasce em x negativo).
 *
 * FOFO ANTES DE ASSUSTADOR (§5.4): proporção gordinha, quina redonda, as
 * carinhas sorrindo (a abóbora, a caveirinha do pirata, o corvinho), o
 * tecido que parece tecido (o tricô, o xadrez, o feltro, a palha, a estampa
 * de estrelinhas — tudo em canvas) e os miúdos (botão, pesponto, fivela,
 * fio de palha). O que SE MEXE fica fora da `fundir()`, num grupo com nome:
 * o rabo do gato balança, o papagaio e o corvinho mexem a cabeça, e a capa
 * do bruxinho e a saia da túnica são pano vivo.
 */

const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
const escuro = (cor: number, quanto = 0.78): number => new THREE.Color(cor).multiplyScalar(quanto).getHex();
const mistura = (a: number, b: number, t: number): number => new THREE.Color(a).lerp(new THREE.Color(b), t).getHex();

// ===================================================================== o kit

/**
 * UM TUBO QUE AFINA: a gavinha, o rabo, a pluma, o cabo da vassoura. O
 * `TubeGeometry` do three tem raio fixo; aqui cada anel é escalado em volta
 * do ponto da curva (o tubo põe o anel `i` em `getPointAt(i/segs)`).
 */
function tuboAfinado(curva: THREE.Curve<THREE.Vector3>, segs: number, r0: number, r1: number, radial = 8): THREE.BufferGeometry {
  const geo = new THREE.TubeGeometry(curva, segs, 1, radial, false);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    curva.getPointAt(t, p);
    const r = THREE.MathUtils.lerp(r0, r1, t);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      pos.setXYZ(k, p.x + (pos.getX(k) - p.x) * r, p.y + (pos.getY(k) - p.y) * r, p.z + (pos.getZ(k) - p.z) * r);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/** a estrela de `pontas` pontas (olha para `+Z`, centro na origem) */
function formaDeEstrela(fora: number, dentro: number, pontas = 5): THREE.Shape {
  const f = new THREE.Shape();
  for (let i = 0; i < pontas * 2; i++) {
    const a = (i / (pontas * 2)) * Math.PI * 2;
    const r = i % 2 ? dentro : fora;
    const x = Math.sin(a) * r;
    const y = Math.cos(a) * r;
    if (i === 0) f.moveTo(x, y);
    else f.lineTo(x, y);
  }
  f.closePath();
  return f;
}

/** uma estrela gordinha com espessura e quina macia */
function estrelaGorda(fora: number, mat: THREE.Material): THREE.Mesh {
  const geo = chapa(formaDeEstrela(fora, fora * 0.5), fora * 0.28, fora * 0.16, 4);
  geo.translate(0, 0, -fora * 0.14);
  return new THREE.Mesh(geo, mat);
}

/** um círculo (o furo, a bolinha, a bochecha) como forma */
function circulo(r: number, x = 0, y = 0, sy = 1): THREE.Shape {
  const f = new THREE.Shape();
  f.absellipse(x, y, r, r * sy, 0, Math.PI * 2, false, 0);
  return f;
}

/**
 * A CALOTA POR CIMA DO CABELO (o chapeuzinho da abóbora): uma grade em volta
 * do alto da cabeça cujo raio, em cada ângulo a partir do alto, é o do CABELO
 * medido de quem veste (`m.cabelo`), como a bandana do Mania. `ate(fi)` diz
 * até onde ela desce em cada ângulo em volta (0 = frente).
 */
function calotaNoCabelo(m: MedidasCorpo, ate: (fi: number) => number, folga = 1.035, colunas = 64, linhas = 12, domo = 0, ateDoDomo = 1): {
  geo: THREE.BufferGeometry;
  ponto: (fi: number, te: number, sai?: number) => THREE.Vector3;
} {
  const r = m.headR;
  // `domo` estufa o meio da calota (o alto de uma abóbora), sumindo até a beira
  const raio = (te: number): number => Math.max(m.cabelo(Math.min(te, 1.5)), r * 1.02) * folga + r * 0.012
    + domo * Math.cos(Math.min(1, te / ateDoDomo) * Math.PI / 2);
  const ponto = (fi: number, te: number, sai = 0): THREE.Vector3 => {
    const R = raio(te) + sai;
    return new THREE.Vector3(Math.sin(te) * Math.sin(fi) * R, Math.cos(te) * R, Math.sin(te) * Math.cos(fi) * R);
  };
  const pos: number[] = [];
  const uv: number[] = [];
  for (let i = 0; i <= colunas; i++) {
    const fi = -Math.PI + (i / colunas) * Math.PI * 2;
    for (let j = 0; j <= linhas; j++) {
      const t = j / linhas;
      const te = t * ate(fi);
      const p = ponto(fi, te);
      pos.push(p.x, p.y, p.z);
      uv.push(fi * r, te * r);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      const a = i * (linhas + 1) + j;
      const b = (i + 1) * (linhas + 1) + j;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return { geo, ponto };
}

/**
 * A FOLHA DE ABÓBORA: palmada, de três lóbulos redondos (o do meio maior),
 * com a base no ponto (0, 0) e a ponta em `+Y`. `curva` enrola as beiradas
 * para cima (folha de verdade não é chapa).
 */
function folhaDeAbobora(L: number, curva = 0.25): THREE.BufferGeometry {
  const f = new THREE.Shape();
  const N = 60;
  const ABRE = 1.35;
  f.moveTo(0, 0);
  for (let i = 0; i <= N; i++) {
    const fi = -ABRE + (i / N) * ABRE * 2;
    const lobo = Math.pow(Math.abs(Math.cos(fi * 2.5)), 0.6);
    const R = L * (0.58 + 0.42 * lobo) * (1 - 0.18 * Math.abs(fi) / ABRE);
    f.lineTo(Math.sin(fi) * R, Math.cos(fi) * R * 0.95 + L * 0.05);
  }
  f.lineTo(0, 0);
  const geo = new THREE.ShapeGeometry(f, 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, curva * (x * x) / L + 0.06 * L * Math.sin((y / L) * Math.PI));
  }
  geo.computeVertexNormals();
  return geo;
}

/** as nervuras de uma folha de abóbora: do pé até a ponta de cada lóbulo */
function nervurasDaFolha(L: number, curva: number, grossura: number): THREE.BufferGeometry[] {
  const geos: THREE.BufferGeometry[] = [];
  const z = (x: number, y: number): number => curva * (x * x) / L + 0.06 * L * Math.sin((y / L) * Math.PI) + grossura * 0.6;
  for (const fi of [0, -1.257, 1.257]) {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 6; k++) {
      const t = (k / 6) * 0.82;
      const x = Math.sin(fi) * L * t;
      const y = Math.cos(fi) * L * t * 0.95 + L * 0.05 * t;
      pts.push(new THREE.Vector3(x, y, z(x, y)));
    }
    geos.push(tuboAfinado(new THREE.CatmullRomCurve3(pts), 10, grossura, grossura * 0.3, 4));
  }
  return geos;
}

/**
 * A GAVINHA: a molinha que sai do cabinho, enrolando em espiral cada vez
 * mais fechada — `voltas` voltas, saindo de `de` na direção `dir`.
 */
function gavinha(de: THREE.Vector3, dir: THREE.Vector3, comprimento: number, grossura: number, voltas = 2.2): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  const d = dir.clone().normalize();
  const lado = new THREE.Vector3(0, 1, 0).cross(d).normalize();
  if (lado.lengthSq() < 1e-6) lado.set(1, 0, 0);
  const cima = d.clone().cross(lado).normalize();
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const a = t * voltas * Math.PI * 2;
    const raio = comprimento * 0.22 * (1 - t * 0.7);
    pts.push(de.clone()
      .addScaledVector(d, comprimento * t)
      .addScaledVector(lado, Math.sin(a) * raio)
      .addScaledVector(cima, (1 - Math.cos(a)) * raio));
  }
  return tuboAfinado(new THREE.CatmullRomCurve3(pts), 60, grossura, grossura * 0.45, 5);
}

/**
 * UMA BOTA (ou botinha, ou pantufa de cano): a sola com o vivo, o cabedal
 * extrudado da forma da sola e rebaixado para o bico (como o sapato de
 * verniz) e, se pedir, o CANO em volta do tornozelo. Devolve também a altura
 * do peito do pé em cada z (para pregar fivela, cadarço, bico).
 * Referencial: o pivô da perna (y = 0 no quadril).
 */
interface OpcoesDeBota {
  cor: number;
  sola: number;
  /** a altura do cano, do chão até a boca (0 = sem cano) */
  cano?: number;
  /** o cano abre na boca (o raio a mais lá em cima) */
  abre?: number;
  /** quanto o bico desce (0 = bico redondo e alto, 0,6 = sapato) */
  rebaixa?: number;
  /** a forma da sola em escala (a bota gorda é maior que o pé) */
  escala?: number;
  textura?: THREE.Texture;
  /** a cor do cano, se não for a do cabedal */
  corDoCano?: number;
}
function bota(m: MedidasCorpo, o: OpcoesDeBota): { g: THREE.Group; topoEm: (z: number) => number; zBico: number; rCano: number } {
  const g = new THREE.Group();
  const h = m.h;
  const p = pe(m);
  const ENC = o.escala ?? 1.05;
  g.add(camadaDeSola(m, p.chao, h * 0.007, o.sola, ENC * 1.04));
  const y0 = p.chao + h * 0.007;
  const H = h * 0.036;
  const BISEL = h * 0.009;
  const escala = ENC * 0.92;
  const geo = new THREE.ExtrudeGeometry(formaDaSola(m, escala), {
    depth: H, bevelEnabled: true, bevelThickness: BISEL, bevelSize: h * 0.005, bevelSegments: 4, curveSegments: 14,
  });
  geo.rotateX(-Math.PI / 2);
  const zBico = p.z + (p.meioComprimento + h * 0.012) * escala;
  const rebaixa = o.rebaixa ?? 0.3;
  const alturaEm = (z: number): number => 1 - rebaixa * THREE.MathUtils.smoothstep(z, p.z - h * 0.01, zBico);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > 0) pos.setY(i, y * alturaEm(pos.getZ(i)));
  }
  geo.computeVertexNormals();
  geo.translate(0, y0, 0);
  const mat = toon(o.cor, o.textura ? { mapa: o.textura } : {});
  g.add(new THREE.Mesh(geo, mat));
  const rCano = h * 0.05 * m.w;
  if (o.cano) {
    const abre = o.abre ?? 0;
    const matCano = toon(o.corDoCano ?? o.cor, { doubleSide: true, ...(o.textura ? { mapa: o.textura } : {}) });
    g.add(new THREE.Mesh(torneada([
      [rCano * 0.98, y0 + H * 0.5],
      [rCano, y0 + H + h * 0.01],
      [rCano * 1.02 + abre * 0.4, p.chao + o.cano * 0.6],
      [rCano * 1.04 + abre, p.chao + o.cano],
    ], 0, () => 0, 26), matCano));
  }
  return { g, topoEm: (z: number) => y0 + (H + BISEL) * alturaEm(z), zBico, rCano };
}

/** os fios de PALHA saindo de uma boca (punho, barra, gola): um lote só, cada fio no seu ângulo */
function fiosDePalha(
  n: number, semente: number, ponto: (k: number, rnd: () => number) => { de: THREE.Vector3; dir: THREE.Vector3; L: number },
  grossura: number, cores: readonly [number, number] = [P.espantalhoPalha, P.espantalhoPalhaEscura],
): THREE.InstancedMesh {
  const geo = new THREE.CylinderGeometry(grossura * 0.6, grossura, 1, 4, 1);
  geo.translate(0, 0.5, 0);
  const lote = new THREE.InstancedMesh(geo, toon(0xffffff), n);
  const rnd = sorteio(semente);
  const q = new THREE.Quaternion();
  const m = new THREE.Matrix4();
  const cor = new THREE.Color();
  for (let k = 0; k < n; k++) {
    const { de, dir, L } = ponto(k, rnd);
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    m.compose(de, q, new THREE.Vector3(1, L, 1));
    lote.setMatrixAt(k, m);
    lote.setColorAt(k, cor.setHex(rnd() < 0.5 ? cores[0] : cores[1]));
  }
  lote.instanceMatrix.needsUpdate = true;
  if (lote.instanceColor) lote.instanceColor.needsUpdate = true;
  lote.computeBoundingSphere();
  return lote;
}

/**
 * Uma forma plana dobrada por cima do TRONCO (o babador, a carinha, o
 * remendo): `x` é o arco a partir da frente, `y` a altura no chão — o
 * `noTronco` da boutique, com a espessura de uma chapa.
 */
function decalqueNoTronco(m: MedidasCorpo, forma: THREE.Shape, folga: number, esp = 0): THREE.BufferGeometry {
  const geo = esp > 0 ? chapa(forma, esp, esp * 0.4, 10) : new THREE.ShapeGeometry(forma, 10);
  return noTronco(geo, m, folga);
}

/** os pontinhos de costura (o pesponto aparente) em volta de uma forma, pela pele do tronco */
function pespontoNoTronco(m: MedidasCorpo, contorno: Array<[number, number]>, folga: number, mat: THREE.Material, grossura: number): THREE.Group {
  const g = new THREE.Group();
  const curva = new THREE.CatmullRomCurve3(contorno.map(([x, y]) => new THREE.Vector3(x, y, 0)), true);
  const N = Math.max(10, Math.round(curva.getLength() / (grossura * 9)));
  for (let k = 0; k < N; k++) {
    const p = curva.getPointAt(k / N);
    const t = curva.getTangentAt(k / N);
    const R = Math.max(raioDoTronco(m, p.y), m.h * 0.02) * folga;
    const a = p.x / R;
    const ponto = new THREE.Mesh(new THREE.CapsuleGeometry(grossura, grossura * 3, 2, 4), mat);
    ponto.position.set(Math.sin(a) * R, p.y, Math.cos(a) * R * 0.82);
    ponto.rotation.set(0, a, Math.atan2(t.x, t.y));
    g.add(ponto);
  }
  return g;
}

// ============================================================ as texturas

/** o tricô: colunas de V (o ponto meia), quase branco — multiplica a cor da peça */
function trico(lado = 0.05): THREE.CanvasTexture {
  return novaTextura('caca-trico', lado, (ctx, s) => {
    ctx.fillStyle = 'rgb(232,232,232)';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = s * 0.03;
    for (let x = 0; x < s; x += s / 8) {
      for (let y = -s / 8; y < s; y += s / 8) {
        ctx.beginPath();
        ctx.moveTo(x + s * 0.01, y);
        ctx.lineTo(x + s / 16, y + s / 10);
        ctx.lineTo(x + s / 8 - s * 0.01, y);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(150,150,150,0.35)';
    ctx.lineWidth = s * 0.006;
    for (let x = 0; x < s; x += s / 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, s);
      ctx.stroke();
    }
  });
}

/** o XADREZ de flanela: as faixas largas nas duas direções, a trama fina e a linha escura */
function xadrez(fundo: number, faixa: number, linha: number, lado = 0.09): THREE.CanvasTexture {
  return novaTextura(`caca-xadrez:${fundo}:${faixa}:${linha}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = css(faixa);
    ctx.fillRect(0, s * 0.1, s, s * 0.3);
    ctx.fillRect(s * 0.1, 0, s * 0.3, s);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = css(linha);
    ctx.fillRect(0, s * 0.62, s, s * 0.05);
    ctx.fillRect(s * 0.62, 0, s * 0.05, s);
    ctx.fillRect(0, s * 0.8, s, s * 0.02);
    ctx.fillRect(s * 0.8, 0, s * 0.02, s);
    ctx.globalAlpha = 1;
    // a trama da flanela: riscos diagonais bem finos
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let k = -s; k < s * 2; k += s / 40) {
      ctx.beginPath();
      ctx.moveTo(k, 0);
      ctx.lineTo(k + s, s);
      ctx.stroke();
    }
  });
}

/** a ESTAMPA DE ESTRELINHAS da capa do bruxinho: estrelas de cinco pontas e pontinhos, espalhados */
function estrelinhas(fundo: number, estrela: number, lado = 0.16): THREE.CanvasTexture {
  return novaTextura(`caca-estrelinhas:${fundo}:${estrela}`, lado, (ctx, s) => {
    ctx.fillStyle = css(fundo);
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(377);
    const desenhar = (x: number, y: number, r: number): void => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 ? r * 0.45 : r;
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    };
    ctx.fillStyle = css(estrela);
    for (let k = 0; k < 9; k++) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.035 + rnd() * 0.035);
      // repete nas bordas: a estampa emenda sem costura
      for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) desenhar(x + dx, y + dy, r);
    }
    ctx.globalAlpha = 0.7;
    for (let k = 0; k < 26; k++) {
      ctx.beginPath();
      ctx.arc(rnd() * s, rnd() * s, s * 0.006, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

/** a corda torcida: listras diagonais em dois tons */
function corda(cor: number, lado = 0.02): THREE.CanvasTexture {
  return novaTextura(`caca-corda:${cor}`, lado, (ctx, s) => {
    ctx.fillStyle = css(cor);
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = css(escuro(cor, 0.7));
    ctx.lineWidth = s * 0.12;
    for (let k = -s; k < s * 2; k += s / 3) {
      ctx.beginPath();
      ctx.moveTo(k, 0);
      ctx.lineTo(k + s, s);
      ctx.stroke();
    }
  });
}

/** os veios da madeira da espadinha e do cabo da vassoura */
function veio(cor: number, lado = 0.08): THREE.CanvasTexture {
  return novaTextura(`caca-veio:${cor}`, lado, (ctx, s) => {
    ctx.fillStyle = css(cor);
    ctx.fillRect(0, 0, s, s);
    const rnd = sorteio(1201);
    ctx.strokeStyle = css(escuro(cor, 0.8));
    for (let k = 0; k < 14; k++) {
      ctx.lineWidth = 1 + rnd() * 2;
      ctx.beginPath();
      const x = rnd() * s;
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x + (rnd() - 0.5) * s * 0.1, s * 0.33, x + (rnd() - 0.5) * s * 0.1, s * 0.66, x, s);
      ctx.stroke();
    }
  });
}

// ============================================================== A ABÓBORA

/**
 * O CHAPEUZINHO DE ABÓBORA (cabeça): a calota laranja de oito gomos pousada
 * no alto do cabelo (o gomo é a cor mais funda no vinco, pintada vértice a
 * vértice), a beira enrolada, o cálice de seis folhinhas verdes em volta do
 * cabinho, o CABINHO torto de abóbora com o tampo, a FOLHA de três lóbulos
 * com as nervuras, deitada no chapéu, e a GAVINHA enrolada caindo do lado.
 */
function chapeuDeAbobora(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const laranja = peca?.cor ?? P.fantasiaAbobora;
  const verde = peca?.corDetalhe ?? P.fantasiaAboboraFolha;
  const ATE = 0.6;
  const GOMOS = 8;
  const { geo, ponto } = calotaNoCabelo(m, () => ATE, 1.04, 64, 14, r * 0.2, ATE);
  // os gomos: o vinco afunda um fio e escurece
  const pos = geo.attributes.position;
  const cores: number[] = [];
  const cMeio = new THREE.Color(laranja);
  const cVinco = new THREE.Color(escuro(laranja, 0.72));
  const cAlto = new THREE.Color(mistura(laranja, 0xffffff, 0.12));
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const fi = Math.atan2(x, z);
    const gomo = Math.pow(Math.abs(Math.cos(fi * GOMOS * 0.5)), 0.5);
    const lado = Math.hypot(x, z);
    const k = 1 - 0.05 * (1 - gomo) * Math.min(1, lado / (r * 0.4));
    pos.setXYZ(i, x * k, y * (1 - 0.02 * (1 - gomo)), z * k);
    const c = cVinco.clone().lerp(cMeio, gomo).lerp(cAlto, Math.max(0, gomo - 0.8) * 1.5);
    cores.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, toon(0xffffff, { corPorVertice: true, mapa: feltro(0.05), doubleSide: true })));
  // a beira enrolada
  const beira: THREE.Vector3[] = [];
  for (let i = 0; i < 48; i++) beira.push(ponto((i / 48) * Math.PI * 2, ATE, -r * 0.01));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beira, true), 96, r * 0.035, 6, true), toon(escuro(laranja, 0.85))));

  // o topo: o CÁLICE de folhinhas pontudas em volta do cabinho
  const topo = ponto(0, 0);
  const matVerde = toon(verde, { mapa: feltro(0.04), doubleSide: true });
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.3;
    const f = new THREE.Shape();
    f.moveTo(-r * 0.09, 0);
    f.quadraticCurveTo(-r * 0.08, r * 0.16, 0, r * 0.26);
    f.quadraticCurveTo(r * 0.08, r * 0.16, r * 0.09, 0);
    f.closePath();
    const folhinha = new THREE.Mesh(new THREE.ShapeGeometry(f, 6), matVerde);
    folhinha.position.copy(topo).add(new THREE.Vector3(0, r * 0.01, 0));
    // deitada, apontando para fora e um pouco para baixo (acompanha a calota)
    folhinha.rotation.set(-Math.PI / 2 + 0.35, 0, 0, 'YXZ');
    folhinha.rotation.y = a;
    g.add(folhinha);
  }
  // o CABINHO: torto, afinando, com o tampo cortado
  const cabinho = toon(P.fantasiaAboboraCabinho, { mapa: veio(P.fantasiaAboboraCabinho, 0.03) });
  const curva = new THREE.CatmullRomCurve3([
    topo.clone(),
    topo.clone().add(new THREE.Vector3(r * 0.02, r * 0.16, 0)),
    topo.clone().add(new THREE.Vector3(r * 0.09, r * 0.3, r * 0.03)),
    topo.clone().add(new THREE.Vector3(r * 0.2, r * 0.36, r * 0.05)),
  ]);
  g.add(new THREE.Mesh(tuboAfinado(curva, 18, r * 0.095, r * 0.07, 10), cabinho));
  const ponta = curva.getPoint(1);
  const tampo = new THREE.Mesh(new THREE.SphereGeometry(r * 0.072, 10, 6), toon(mistura(P.fantasiaAboboraCabinho, 0xe0c890, 0.35)));
  tampo.position.copy(ponta);
  tampo.scale.set(1, 0.5, 1);
  tampo.lookAt(ponta.clone().add(curva.getTangent(1)));
  tampo.rotateX(Math.PI / 2);
  g.add(tampo);

  // a FOLHA grande, deitada no chapéu para o lado esquerdo-frente, com as nervuras
  const L = r * 0.62;
  const folha = new THREE.Group();
  folha.add(new THREE.Mesh(folhaDeAbobora(L, 0.3), matVerde));
  const nerv = toon(P.fantasiaAboboraFolhaClara);
  for (const n of nervurasDaFolha(L, 0.3, r * 0.012)) folha.add(new THREE.Mesh(n, nerv));
  const pFolha = ponto(-0.7, 0.32, r * 0.02);
  folha.position.copy(pFolha);
  folha.lookAt(pFolha.clone().multiplyScalar(2));
  folha.rotateZ(2.3);
  folha.rotateX(-0.25);
  g.add(folha);
  // a GAVINHA, do pé do cabinho caindo para a direita
  g.add(new THREE.Mesh(gavinha(topo.clone().add(new THREE.Vector3(r * 0.06, r * 0.05, -r * 0.02)), new THREE.Vector3(1, -0.25, -0.2), r * 0.55, r * 0.022, 2.4), toon(verde)));
  return fundir(g);
}

/**
 * O MACACÃO DE ABÓBORA (tronco): a `cor` pinta a camiseta verde por baixo
 * (o tronco e a manga do rig), e por cima vai a ABÓBORA — uma casca redonda
 * de oito gomos da barriga até o peito, gorda para a FRENTE e para trás e só
 * um tico para os lados (o braço desce rente ao corpo: abóbora larga nos
 * lados engoliria o braço). O vinco de cada gomo afunda e escurece, e a
 * barriga é mais clara no alto (luz pintada).
 *
 * Na frente, a CARINHA de abóbora fofa: os olhos de triângulo redondo com o
 * brilhinho, o narizinho, o sorriso com dois dentes e as bochechas rosadas.
 * As ALÇAS verdes sobem da beira por cima do ombro, com o botão, e a gola da
 * camiseta é canelada.
 */
function macacaoDeAbobora(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const camiseta = peca?.cor ?? P.fantasiaAboboraVerdeEscuro;
  const laranja = P.fantasiaAbobora;
  const y0 = c.quadril - h * 0.012;
  const y1 = c.quadril + m.torsoH * 0.7;
  const GOMOS = 8;
  /** o quanto a abóbora estufa em cada altura (0 nas bocas, 1 no meio) */
  const estufa = (u: number): number => Math.pow(Math.sin(Math.PI * THREE.MathUtils.clamp(u, 0, 1)), 0.75);
  const rx = (u: number): number => c.r * (1.06 + 0.2 * estufa(u));
  const rz = (u: number): number => c.r * (0.92 + 0.5 * estufa(u));
  const gomo = (fi: number): number => Math.pow(Math.abs(Math.cos(fi * GOMOS * 0.5)), 0.55);
  const naAbobora = (x: number, y: number, sai = 0): THREE.Vector3 => {
    const u = (y - y0) / (y1 - y0);
    const fi = x / rx(u);
    const k = 0.95 + 0.05 * gomo(fi);
    return new THREE.Vector3(Math.sin(fi) * (rx(u) * k + sai), y, Math.cos(fi) * (rz(u) * k + sai));
  };

  // A CASCA: a grade de gomos, com a cor por vértice
  {
    const NC = 96;
    const NL = 22;
    const pos: number[] = [];
    const cores: number[] = [];
    const uv: number[] = [];
    const cMeio = new THREE.Color(laranja);
    const cVinco = new THREE.Color(P.fantasiaAboboraGomo);
    const cClara = new THREE.Color(P.fantasiaAboboraClara);
    for (let i = 0; i <= NC; i++) {
      const fi = -Math.PI + (i / NC) * Math.PI * 2;
      const gm = gomo(fi);
      for (let j = 0; j <= NL; j++) {
        const u = j / NL;
        const y = THREE.MathUtils.lerp(y0, y1, u);
        // as bocas viram para dentro (a abóbora fecha embaixo e em cima)
        const fecha = 1 - 0.08 * (Math.pow(1 - u, 6) + Math.pow(u, 6));
        const k = (0.95 + 0.05 * gm) * fecha;
        pos.push(Math.sin(fi) * rx(u) * k, y, Math.cos(fi) * rz(u) * k);
        const luz = THREE.MathUtils.smoothstep(u, 0.45, 0.85) * Math.max(0, Math.cos(fi)) * 0.35;
        const col = cVinco.clone().lerp(cMeio, gm).lerp(cClara, luz * gm);
        cores.push(col.r, col.g, col.b);
        uv.push(fi * c.r, y);
      }
    }
    const idx: number[] = [];
    for (let i = 0; i < NC; i++) {
      for (let j = 0; j < NL; j++) {
        const a = i * (NL + 1) + j;
        const b = (i + 1) * (NL + 1) + j;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, toon(0xffffff, { corPorVertice: true, mapa: feltro(0.07), doubleSide: true })));
  }
  // as duas bocas enroladas (a de cima e a de baixo)
  const vivo = toon(P.fantasiaAboboraGomo);
  for (const [u, y] of [[0, y0], [1, y1]] as const) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(rx(u) * 0.92, h * 0.007, 6, 48), vivo);
    anel.rotation.x = Math.PI / 2;
    anel.scale.set(1, (rz(u) * 0.92) / (rx(u) * 0.92), 1);
    anel.position.y = y;
    g.add(anel);
  }

  // A CARINHA: tudo desenhado no plano (x = arco, y = altura) e dobrado na casca
  const yCara = THREE.MathUtils.lerp(y0, y1, 0.52);
  const e = h * 0.04; // a unidade da carinha
  const naCasca = (forma: THREE.Shape | THREE.Shape[], sai: number, mat: THREE.Material): THREE.Mesh => {
    const geo = new THREE.ShapeGeometry(forma, 10);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const v = naAbobora(p.getX(i), yCara + p.getY(i), sai);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, mat);
  };
  const marrom = toon(P.fantasiaAboboraCara);
  const brilho = toon(0xfff3d6);
  for (const s of [-1, 1] as const) {
    // o olho: um triângulo de quinas redondas, com o brilhinho no canto
    const olho = new THREE.Shape();
    const cx = s * e * 0.62;
    const cy = e * 0.42;
    olho.moveTo(cx - e * 0.32, cy - e * 0.2);
    olho.quadraticCurveTo(cx, cy - e * 0.3, cx + e * 0.32, cy - e * 0.2);
    olho.quadraticCurveTo(cx + e * 0.3, cy - e * 0.06, cx + e * 0.04, cy + e * 0.3);
    olho.quadraticCurveTo(cx, cy + e * 0.36, cx - e * 0.04, cy + e * 0.3);
    olho.quadraticCurveTo(cx - e * 0.3, cy - e * 0.06, cx - e * 0.32, cy - e * 0.2);
    g.add(naCasca(olho, h * 0.0025, marrom));
    g.add(naCasca(circulo(e * 0.07, cx - e * 0.08, cy - e * 0.02), h * 0.0035, brilho));
    // a bochecha rosada, embaixo e por fora do olho
    g.add(naCasca(circulo(e * 0.2, s * e * 1.05, -e * 0.15, 0.62), h * 0.002, toon(P.fantasiaAboboraBochecha)));
  }
  // o narizinho
  const nariz = new THREE.Shape();
  nariz.moveTo(-e * 0.12, e * 0.02);
  nariz.quadraticCurveTo(0, -e * 0.03, e * 0.12, e * 0.02);
  nariz.quadraticCurveTo(e * 0.04, e * 0.12, 0, e * 0.16);
  nariz.quadraticCurveTo(-e * 0.04, e * 0.12, -e * 0.12, e * 0.02);
  g.add(naCasca(nariz, h * 0.0025, marrom));
  // o sorriso, e os dois dentinhos laranja por cima dele
  const boca = new THREE.Shape();
  boca.moveTo(-e * 0.75, -e * 0.2);
  boca.quadraticCurveTo(0, -e * 0.42, e * 0.75, -e * 0.2);
  boca.quadraticCurveTo(e * 0.55, -e * 0.78, 0, -e * 0.8);
  boca.quadraticCurveTo(-e * 0.55, -e * 0.78, -e * 0.75, -e * 0.2);
  g.add(naCasca(boca, h * 0.0025, marrom));
  for (const s of [-1, 1] as const) {
    const dente = new THREE.Shape();
    const x0 = s * e * 0.2;
    dente.moveTo(x0 - e * 0.1, -e * 0.32);
    dente.lineTo(x0 + e * 0.1, -e * 0.32);
    dente.lineTo(x0 + e * 0.09, -e * 0.5);
    dente.quadraticCurveTo(x0, -e * 0.55, x0 - e * 0.09, -e * 0.5);
    dente.closePath();
    g.add(naCasca(dente, h * 0.0035, toon(laranja)));
  }

  // AS ALÇAS do macacão: da beira de cima, por cima do ombro, até as costas
  const verde = toon(P.fantasiaAboboraVerde, { mapa: feltro(0.04) });
  for (const s of [-1, 1] as const) {
    const pontos: Array<[number, number]> = [
      [s * 0.42, y1 - h * 0.006],
      [s * 0.5, c.ombro - m.torsoH * 0.04],
      [s * 0.75, c.topo - m.torsoH * 0.03],
      [s * 1.6, c.topo - m.torsoH * 0.02],
      [s * 2.5, c.ombro - m.torsoH * 0.04],
      [s * 2.7, y1 - h * 0.006],
    ];
    g.add(new THREE.Mesh(vivoNaPele(m, pontos, h * 0.0075, 1.1), verde));
    const botao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.009, 12, 8), toon(P.fantasiaAboboraVerdeEscuro));
    botao.position.copy(naAbobora(Math.sin(s * 0.42) * rx(1) * 0.98, y1 - h * 0.018, h * 0.003));
    botao.scale.set(1, 1, 0.5);
    botao.lookAt(botao.position.clone().multiplyScalar(2).setY(botao.position.y));
    g.add(botao);
  }
  // a gola canelada da camiseta
  const yGola = c.topo - m.torsoH * 0.02;
  const gola = new THREE.Mesh(new THREE.TorusGeometry(c.r * 0.64, h * 0.008, 8, 28), toon(escuro(camiseta, 0.85), { mapa: trico(0.03) }));
  gola.rotation.x = Math.PI / 2 - 0.25;
  gola.position.set(0, yGola + h * 0.004, c.r * 0.12);
  g.add(gola);
  return fundir(g);
}

/** a MANGA verde da camiseta da abóbora (`extraBraco`): de tricô, com o punho canelado */
function mangaDeAbobora(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.corDetalhe ?? peca?.cor ?? P.fantasiaAboboraVerdeEscuro;
  const L = m.armLen;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.047 * w, h * 0.014],
    [h * 0.05 * w, -h * 0.012],
    [h * 0.047 * w, -L * 0.4],
    [h * 0.045 * w, -L * 0.72],
  ], 0, () => 0, 24), toon(cor, { mapa: trico(0.035), doubleSide: true })));
  const punho = new THREE.Mesh(torneada([[h * 0.044 * w, -L * 0.71], [h * 0.045 * w, -L * 0.77]], 12, () => h * 0.0025, 24), toon(escuro(cor, 0.82)));
  g.add(punho);
  return fundir(g);
}

/**
 * A MEIA-CALÇA VERDE (pernas): a `cor` pinta a perna de verde, e por cima o
 * TRICÔ (um tubo rente, com a trama de V), o punho canelado no tornozelo e,
 * no joelho de fora, uma folhinha bordada.
 */
function meiaCalcaVerde(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.fantasiaAboboraVerde;
  const TOPO = h * 0.012;
  const FIM = -m.legH * 0.86;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, TOPO + h * 0.004],
    [h * 0.05 * w, TOPO],
    [h * 0.048 * w, -m.legH * 0.4],
    [h * 0.046 * w, FIM],
  ], 0, () => 0, 24), toon(cor, { mapa: trico(0.03), doubleSide: true })));
  // a folhinha no joelho, do lado de fora
  const folha = new THREE.Mesh(folhaDeAbobora(h * 0.03, 0.15), toon(P.fantasiaAboboraFolhaClara, { doubleSide: true }));
  const yJoelho = -m.legH * 0.5;
  folha.position.set(lado * h * 0.04 * w, yJoelho, h * 0.03 * w);
  folha.lookAt(lado * h * 0.4, yJoelho, h * 0.4);
  folha.rotateZ(lado * 0.4);
  g.add(folha);
  return fundir(g);
}

/**
 * A BOTINHA VERDE (pés), que substitui o pé: de bico redondo e alto, de
 * feltro, com a sola creme, e o cano curto que termina num CÁLICE de seis
 * pontas de folha virando para fora — o pé da abóbora.
 */
function botinhaVerde(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const h = m.h;
  const p = pe(m);
  const cor = peca?.cor ?? P.fantasiaAboboraVerde;
  const cano = h * 0.075;
  const { g, rCano } = bota(m, { cor, sola: 0xf3ead8, cano, abre: h * 0.004, rebaixa: 0.15, escala: 1.08, textura: feltro(0.05) });
  // o cálice: seis pontas de folha na boca do cano, virando para fora
  const matFolha = toon(P.fantasiaAboboraFolha, { doubleSide: true });
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2 + 0.25;
    const f = new THREE.Shape();
    f.moveTo(-h * 0.014, 0);
    f.quadraticCurveTo(-h * 0.012, h * 0.014, 0, h * 0.026);
    f.quadraticCurveTo(h * 0.012, h * 0.014, h * 0.014, 0);
    f.closePath();
    const ponta = new THREE.Mesh(new THREE.ShapeGeometry(f, 6), matFolha);
    const R = rCano * 1.06;
    ponta.position.set(Math.sin(a) * R, p.chao + cano - h * 0.006, Math.cos(a) * R);
    ponta.rotation.set(0, a, 0, 'YXZ');
    ponta.rotateX(-0.55);
    g.add(ponta);
  }
  return fundir(g);
}

/** as LUVINHAS VERDES (mãos): gordinhas, de feltro, punho canelado e uma folhinha no dorso */
function luvinhasVerdes(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.fantasiaAboboraVerde;
  const mat = toon(cor, { mapa: feltro(0.04) });
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.12, 16, 12), mat);
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.1, 0.98);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.013 * w, h * 0.014, 4, 8), mat);
  polegar.position.set(-lado * h * 0.022 * w, c.yMao + h * 0.004, h * 0.026 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  g.add(new THREE.Mesh(torneada([[h * 0.037 * w, c.yPulso - h * 0.01], [h * 0.039 * w, c.yPulso + h * 0.018]], 12, () => h * 0.002, 20), toon(P.fantasiaAboboraVerdeEscuro)));
  const folha = new THREE.Mesh(folhaDeAbobora(h * 0.022, 0.15), toon(P.fantasiaAboboraFolhaClara, { doubleSide: true }));
  folha.position.set(lado * c.raioMao * 1.1, c.yMao + h * 0.008, 0);
  folha.lookAt(lado * h, c.yMao + h * 0.008, 0);
  folha.rotateZ(Math.PI);
  g.add(folha);
  return fundir(g);
}

/**
 * A GOLA DE FOLHAS (acessório, no corpo): nove folhas de abóbora em volta do
 * pescoço, deitando nos ombros e se sobrepondo, em dois verdes, cada uma com
 * as nervuras — e uma gavinha enrolada caindo na frente.
 */
function golaDeFolhas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const escura = peca?.cor ?? P.fantasiaAboboraFolha;
  const clara = peca?.corDetalhe ?? P.fantasiaAboboraFolhaClara;
  const yGola = c.topo - m.torsoH * 0.06;
  const rBase = Math.max(raioDoTronco(m, yGola) * 1.05, c.r * 0.62);
  const L = h * 0.075;
  const N = 9;
  const mats = [toon(escura, { mapa: feltro(0.04), doubleSide: true }), toon(clara, { mapa: feltro(0.04), doubleSide: true })];
  const nerv = [toon(clara), toon(escuro(escura, 0.8))];
  const geoFolha = folhaDeAbobora(L, 0.22);
  const geoNerv = nervurasDaFolha(L, 0.22, h * 0.0018);
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 + 0.17;
    const qual = k % 2;
    const folha = new THREE.Group();
    folha.add(new THREE.Mesh(geoFolha, mats[qual]));
    for (const n of geoNerv) folha.add(new THREE.Mesh(n, nerv[qual]));
    // a base no pescoço; a folha sai para fora e desce pelo ombro
    const desce = 0.75 + (qual ? 0.12 : 0);
    const fora = new THREE.Vector3(Math.sin(a), 0, Math.cos(a) * 0.82).normalize();
    const y = new THREE.Vector3().copy(fora).multiplyScalar(Math.cos(desce)).setY(-Math.sin(desce)).normalize();
    const x = new THREE.Vector3(-Math.cos(a), 0, Math.sin(a)).normalize();
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    folha.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    folha.position.set(Math.sin(a) * rBase, yGola + (qual ? h * 0.004 : 0), Math.cos(a) * rBase * 0.82);
    g.add(folha);
  }
  // a gavinha caindo na frente, do lado direito
  const de = new THREE.Vector3(Math.sin(0.4) * rBase * 1.15, yGola - h * 0.01, Math.cos(0.4) * rBase * 1.05);
  g.add(new THREE.Mesh(gavinha(de, new THREE.Vector3(0.2, -1, 0.35), h * 0.07, h * 0.0028, 2.5), toon(clara)));
  return fundir(g);
}

// ================================================================ O PIRATA

/**
 * O TRICÓRNIO (cabeça): a copa de feltro preto e a aba de três lados
 * dobrados para cima — dois cantos nas laterais e um atrás, a dobra da
 * frente bem alta —, com o vivo dourado na beira toda, a CAVEIRINHA
 * SORRIDENTE bordada na dobra da frente (de ossinhos cruzados, sem susto
 * nenhum) e a PENA vermelha de ponta branca saindo do lado esquerdo.
 */
function tricornio(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const preto = peca?.cor ?? P.pirataChapeu;
  const ouro = peca?.corDetalhe ?? P.fivelaDourada;
  const chapeu = new THREE.Group();
  chapeu.rotation.set(-0.05, 0, 0.04);
  g.add(chapeu);
  const RC = r * 0.84;
  const base = alturaDaAba(m, RC);
  const feltroPreto = toon(preto, { mapa: veludo(0.08), doubleSide: true });
  const copa = torneada([[RC, 0], [RC * 0.99, r * 0.28], [RC * 0.88, r * 0.46], [RC * 0.5, r * 0.56], [0.0001, r * 0.58]], 0, () => 0, 48);
  copa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(copa, feltroPreto));

  // A ABA: uma grade em anel que sobe nos três lados dobrados
  const NA = 96;
  const NR = 9;
  /** 1 no meio de cada lado dobrado (frente e ±120°), 0 nos três cantos */
  const dobra = (fi: number): number => 0.5 + 0.5 * Math.cos(3 * fi);
  const RA = (fi: number): number => r * 1.46 * (1 + 0.1 * (1 - dobra(fi)));
  const naAba = (fi: number, t: number): THREE.Vector3 => {
    const d = dobra(fi);
    const R = THREE.MathUtils.lerp(RC * 0.98, RA(fi), t) * (1 - 0.16 * t * t * d);
    const y = base + Math.pow(t, 1.5) * r * 0.66 * d - t * r * 0.03;
    return new THREE.Vector3(Math.sin(fi) * R, y, Math.cos(fi) * R);
  };
  {
    const pos: number[] = [];
    const uv: number[] = [];
    for (let i = 0; i <= NA; i++) {
      const fi = -Math.PI + (i / NA) * Math.PI * 2;
      for (let j = 0; j <= NR; j++) {
        const p = naAba(fi, j / NR);
        pos.push(p.x, p.y, p.z);
        uv.push(fi * r, (j / NR) * r);
      }
    }
    const idx: number[] = [];
    for (let i = 0; i < NA; i++) {
      for (let j = 0; j < NR; j++) {
        const a = i * (NR + 1) + j;
        const b = (i + 1) * (NR + 1) + j;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    chapeu.add(new THREE.Mesh(geo, feltroPreto));
  }
  // o vivo dourado na beira
  const beira: THREE.Vector3[] = [];
  for (let i = 0; i < 96; i++) beira.push(naAba(-Math.PI + (i / 96) * Math.PI * 2, 1));
  const matOuro = toon(ouro);
  chapeu.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(beira, true), 192, r * 0.025, 6, true), matOuro));

  // A CAVEIRINHA na dobra da frente: deitada na aba, olhando para fora
  {
    const t = 0.6;
    const p = naAba(0, t);
    const ladoA = naAba(0.05, t).sub(naAba(-0.05, t));
    const subida = naAba(0, t + 0.05).sub(naAba(0, t - 0.05));
    const n = new THREE.Vector3().crossVectors(ladoA, subida).normalize();
    if (n.z < 0) n.negate();
    const caveira = new THREE.Group();
    const e = r * 0.21;
    const branco = toon(P.pirataBranco);
    const fundo = toon(escuro(preto, 1.6));
    // os ossinhos cruzados, por trás
    for (const s of [-1, 1] as const) {
      const osso = new THREE.Group();
      const haste = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.1, e * 1.9, 3, 8), branco);
      osso.add(haste);
      for (const k of [-1, 1]) for (const j of [-1, 1]) {
        const no = new THREE.Mesh(new THREE.SphereGeometry(e * 0.15, 8, 6), branco);
        no.position.set(j * e * 0.1, k * e * 1.0, 0);
        osso.add(no);
      }
      osso.rotation.z = s * 0.85;
      osso.position.set(0, -e * 0.2, -e * 0.12);
      osso.scale.z = 0.5;
      caveira.add(osso);
    }
    // a cabeça redondinha e a queixada
    const cabeca = new THREE.Mesh(new THREE.SphereGeometry(e * 0.72, 18, 12), branco);
    cabeca.scale.set(1, 0.92, 0.35);
    caveira.add(cabeca);
    const queixo = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.32, e * 0.4, 4, 10), branco);
    queixo.rotation.z = Math.PI / 2;
    queixo.position.set(0, -e * 0.62, 0);
    queixo.scale.z = 0.35;
    caveira.add(queixo);
    // os olhos fofos (grandes e redondos), o narizinho de coração e o sorriso
    for (const s of [-1, 1] as const) {
      const olho = new THREE.Mesh(new THREE.CircleGeometry(e * 0.2, 16), fundo);
      olho.scale.y = 1.15;
      olho.position.set(s * e * 0.28, e * 0.04, e * 0.26);
      caveira.add(olho);
      const luz = new THREE.Mesh(new THREE.CircleGeometry(e * 0.06, 8), branco);
      luz.position.set(s * e * 0.28 - e * 0.06, e * 0.1, e * 0.262);
      caveira.add(luz);
    }
    const nariz = new THREE.Mesh(new THREE.CircleGeometry(e * 0.08, 3), fundo);
    nariz.rotation.z = Math.PI / 2;
    nariz.position.set(0, -e * 0.22, e * 0.255);
    caveira.add(nariz);
    const sorriso = new THREE.Mesh(new THREE.TorusGeometry(e * 0.3, e * 0.035, 4, 16, Math.PI * 0.8), fundo);
    sorriso.rotation.z = Math.PI + Math.PI * 0.1;
    sorriso.position.set(0, -e * 0.4, e * 0.2);
    caveira.add(sorriso);
    for (let k = -1; k <= 1; k++) {
      const dente = new THREE.Mesh(new THREE.BoxGeometry(e * 0.025, e * 0.12, e * 0.02), fundo);
      dente.position.set(k * e * 0.15, -e * 0.66, e * 0.12);
      caveira.add(dente);
    }
    caveira.position.copy(p).addScaledVector(n, r * 0.025);
    caveira.lookAt(caveira.position.clone().add(n));
    chapeu.add(caveira);
  }

  // A PENA: o canhão dourado e a pluma vermelha de ponta branca, curvada para trás
  {
    const fi = -1.15;
    const raiz = new THREE.Vector3(Math.sin(fi) * RC * 1.0, base + r * 0.2, Math.cos(fi) * RC * 1.0);
    const curva = new THREE.CatmullRomCurve3([
      raiz,
      raiz.clone().add(new THREE.Vector3(-r * 0.12, r * 0.35, -r * 0.12)),
      raiz.clone().add(new THREE.Vector3(-r * 0.2, r * 0.72, -r * 0.42)),
      raiz.clone().add(new THREE.Vector3(-r * 0.18, r * 0.9, -r * 0.82)),
    ]);
    chapeu.add(new THREE.Mesh(tuboAfinado(curva, 30, r * 0.022, r * 0.008, 5), toon(P.pirataBranco)));
    const vermelha = toon(P.pirataPena, { doubleSide: true });
    const branca = toon(P.pirataBranco, { doubleSide: true });
    // a pluma: pares de "fios" saindo do canhão, cada vez mais curtos, com o recorte de pena
    const N = 26;
    const pluma: number[] = [];
    const pontaBranca: number[] = [];
    const P0 = new THREE.Vector3();
    const T = new THREE.Vector3();
    for (let k = 0; k < N; k++) {
      const t = 0.08 + (k / N) * 0.9;
      curva.getPointAt(t, P0);
      curva.getTangentAt(t, T);
      // o leque abre de LADO (no plano da copa), e não para a frente: de frente ele sumia num risco
      const lado = new THREE.Vector3(Math.sin(fi), 0, Math.cos(fi)).cross(T).normalize();
      const largura = r * 0.3 * Math.sin(Math.PI * Math.min(1, t * 1.08)) * (k % 3 === 2 ? 0.72 : 1);
      for (const s of [-1, 1]) {
        const a = P0.clone();
        const b = P0.clone().addScaledVector(lado, s * largura).addScaledVector(T, -r * 0.06);
        const c2 = P0.clone().addScaledVector(T, r * 0.045);
        const lista = t > 0.82 ? pontaBranca : pluma;
        lista.push(a.x, a.y, a.z, b.x, b.y, b.z, c2.x, c2.y, c2.z);
      }
    }
    for (const [lista, mat] of [[pluma, vermelha], [pontaBranca, branca]] as const) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(lista, 3));
      geo.computeVertexNormals();
      chapeu.add(new THREE.Mesh(geo, mat));
    }
  }
  return fundir(g);
}

/**
 * A CAMISA DE PIRATA (tronco): a `cor` pinta a camisa de branco por baixo;
 * por cima vai a casca LISTRADA de vermelho e branco (as listras são canvas),
 * o decote em V amarrado com o cordão cruzado, o COLETE CURTO azul-marinho
 * aberto na frente, com o vivo e os seis botões dourados, e a FAIXA
 * vermelha na cintura com o nó do lado esquerdo e as duas pontas caindo.
 */
function camisaDePirata(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const branco = peca?.cor ?? P.pirataBranco;
  const vermelho = peca?.corDetalhe && peca.corDetalhe !== branco ? peca.corDetalhe : P.pirataListra;
  const yGola = c.topo - m.torsoH * 0.02;
  const fundoDoV = yGola - h * 0.05;
  const decote = (a: number): number => {
    const k = Math.min(1, Math.abs(a) / 0.3);
    return fundoDoV + (yGola - fundoDoV) * Math.pow(k, 0.8);
  };
  const listrado = toon(0xffffff, { mapa: listrasDeMeia(branco, vermelho, h * 0.05), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote, folga: 1.06, colunas: 72, linhas: 18 }), listrado));
  // o cordão cruzado no V, e o laço embaixo
  const cordao = toon(P.pirataCouroClaro);
  for (let k = 0; k < 3; k++) {
    const y = fundoDoV + h * 0.006 + k * h * 0.014;
    const abre = 0.06 + (y - fundoDoV) / (yGola - fundoDoV) * 0.2;
    for (const s of [-1, 1] as const) {
      g.add(new THREE.Mesh(vivoNaPele(m, [[-s * abre, y], [0, y + h * 0.006], [s * abre, y + h * 0.013]], h * 0.0016, 1.075), cordao));
    }
  }
  const lacinho = lacoDeFita(h * 0.008, P.pirataCouroClaro, 1.4);
  lacinho.position.copy(naPele(m, 0, fundoDoV - h * 0.004, 1.09));
  g.add(lacinho);

  // O COLETE: aberto na frente, curto (acaba em cima da faixa)
  const colete = P.pirataColete;
  const baixo = c.quadril + m.torsoH * 0.22;
  const ABERTO = 0.36;
  const decoteDoColete = (a: number): number => {
    const k = Math.abs(a);
    if (k < ABERTO) return baixo;
    return THREE.MathUtils.lerp(c.quadril + m.torsoH * 0.5, yGola - h * 0.006, THREE.MathUtils.smoothstep(k, ABERTO, 1.15));
  };
  const pano = toon(colete, { mapa: veludo(0.1), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote: decoteDoColete, baixo, folga: 1.085, colunas: 96, linhas: 18 }), pano));
  const matOuro = toon(P.fivelaDourada);
  for (const s of [-1, 1] as const) {
    // o vivo da beira da frente e o botões
    const beira: Array<[number, number]> = [[s * (ABERTO + 0.01), baixo + h * 0.002]];
    for (let i = 0; i <= 10; i++) {
      const a = s * (ABERTO + 0.01 + (i / 10) * 0.8);
      beira.push([a, decoteDoColete(Math.abs(a) < ABERTO + 0.02 ? s * (ABERTO + 0.02) : a) + h * 0.001]);
    }
    g.add(new THREE.Mesh(vivoNaPele(m, beira, h * 0.0026, 1.1), matOuro));
    for (let k = 0; k < 3; k++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0052, 10, 8), matOuro);
      b.position.copy(naPele(m, s * (ABERTO + 0.1), baixo + h * 0.014 + k * h * 0.024, 1.1));
      b.scale.set(1, 1, 0.6);
      g.add(b);
    }
  }
  const barra: Array<[number, number]> = [];
  for (let i = 0; i <= 30; i++) {
    const a = ABERTO + 0.01 + (i / 30) * (Math.PI * 2 - 2 * ABERTO - 0.02);
    barra.push([a, baixo + h * 0.002]);
  }
  g.add(new THREE.Mesh(vivoNaPele(m, barra, h * 0.0026, 1.1), matOuro));

  // A FAIXA vermelha na cintura, o nó e as duas pontas
  const yFaixa0 = c.quadril + m.torsoH * 0.04;
  const yFaixa1 = c.quadril + m.torsoH * 0.21;
  const faixa = toon(P.pirataFaixa, { mapa: linho(0.06), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote: () => yFaixa1, baixo: yFaixa0, folga: 1.12, colunas: 64, linhas: 6, solto: (a, y) => h * 0.004 * Math.sin(y * 300 + a * 4) }), faixa));
  const aNo = -1.0;
  const pNo = naPele(m, aNo, (yFaixa0 + yFaixa1) / 2, 1.18);
  const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.016, 12, 8), faixa);
  no.position.copy(pNo);
  no.scale.set(1, 0.85, 0.7);
  g.add(no);
  for (const s of [-1, 1] as const) {
    const ponta = new THREE.Shape();
    ponta.moveTo(-h * 0.011, 0);
    ponta.lineTo(h * 0.011, 0);
    ponta.lineTo(h * 0.014, -h * 0.07);
    ponta.lineTo(0, -h * 0.06);
    ponta.lineTo(-h * 0.014, -h * 0.07);
    ponta.closePath();
    const geo = new THREE.ShapeGeometry(ponta, 4);
    const pano2 = new THREE.Mesh(geo, faixa);
    pano2.position.copy(pNo).add(new THREE.Vector3(0, -h * 0.006, 0));
    pano2.lookAt(pNo.clone().multiplyScalar(2).setY(pNo.y));
    pano2.rotateZ(s * 0.18);
    pano2.rotateY(s * 0.25);
    g.add(pano2);
  }
  return fundir(g);
}

/** a MANGA BUFANTE listrada da camisa de pirata (`extraBraco`): estufa no cotovelo e franze no punho com o babado */
function mangaDePirata(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const branco = peca?.cor ?? P.pirataBranco;
  const vermelho = P.pirataListra;
  const L = m.armLen;
  const listrado = toon(0xffffff, { mapa: listrasDeMeia(branco, vermelho, h * 0.05), doubleSide: true });
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.05 * w, h * 0.014],
    [h * 0.054 * w, -h * 0.012],
    [h * 0.058 * w, -L * 0.3],
    [h * 0.066 * w, -L * 0.52],
    [h * 0.06 * w, -L * 0.66],
    [h * 0.04 * w, -L * 0.74],
  ], 12, (t) => (t > 0.4 ? h * 0.005 * (t - 0.4) * 1.8 : 0), 30), listrado));
  // o punho e o babado branco
  g.add(new THREE.Mesh(torneada([[h * 0.041 * w, -L * 0.73], [h * 0.042 * w, -L * 0.775]], 0, () => 0, 24), toon(branco)));
  g.add(new THREE.Mesh(torneada([
    [h * 0.041 * w, -L * 0.77],
    [h * 0.048 * w, -L * 0.785],
    [h * 0.056 * w, -L * 0.81],
  ], 14, (t) => h * 0.005 * t, 36), toon(branco, { doubleSide: true })));
  return fundir(g);
}

/**
 * A CALÇA BUFANTE (pernas): a `cor` pinta a meia creme por baixo (a perna
 * do rig), e por cima de cada perna o BALÃO de camurça franzido em pregas,
 * do quadril até logo abaixo do joelho, onde aperta na faixa com o botão
 * dourado do lado de fora.
 */
function calcaBufante(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const pano = peca?.corDetalhe ?? P.pirataCalca;
  const L = m.legH;
  const yFaixa = -L * 0.52;
  g.add(new THREE.Mesh(torneada([
    [h * 0.03 * w, h * 0.02],
    [h * 0.056 * w, h * 0.012],
    [h * 0.064 * w, -L * 0.14],
    [h * 0.066 * w, -L * 0.3],
    [h * 0.06 * w, -L * 0.43],
    [h * 0.048 * w, yFaixa],
  ], 12, (t) => h * 0.006 * Math.sin(Math.PI * t), 32), toon(pano, { mapa: veludo(0.08), doubleSide: true })));
  // a faixa do joelho e o botão
  const corFaixa = escuro(pano, 0.75);
  g.add(new THREE.Mesh(torneada([[h * 0.049 * w, yFaixa + h * 0.004], [h * 0.05 * w, yFaixa - h * 0.024]], 0, () => 0, 24), toon(corFaixa)));
  const botao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.006, 10, 8), toon(P.fivelaDourada));
  botao.position.set(lado * h * 0.05 * w, yFaixa - h * 0.01, h * 0.012);
  botao.scale.set(0.6, 1, 1);
  g.add(botao);
  return fundir(g);
}

/**
 * A BOTA DE PIRATA (pés), que substitui o pé: o couro escuro até debaixo do
 * joelho, o CANO DOBRADO de couro claro abrindo em cálice na boca, a tira do
 * tornozelo com a fivela dourada quadrada.
 */
function botasDePirata(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const h = m.h;
  const p = pe(m);
  const couro = peca?.cor ?? P.pirataCouro;
  const dobra = peca?.corDetalhe ?? P.pirataCouroClaro;
  const cano = m.legH * 0.4;
  const { g, rCano, topoEm } = bota(m, { cor: couro, sola: 0x231812, cano, rebaixa: 0.35, escala: 1.04, textura: veludo(0.06) });
  // o cano dobrado: um cálice de couro claro por cima da boca
  g.add(new THREE.Mesh(torneada([
    [rCano * 1.04, p.chao + cano - h * 0.05],
    [rCano * 1.12, p.chao + cano - h * 0.03],
    [rCano * 1.24, p.chao + cano + h * 0.004],
    [rCano * 1.04, p.chao + cano + h * 0.006],
  ], 8, () => h * 0.003, 28), toon(dobra, { mapa: veludo(0.06), doubleSide: true })));
  // a tira do tornozelo e a fivela
  const yTira = p.chao + h * 0.048;
  g.add(new THREE.Mesh(torneada([[rCano * 1.03, yTira - h * 0.006], [rCano * 1.03, yTira + h * 0.006]], 0, () => 0, 24), toon(escuro(couro, 1.5))));
  const matOuro = toon(P.fivelaDourada);
  const quadro = new THREE.Group();
  quadro.position.set(0, yTira, rCano * 1.05);
  const Lf = h * 0.018;
  const E = h * 0.003;
  for (const [x, y, lx, ly] of [[0, Lf / 2, Lf + E, E], [0, -Lf / 2, Lf + E, E], [Lf / 2, 0, E, Lf], [-Lf / 2, 0, E, Lf]] as const) {
    const lado = new THREE.Mesh(new THREE.BoxGeometry(lx, ly, E), matOuro);
    lado.position.set(x, y, 0);
    quadro.add(lado);
  }
  g.add(quadro);
  void topoEm;
  return fundir(g);
}

/** a espadinha de madeira: lâmina de ponta redonda, guarda, o cabo enrolado de cordão e o pomo (ao longo de `+Y`, o cabo na origem) */
function espadinhaDeMadeira(h: number): THREE.Group {
  const g = new THREE.Group();
  const madeira = toon(P.pirataMadeira, { mapa: veio(P.pirataMadeira, 0.05) });
  const escura = toon(P.pirataMadeiraEscura);
  const LB = h * 0.16;
  const LG = h * 0.012;
  const f = new THREE.Shape();
  f.moveTo(-LG, 0);
  f.lineTo(LG, 0);
  f.lineTo(LG * 0.9, LB * 0.82);
  f.quadraticCurveTo(LG * 0.6, LB * 0.97, 0, LB);
  f.quadraticCurveTo(-LG * 0.6, LB * 0.97, -LG * 0.9, LB * 0.82);
  f.closePath();
  const lamina = chapa(f, h * 0.0035, h * 0.0018, 6);
  lamina.translate(0, h * 0.028, -h * 0.00175);
  g.add(new THREE.Mesh(lamina, madeira));
  // o sulco do meio da lâmina, um tom mais fundo
  const sulco = new THREE.Mesh(new THREE.BoxGeometry(h * 0.003, LB * 0.7, h * 0.0062), escura);
  sulco.position.y = h * 0.028 + LB * 0.4;
  g.add(sulco);
  // a guarda: um rolinho atravessado com as pontas redondas
  const guarda = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.006, h * 0.04, 4, 8), escura);
  guarda.rotation.z = Math.PI / 2;
  guarda.position.y = h * 0.026;
  g.add(guarda);
  // o cabo, enrolado de cordão vermelho, e o pomo
  const cabo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0055, h * 0.006, h * 0.034, 10), madeira);
  cabo.position.y = h * 0.006;
  g.add(cabo);
  const cord = toon(P.pirataFaixa);
  for (let k = 0; k < 5; k++) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(h * 0.0062, h * 0.0016, 4, 12), cord);
    anel.rotation.x = Math.PI / 2 + 0.25;
    anel.position.y = -h * 0.008 + k * h * 0.006;
    g.add(anel);
  }
  const pomo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.009, 10, 8), escura);
  pomo.position.y = -h * 0.014;
  g.add(pomo);
  return g;
}

/**
 * AS LUVAS DE PUNHO LARGO (mãos): de couro caramelo, o punho abrindo em
 * cálice com a costura em volta — e na mão ESQUERDA a ESPADINHA DE MADEIRA,
 * apontando para a frente e para baixo (a direita fica livre, como em toda
 * peça de uma mão só: é ela que segura o sorvete).
 */
function luvasDePirata(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.pirataCouroClaro;
  const mat = toon(cor, { mapa: veludo(0.05) });
  g.add(new THREE.Mesh(torneada([
    [h * 0.035 * w, c.yPulso - h * 0.012],
    [h * 0.04 * w, c.yPulso + h * 0.012],
    [h * 0.054 * w, c.yPulso + h * 0.044],
    [h * 0.058 * w, c.yPulso + h * 0.05],
  ], 0, () => 0, 26), toon(cor, { mapa: veludo(0.05), doubleSide: true })));
  const costura = new THREE.Mesh(new THREE.TorusGeometry(h * 0.055 * w, h * 0.0016, 4, 26), toon(escuro(cor, 0.62)));
  costura.rotation.x = Math.PI / 2;
  costura.position.y = c.yPulso + h * 0.044;
  g.add(costura);
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.1, 16, 12), mat);
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.08, 0.96);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.013 * w, h * 0.016, 4, 8), mat);
  polegar.position.set(-lado * h * 0.022 * w, c.yMao + h * 0.004, h * 0.026 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  if (lado === -1) {
    const espada = espadinhaDeMadeira(h);
    const dir = new THREE.Vector3(lado * 0.28, -0.5, 1).normalize();
    espada.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    espada.position.set(0, c.yMao, h * 0.006);
    g.add(espada);
  }
  return fundir(g);
}

/**
 * O PAPAGAIO (acessório, no ombro direito): uma ararinha vermelha gordinha,
 * de asa amarela e azul, o rosto branco com o olho brilhante, o bico curvo
 * de marfim, o rabo comprido caindo pelas costas e os pezinhos agarrados no
 * ombro. A CABEÇA se mexe — inclina de um lado para o outro, curiosa — num
 * grupo com nome, fora da `fundir()`.
 */
function papagaio(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const vermelho = peca?.cor ?? P.papagaioVermelho;
  const amarelo = P.papagaioAmarelo;
  const azul = P.papagaioAzul;
  // A CONTA DO POUSO: no chibi a cabeça grande fica POR CIMA do ombro (o
  // fundo dela está ~6 cm acima do pivô do braço, a 15 cm do meio), e a
  // primeira ararinha, de pé no alto do ombro, enfiava a cabeça dentro da
  // cabeça de quem veste. Ela pousa na quina de fora do ombro, um tico à
  // frente, inclinada para fora — a cabeça dela fica ao lado da bochecha,
  // onde a câmera vê. Do tamanho de um punho: menor, o cabelo do Ari a
  // engolia inteira na isométrica
  const e = h * 0.05;
  const ave = new THREE.Group();
  ave.name = 'papagaio';
  ave.position.set(c.meioOmbro + h * 0.048, c.ombro + h * 0.002, h * 0.05);
  ave.rotation.set(0, 0.6, -0.5);
  g.add(ave);
  const corpoFixo = new THREE.Group();
  ave.add(corpoFixo);
  const matV = toon(vermelho, { mapa: veludo(0.04) });
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(e, 18, 14), matV);
  corpo.scale.set(0.82, 1.15, 0.9);
  corpo.position.set(0, e * 1.05, 0);
  corpo.rotation.x = 0.25;
  corpoFixo.add(corpo);
  // as asas: o vermelho, a faixa amarela e as pontas azuis, coladas nos lados
  for (const s of [-1, 1] as const) {
    const asa = new THREE.Group();
    const camadas: Array<[number, number, number]> = [[vermelho, 1, 0], [amarelo, 0.78, 1], [azul, 0.5, 2]];
    for (const [cor, k, sai] of camadas) {
      const f = new THREE.Shape();
      f.moveTo(0, e * 0.55 * k + e * 0.45 * (1 - k));
      f.quadraticCurveTo(e * 0.5, e * 0.2, e * 0.32, -e * 0.95);
      f.quadraticCurveTo(e * 0.05, -e * 0.5, -e * 0.25, e * 0.2);
      f.closePath();
      const geo = chapa(f, e * 0.04, e * 0.03, 8);
      geo.translate(0, -e * (1 - k) * 0.6, sai * e * 0.045);
      asa.add(new THREE.Mesh(s > 0 ? geo : espelhada(geo), toon(cor)));
    }
    asa.position.set(s * e * 0.72, e * 1.2, -e * 0.05);
    asa.rotation.set(0.2, s * 1.35, 0);
    corpoFixo.add(asa);
  }
  // o rabo: três penas compridas caindo para trás e para baixo
  for (const [s, cor, comp] of [[-1, azul, 1.5], [0, vermelho, 1.9], [1, azul, 1.5]] as const) {
    const f = new THREE.Shape();
    f.moveTo(-e * 0.12, 0);
    f.lineTo(e * 0.12, 0);
    f.quadraticCurveTo(e * 0.14, -e * comp * 0.8, 0, -e * comp);
    f.quadraticCurveTo(-e * 0.14, -e * comp * 0.8, -e * 0.12, 0);
    const pena = new THREE.Mesh(chapa(f, e * 0.03, e * 0.02, 6), toon(cor));
    pena.position.set(s * e * 0.12, e * 0.35, -e * 0.55);
    pena.rotation.set(-0.55, 0, s * 0.18);
    corpoFixo.add(pena);
  }
  // os pezinhos agarrados no ombro
  const cinza = toon(0x6e6a72);
  for (const s of [-1, 1] as const) {
    for (let k = -1; k <= 1; k++) {
      const dedo = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.07, e * 0.2, 3, 6), cinza);
      dedo.rotation.set(Math.PI / 2 - 0.3, k * 0.5, 0);
      dedo.position.set(s * e * 0.25 + k * e * 0.06, e * 0.05, e * 0.12);
      corpoFixo.add(dedo);
    }
  }
  fundir(corpoFixo);

  // A CABEÇA, num grupo próprio: ela inclina e vira, devagar
  const cabeca = new THREE.Group();
  cabeca.name = 'cabeca-do-papagaio';
  cabeca.position.set(0, e * 2.05, e * 0.28);
  ave.add(cabeca);
  const cranio = new THREE.Mesh(new THREE.SphereGeometry(e * 0.62, 18, 14), matV);
  cranio.scale.set(0.92, 1, 1);
  cabeca.add(cranio);
  const branco = toon(0xfbf8f2);
  for (const s of [-1, 1] as const) {
    const rosto = new THREE.Mesh(new THREE.SphereGeometry(e * 0.3, 12, 10), branco);
    rosto.scale.set(0.35, 1, 1.15);
    rosto.position.set(s * e * 0.48, -e * 0.04, e * 0.2);
    cabeca.add(rosto);
    const olho = new THREE.Mesh(new THREE.SphereGeometry(e * 0.13, 10, 8), toon(0x1c1a20));
    olho.position.set(s * e * 0.55, e * 0.05, e * 0.2);
    olho.scale.set(0.5, 1, 1);
    cabeca.add(olho);
    const luz = new THREE.Mesh(new THREE.SphereGeometry(e * 0.045, 6, 5), toon(0xffffff));
    luz.position.set(s * e * 0.6, e * 0.1, e * 0.25);
    cabeca.add(luz);
  }
  // o bico: o de cima curvo (marfim) e o de baixo escuro
  const bicoCima = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, e * 0.12, e * 0.5),
    new THREE.Vector3(0, e * 0.1, e * 0.82),
    new THREE.Vector3(0, -e * 0.12, e * 0.95),
    new THREE.Vector3(0, -e * 0.34, e * 0.82),
  ]);
  cabeca.add(new THREE.Mesh(tuboAfinado(bicoCima, 16, e * 0.2, e * 0.04, 10), toon(P.papagaioBico)));
  const bicoBaixo = new THREE.Mesh(new THREE.SphereGeometry(e * 0.16, 10, 8), toon(P.papagaioBicoEscuro));
  bicoBaixo.scale.set(1, 0.7, 1.1);
  bicoBaixo.position.set(0, -e * 0.2, e * 0.6);
  cabeca.add(bicoBaixo);
  fundir(cabeca);
  // o relógio da cabeça: inclina curiosa, e de vez em quando olha para o lado
  const marcador = new THREE.Mesh(new THREE.BufferGeometry(), toon(vermelho));
  marcador.name = 'relogio-do-papagaio';
  marcador.frustumCulled = false;
  let ultimo = -1;
  let t0 = 0;
  marcador.onBeforeRender = (renderer) => {
    const quadro = renderer.info.render.frame;
    if (quadro === ultimo) return;
    ultimo = quadro;
    const agora = performance.now() / 1000;
    if (!t0) t0 = agora;
    const t = agora - t0;
    cabeca.rotation.z = 0.28 * Math.sin(t * 1.3) * Math.max(0, Math.sin(t * 0.37));
    cabeca.rotation.y = 0.35 * Math.sin(t * 0.6);
  };
  ave.add(marcador);
  return g;
}

// ============================================================ O GATO PRETO

/** a orelha de gato: um triângulo de quinas redondas, a base em y = 0, a ponta em `+Y` */
function formaDaOrelhaDeGato(alta: number, larga: number): THREE.Shape {
  const f = new THREE.Shape();
  f.moveTo(-larga * 0.5, 0);
  f.quadraticCurveTo(-larga * 0.44, alta * 0.55, -larga * 0.08, alta * 0.96);
  f.quadraticCurveTo(0, alta * 1.06, larga * 0.08, alta * 0.96);
  f.quadraticCurveTo(larga * 0.44, alta * 0.55, larga * 0.5, 0);
  f.quadraticCurveTo(0, -alta * 0.06, -larga * 0.5, 0);
  return f;
}

/**
 * AS ORELHINHAS DE GATO (cabeça): a tiara preta por cima do cabelo e as duas
 * orelhas de pelúcia, com o miolo rosa, os tufinhos brancos saindo de dentro
 * e o LACINHO vermelho no pé da orelha direita.
 */
function orelhasDeGato(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const r = m.headR;
  const cor = peca?.cor ?? P.gatoPreto;
  const miolo = peca?.corDetalhe ?? P.gatoRosa;
  const { g, naFaixa } = tiara(m, cor);
  const fora = toon(cor, { mapa: veludo(0.05) });
  const dentro = toon(miolo, { mapa: veludo(0.05) });
  const branco = toon(P.gatoBranco);
  const ALTA = r * 0.5;
  const LARGA = r * 0.52;
  for (const lado of [-1, 1] as const) {
    const a = lado * 0.6;
    const presa = naFaixa(a);
    const orelha = new THREE.Group();
    const casca = chapa(formaDaOrelhaDeGato(ALTA, LARGA), r * 0.05, r * 0.035);
    casca.translate(0, 0, -r * 0.05);
    orelha.add(new THREE.Mesh(casca, fora));
    // o miolo POR FORA do bisel da casca (que sai 0,035·r): dentro dele o rosa sumia
    const m2 = new THREE.ShapeGeometry(formaDaOrelhaDeGato(ALTA * 0.72, LARGA * 0.6), 10);
    m2.translate(0, ALTA * 0.08, r * 0.042);
    orelha.add(new THREE.Mesh(m2, dentro));
    // os tufinhos: três fiozinhos brancos subindo do pé do miolo
    for (let k = -1; k <= 1; k++) {
      const tufo = new THREE.Mesh(new THREE.ConeGeometry(r * 0.025, r * 0.2, 5), branco);
      tufo.position.set(k * LARGA * 0.1, ALTA * 0.22, r * 0.05);
      tufo.rotation.z = -k * 0.35;
      orelha.add(tufo);
    }
    const normal = new THREE.Vector3(Math.sin(a), Math.cos(a), 0);
    const em = new THREE.Vector3(0, 1, 0).lerp(normal, 0.6).normalize();
    orelha.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), em);
    orelha.rotateY(lado * -0.18);
    orelha.position.copy(presa).addScaledVector(em, -r * 0.04);
    g.add(orelha);
    if (lado === 1) {
      const lacinho = lacoDeFita(r * 0.1, P.gatoLaco, 1.3);
      lacinho.position.copy(presa).addScaledVector(em, r * 0.02).add(new THREE.Vector3(-r * 0.08, 0, r * 0.08));
      lacinho.lookAt(lacinho.position.clone().add(new THREE.Vector3(0.3, 0.6, 1)));
      g.add(lacinho);
    }
  }
  return fundir(g);
}

/**
 * O MOLETOM DE GATO PRETO (tronco): a `cor` pinta o tronco de preto, e por
 * cima a casca de pelúcia, o BABADOR branco do peito de gato (descendo do
 * pescoço com a barra em três ondinhas), a COLEIRA vermelha com o sininho
 * dourado e, nas costas, uma patinha branca bordada.
 */
function moletomDeGato(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.gatoPreto;
  const peito = peca?.corDetalhe && peca.corDetalhe !== cor ? peca.corDetalhe : P.gatoBranco;
  const yGola = c.topo - m.torsoH * 0.02;
  const baixo = c.quadril - h * 0.005;
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, baixo, folga: 1.08, colunas: 72, linhas: 16 }), toon(cor, { mapa: veludo(0.08), doubleSide: true })));
  // a barra canelada
  g.add(new THREE.Mesh(cintaNaPele(m, baixo + h * 0.006, h * 0.006, 1.1), toon(escuro(cor, 0.75))));

  // O BABADOR: do pescoço até o meio da barriga, com a barra em três ondas
  // o alto do babador é quase reto, um dedo abaixo da coleira: com a curva
  // funda do pescoço, o moletom preto aparecia num V no meio do branco
  const yAlto = yGola - h * 0.022;
  const yBaixo = c.quadril + m.torsoH * 0.36;
  const L = h * 0.05;
  const b = new THREE.Shape();
  b.moveTo(-L * 0.62, yAlto);
  b.quadraticCurveTo(0, yAlto - h * 0.005, L * 0.62, yAlto);
  b.quadraticCurveTo(L * 1.05, (yAlto + yBaixo) / 2, L * 0.95, yBaixo + h * 0.012);
  for (let k = 0; k < 3; k++) {
    const x0 = L * 0.95 - (k * L * 1.9) / 3;
    const x1 = L * 0.95 - ((k + 1) * L * 1.9) / 3;
    b.quadraticCurveTo((x0 + x1) / 2, yBaixo - h * 0.014, x1, yBaixo + h * 0.006 * (k === 2 ? 2 : 1));
  }
  b.quadraticCurveTo(-L * 1.05, (yAlto + yBaixo) / 2, -L * 0.62, yAlto);
  g.add(new THREE.Mesh(decalqueNoTronco(m, b, 1.1, h * 0.003), toon(peito, { mapa: veludo(0.05) })));

  // A COLEIRA e o sininho
  const coleira = new THREE.Mesh(new THREE.TorusGeometry(c.r * 0.66, h * 0.0075, 8, 32), toon(P.gatoLaco));
  coleira.rotation.x = Math.PI / 2 - 0.25;
  coleira.scale.set(1, 0.95, 1);
  coleira.position.set(0, yGola + h * 0.002, c.r * 0.12);
  g.add(coleira);
  const ouro = toon(P.gatoSino);
  const sino = new THREE.Mesh(new THREE.SphereGeometry(h * 0.011, 14, 10), ouro);
  const pSino = new THREE.Vector3(0, yGola - h * 0.012, c.r * 0.12 + c.r * 0.66 * 0.96 + h * 0.006);
  sino.position.copy(pSino);
  g.add(sino);
  const fenda = new THREE.Mesh(new THREE.BoxGeometry(h * 0.012, h * 0.002, h * 0.004), toon(escuro(P.gatoSino, 0.45)));
  fenda.position.copy(pSino).add(new THREE.Vector3(0, -h * 0.004, h * 0.009));
  g.add(fenda);
  const argola = new THREE.Mesh(new THREE.TorusGeometry(h * 0.004, h * 0.0012, 4, 10), ouro);
  argola.position.copy(pSino).add(new THREE.Vector3(0, h * 0.012, 0));
  g.add(argola);

  // a PATINHA bordada nas costas, baixa (o cabelo cobre o alto)
  const yPata = c.quadril + m.torsoH * 0.36;
  const RP = Math.max(raioDoTronco(m, yPata), c.r * 0.5) * 1.1;
  const xCostas = Math.PI * RP;
  const branco = toon(P.gatoBranco);
  const almofada = new THREE.Shape();
  almofada.absellipse(xCostas, yPata, h * 0.016, h * 0.013, 0, Math.PI * 2, false, 0);
  g.add(new THREE.Mesh(decalqueNoTronco(m, almofada, 1.105), branco));
  for (const [dx, dy] of [[-0.022, 0.016], [-0.008, 0.026], [0.008, 0.026], [0.022, 0.016]] as const) {
    g.add(new THREE.Mesh(decalqueNoTronco(m, circulo(h * 0.0065, xCostas + h * dx, yPata + h * dy), 1.105), branco));
  }
  return fundir(g);
}

/** a MANGA de pelúcia preta do moletom de gato (`extraBraco`), com o punho branco fofinho */
function mangaDeGato(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.gatoPreto;
  const L = m.armLen;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.048 * w, h * 0.014],
    [h * 0.051 * w, -h * 0.012],
    [h * 0.048 * w, -L * 0.4],
    [h * 0.046 * w, -L * 0.72],
  ], 0, () => 0, 24), toon(cor, { mapa: veludo(0.06), doubleSide: true })));
  const punho = new THREE.Mesh(new THREE.TorusGeometry(h * 0.046 * w, h * 0.011, 10, 24), toon(P.gatoBranco, { mapa: veludo(0.04) }));
  punho.rotation.x = Math.PI / 2;
  punho.position.y = -L * 0.74;
  g.add(punho);
  return fundir(g);
}

/** a LEGGING PRETA (pernas): a perna de preto, a malha por cima e o punho branco fofinho no tornozelo */
function leggingPreta(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.gatoPreto;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.016],
    [h * 0.05 * w, h * 0.012],
    [h * 0.047 * w, -m.legH * 0.4],
    [h * 0.045 * w, -m.legH * 0.8],
  ], 0, () => 0, 24), toon(cor, { mapa: malha(0.03), doubleSide: true })));
  const punho = new THREE.Mesh(new THREE.TorusGeometry(h * 0.047 * w, h * 0.01, 10, 24), toon(P.gatoBranco, { mapa: veludo(0.04) }));
  punho.rotation.x = Math.PI / 2;
  punho.position.y = -m.legH * 0.79;
  g.add(punho);
  return fundir(g);
}

/**
 * A PANTUFA DE PATINHA (pés), que substitui o pé: uma pata de gato de
 * pelúcia preta, gorda, com os QUATRO DEDINHOS redondos na frente, as
 * almofadinhas rosa na ponta de cada dedo e a grande embaixo, a sola branca e
 * a boca de pelúcia branca em volta do tornozelo.
 */
function patinhasDeGato(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const h = m.h;
  const p = pe(m);
  const cor = peca?.cor ?? P.gatoPreto;
  const rosa = toon(peca?.corDetalhe ?? P.gatoRosa);
  const pelucia = toon(cor, { mapa: veludo(0.05) });
  g.add(camadaDeSola(m, p.chao, h * 0.007, P.gatoBranco, 1.08));
  const corpo = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), pelucia);
  // o fundo da bola encosta no alto da sola (abaixo dela, o preto furava a sola branca, visto sentado)
  corpo.scale.set(p.meiaLargura * 1.35, h * 0.028, p.meioComprimento * 1.15);
  corpo.position.set(0, p.chao + h * 0.033, p.z - h * 0.002);
  g.add(corpo);
  // os quatro dedinhos na frente, em leque
  const zDedos = p.z + p.meioComprimento * 0.95;
  for (let k = 0; k < 4; k++) {
    const t = (k - 1.5) / 1.5;
    const dedo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0125, 14, 10), pelucia);
    const x = t * p.meiaLargura * 0.95;
    const z = zDedos - Math.abs(t) * h * 0.006;
    dedo.position.set(x, p.chao + h * 0.016, z);
    dedo.scale.set(1, 0.9, 1.05);
    g.add(dedo);
    const feijao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0055, 10, 8), rosa);
    feijao.position.set(x, p.chao + h * 0.012, z + h * 0.0105);
    feijao.scale.set(1, 0.9, 0.45);
    g.add(feijao);
  }
  // a almofada grande, aparecendo na frente embaixo dos dedos
  const grande = new THREE.Mesh(new THREE.SphereGeometry(h * 0.012, 14, 10), rosa);
  grande.position.set(0, p.chao + h * 0.008, zDedos - h * 0.002);
  grande.scale.set(1.6, 0.55, 0.9);
  g.add(grande);
  // a patinha EMBAIXO da sola: a almofada e os quatro feijões, discos virados
  // para baixo. De pé ninguém vê (a face olha o chão e a de cima não existe,
  // então nem briga com o piso); sentados, com o pé esticado, a sola vira para
  // a câmera e mostra a pegada
  const ySola = p.chao - h * 0.0016;
  const disco = (x: number, z: number, rx: number, rz: number): void => {
    const d = new THREE.Mesh(new THREE.CircleGeometry(1, 20), rosa);
    d.rotation.x = Math.PI / 2;
    d.scale.set(rx, rz, 1);
    d.position.set(x, ySola, z);
    g.add(d);
  };
  disco(0, p.z - p.meioComprimento * 0.12, p.meiaLargura * 0.55, p.meioComprimento * 0.36);
  for (let k = 0; k < 4; k++) {
    const t = (k - 1.5) / 1.5;
    disco(t * p.meiaLargura * 0.62, p.z + p.meioComprimento * (0.6 - Math.abs(t) * 0.12), p.meiaLargura * 0.19, p.meioComprimento * 0.15);
  }
  // a boca de pelúcia branca
  const boca = new THREE.Mesh(new THREE.TorusGeometry(h * 0.04 * m.w, h * 0.009, 8, 22), toon(P.gatoBranco, { mapa: veludo(0.04) }));
  boca.rotation.x = Math.PI / 2;
  boca.position.set(0, p.chao + h * 0.044, p.z - h * 0.02);
  g.add(boca);
  return fundir(g);
}

/**
 * AS LUVAS DE PATINHA (mãos): luva de pelúcia preta redondinha, a
 * ALMOFADA rosa grande na palma e os quatro feijõezinhos em cima dela (a
 * palma vira para dentro e para a frente, onde a câmera vê), e o punho
 * branco fofinho.
 */
function luvasDePatinha(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.gatoPreto;
  const rosa = toon(peca?.corDetalhe ?? P.gatoRosa);
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.18, 16, 12), toon(cor, { mapa: veludo(0.04) }));
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.05, 1);
  g.add(mao);
  // a palma: para dentro (−lado em x) e um pouco para a frente
  const palma = new THREE.Vector3(-lado * 0.75, -0.05, 0.66).normalize();
  const R = c.raioMao * 1.18;
  const naMao = (dy: number, dz: number): THREE.Vector3 => {
    const d = palma.clone().add(new THREE.Vector3(0, dy, dz)).normalize();
    return new THREE.Vector3(0, c.yMao, 0).addScaledVector(d, R * 1.0);
  };
  const almofada = new THREE.Mesh(new THREE.SphereGeometry(h * 0.012, 12, 10), rosa);
  almofada.position.copy(naMao(-0.2, 0));
  almofada.lookAt(almofada.position.clone().add(palma));
  almofada.scale.set(1.25, 1, 0.45);
  g.add(almofada);
  for (let k = 0; k < 4; k++) {
    const t = (k - 1.5) / 1.5;
    const feijao = new THREE.Mesh(new THREE.SphereGeometry(h * 0.0052, 10, 8), rosa);
    feijao.position.copy(naMao(0.38 - Math.abs(t) * 0.08, t * 0.38));
    feijao.lookAt(feijao.position.clone().add(palma));
    feijao.scale.set(1, 1, 0.45);
    g.add(feijao);
  }
  const punho = new THREE.Mesh(new THREE.TorusGeometry(h * 0.038 * w, h * 0.0095, 10, 22), toon(P.gatoBranco, { mapa: veludo(0.04) }));
  punho.rotation.x = Math.PI / 2;
  punho.position.y = c.yPulso + h * 0.004;
  g.add(punho);
  return fundir(g);
}

/**
 * O RABO DE GATO (acessório, no corpo): preso embaixo das costas, sai para
 * trás e sobe num ponto de interrogação, de pelúcia preta, mais fofo na
 * ponta — com o LAÇO vermelho e o sininho perto da raiz. Ele é uma corrente
 * de gomos (cada um filho do anterior), e BALANÇA: devagar parado, mais
 * depressa e mais largo andando, a ponta chegando depois da raiz.
 */
function raboDeGato(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.gatoPreto;
  const pelucia = toon(cor, { mapa: veludo(0.04) });
  const yRaiz = c.quadril + m.torsoH * 0.14;
  const rCostas = Math.max(raioDoTronco(m, yRaiz), c.r * 0.6) * c.ACHATA;
  const rabo = new THREE.Group();
  rabo.name = 'rabo';
  rabo.position.set(0, yRaiz, -rCostas - h * 0.004);
  // a raiz: para trás e um pouco para cima (`rotation.x` negativo leva o +Y para trás)
  rabo.rotation.x = -(Math.PI / 2 - 0.2);
  g.add(rabo);
  const DOBRAS = [0, 0.32, 0.36, 0.3, 0.16, 0.0, -0.06, 0.3, 0.55];
  const N = DOBRAS.length;
  const passo = h * 0.029;
  const gomos: THREE.Group[] = [];
  let pai: THREE.Object3D = rabo;
  for (let k = 0; k < N; k++) {
    const gomo = new THREE.Group();
    gomo.name = `rabo-${k}`;
    gomo.position.y = k === 0 ? 0 : passo;
    gomo.rotation.x = DOBRAS[k];
    const raio = h * (0.015 - 0.0035 * (k / N)) * (k >= N - 2 ? 1.12 : 1);
    const pedaco = new THREE.Mesh(new THREE.CapsuleGeometry(raio, passo, 4, 10), pelucia);
    pedaco.position.y = passo / 2;
    gomo.add(pedaco);
    pai.add(gomo);
    gomos.push(gomo);
    pai = gomo;
  }
  // o tufo da ponta
  const tufo = new THREE.Mesh(new THREE.SphereGeometry(h * 0.017, 12, 10), pelucia);
  tufo.position.y = passo * 1.05;
  pai.add(tufo);
  // o laço e o sininho no segundo gomo
  const lacinho = lacoDeFita(h * 0.016, P.gatoLaco, 1.3);
  lacinho.position.set(0, passo * 0.5, -h * 0.014);
  lacinho.rotation.set(Math.PI / 2, 0, Math.PI);
  gomos[1].add(lacinho);
  const sino = new THREE.Mesh(new THREE.SphereGeometry(h * 0.008, 12, 8), toon(P.gatoSino));
  sino.position.set(0, passo * 0.5, -h * 0.024);
  gomos[1].add(sino);

  // O BALANÇO: cada gomo vira de lado (`rotation.z`) com a fase atrasando para a ponta
  const medir = medidorDePasso();
  let fase = 0;
  let ultimaVez = 0;
  let ultimoQuadro = -1;
  const balancar = (renderer: THREE.WebGLRenderer): void => {
    const quadro = renderer.info.render.frame;
    if (quadro === ultimoQuadro) return;
    ultimoQuadro = quadro;
    const agora = performance.now();
    const dt = ultimaVez ? Math.min(0.1, (agora - ultimaVez) / 1000) : 0;
    ultimaVez = agora;
    const v = Math.min(1, Math.abs(medir(g, dt)) / 2);
    fase += dt * (1.6 + 3.5 * v);
    for (let k = 0; k < N; k++) {
      const amp = (0.05 + 0.12 * v) * (0.4 + (k / N) * 0.9);
      gomos[k].rotation.z = amp * Math.sin(fase - k * 0.45);
    }
  };
  (gomos[0].children[0] as THREE.Mesh).onBeforeRender = balancar;
  return g;
}

// ============================================================ O ESPANTALHO

/**
 * O CHAPÉU DE PALHA AMASSADO (cabeça): a copa de palha trançada com o
 * amassado no alto e os calombos de chapéu velho, a aba larga e mole caindo
 * em ondas, com a beira RASGADA (as mordidinhas) e os FIOS DE PALHA soltos
 * para fora, a corda de fita, o remendo azul costurado em X na copa — e o
 * CORVINHO pousado na aba, de bico laranja e olhão, mexendo a cabeça.
 */
function chapeuDePalhaAmassado(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const corPalha = peca?.cor ?? P.espantalhoChapeuDePalha;
  const chapeu = new THREE.Group();
  chapeu.rotation.set(-0.06, 0, -0.08);
  g.add(chapeu);
  const RC = r * 0.88;
  const base = alturaDaAba(m, RC);
  const mat = toon(corPalha, { mapa: palha(0.04), doubleSide: true });
  // A COPA, amassada: o vinco no alto e os calombos
  const copa = torneada([[RC, 0], [RC * 0.97, r * 0.3], [RC * 0.86, r * 0.5], [RC * 0.48, r * 0.6], [0.0001, r * 0.56]], 0, () => 0, 48);
  {
    const pos = copa.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const fi = Math.atan2(x, z);
      const alto = y / (r * 0.6);
      const calombo = 1 + 0.045 * Math.sin(fi * 3 + 0.7) * alto + 0.03 * Math.sin(fi * 5 + 2.1) * alto;
      // o vinco: o alto afunda no meio, de frente para trás
      const vinco = r * 0.12 * Math.exp(-((x / (RC * 0.3)) ** 2)) * Math.max(0, alto - 0.55) / 0.45;
      pos.setXYZ(i, x * calombo, y - vinco, z * calombo);
    }
    copa.computeVertexNormals();
  }
  copa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(copa, mat));
  // A ABA: mole, caindo em ondas, com a beira rasgada
  const NA = 120;
  const NR = 8;
  const RA = (fi: number): number => {
    const mordida = 0.1 * Math.pow(Math.max(0, Math.cos(fi * 7 + 1.3)), 10) + 0.06 * Math.pow(Math.max(0, Math.cos(fi * 11 + 0.4)), 14);
    return r * 1.62 * (1 + 0.05 * Math.sin(fi * 4 + 0.6) - mordida);
  };
  const naAba = (fi: number, t: number): THREE.Vector3 => {
    const R = THREE.MathUtils.lerp(RC * 0.98, RA(fi), t);
    const cai = t * t * r * (0.16 + 0.1 * Math.sin(fi * 2 + 0.8));
    return new THREE.Vector3(Math.sin(fi) * R, base - cai, Math.cos(fi) * R);
  };
  {
    const pos: number[] = [];
    const uv: number[] = [];
    for (let i = 0; i <= NA; i++) {
      const fi = -Math.PI + (i / NA) * Math.PI * 2;
      for (let j = 0; j <= NR; j++) {
        const p = naAba(fi, j / NR);
        pos.push(p.x, p.y, p.z);
        uv.push(fi * r * 1.2, (j / NR) * r * 0.7);
      }
    }
    const idx: number[] = [];
    for (let i = 0; i < NA; i++) {
      for (let j = 0; j < NR; j++) {
        const a = i * (NR + 1) + j;
        const b = (i + 1) * (NR + 1) + j;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    chapeu.add(new THREE.Mesh(geo, mat));
  }
  // os FIOS DE PALHA soltos na beira
  chapeu.add(fiosDePalha(54, 77, (_k, rnd) => {
    const fi = rnd() * Math.PI * 2;
    const de = naAba(fi, 0.97);
    const fora = new THREE.Vector3(Math.sin(fi), -0.35 - rnd() * 0.3, Math.cos(fi));
    return { de, dir: fora, L: r * (0.07 + rnd() * 0.14) };
  }, r * 0.012));
  // a corda em volta da copa
  const corda1 = torneada([[RC * 1.01, r * 0.03], [RC * 1.015, r * 0.07], [RC * 1.01, r * 0.11]], 0, () => 0, 40);
  corda1.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(corda1, toon(P.espantalhoCorda, { mapa: corda(P.espantalhoCorda, 0.03) })));
  // o REMENDO azul na copa, à direita da frente, com os pontos em X
  {
    const fi = 0.55;
    const y = base + r * 0.26;
    const p = new THREE.Vector3(Math.sin(fi) * RC * 0.985, y, Math.cos(fi) * RC * 0.985);
    const remendo = new THREE.Group();
    const q = new THREE.Shape();
    q.moveTo(-r * 0.13, -r * 0.1);
    q.lineTo(r * 0.12, -r * 0.12);
    q.lineTo(r * 0.14, r * 0.1);
    q.lineTo(-r * 0.11, r * 0.12);
    q.closePath();
    remendo.add(new THREE.Mesh(new THREE.ShapeGeometry(q), toon(P.espantalhoRemendo, { mapa: linho(0.03), doubleSide: true })));
    const linha = toon(0xf4ead2);
    for (const [x, yy] of [[-0.12, 0], [0.12, 0], [0, 0.11], [0, -0.11]] as const) {
      for (const s of [-1, 1]) {
        const ponto = new THREE.Mesh(new THREE.BoxGeometry(r * 0.06, r * 0.012, r * 0.01), linha);
        ponto.position.set(x * r, yy * r, r * 0.006);
        ponto.rotation.z = s * Math.PI / 4;
        remendo.add(ponto);
      }
    }
    remendo.position.copy(p);
    remendo.lookAt(p.clone().add(new THREE.Vector3(Math.sin(fi), 0.15, Math.cos(fi))));
    chapeu.add(remendo);
  }
  fundir(chapeu);

  // O CORVINHO, pousado na aba à esquerda, olhando para a frente
  {
    const fi = -0.85;
    const pouso = naAba(fi, 0.62);
    const e = r * 0.22;
    const corvo = new THREE.Group();
    corvo.name = 'corvinho';
    corvo.position.copy(pouso);
    corvo.rotation.y = 0.35;
    chapeu.add(corvo);
    const preto = toon(P.corvo, { mapa: veludo(0.03) });
    const fixo = new THREE.Group();
    corvo.add(fixo);
    const corpo = new THREE.Mesh(new THREE.SphereGeometry(e, 16, 12), preto);
    corpo.scale.set(0.8, 0.78, 1.05);
    corpo.position.set(0, e * 0.85, -e * 0.1);
    fixo.add(corpo);
    for (const s of [-1, 1] as const) {
      const f = new THREE.Shape();
      f.moveTo(0, e * 0.4);
      f.quadraticCurveTo(e * 0.5, e * 0.1, e * 0.1, -e * 0.9);
      f.quadraticCurveTo(-e * 0.2, -e * 0.3, 0, e * 0.4);
      const geo = chapa(f, e * 0.05, e * 0.03, 6);
      const asa = new THREE.Mesh(s > 0 ? geo : espelhada(geo), toon(P.corvo));
      asa.position.set(s * e * 0.68, e * 0.95, -e * 0.15);
      asa.rotation.set(-1.2, s * 1.35, 0, 'YXZ');
      fixo.add(asa);
    }
    // o rabo em leque
    for (let k = -1; k <= 1; k++) {
      const pena = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.1, e * 0.7, 3, 6), preto);
      pena.position.set(k * e * 0.14, e * 0.62, -e * 1.05);
      pena.rotation.set(-1.1, 0, k * 0.3);
      pena.scale.z = 0.4;
      fixo.add(pena);
    }
    const laranja = toon(P.corvoBico);
    for (const s of [-1, 1] as const) {
      const perna = new THREE.Mesh(new THREE.CylinderGeometry(e * 0.04, e * 0.04, e * 0.3, 5), laranja);
      perna.position.set(s * e * 0.25, e * 0.15, 0);
      fixo.add(perna);
      for (let k = -1; k <= 1; k++) {
        const dedo = new THREE.Mesh(new THREE.CapsuleGeometry(e * 0.035, e * 0.16, 2, 4), laranja);
        dedo.rotation.set(Math.PI / 2, k * 0.6, 0);
        dedo.position.set(s * e * 0.25 + k * e * 0.04, e * 0.01, e * 0.08);
        fixo.add(dedo);
      }
    }
    fundir(fixo);
    const cabeca = new THREE.Group();
    cabeca.name = 'cabeca-do-corvinho';
    cabeca.position.set(0, e * 1.5, e * 0.55);
    corvo.add(cabeca);
    const cranio = new THREE.Mesh(new THREE.SphereGeometry(e * 0.56, 16, 12), preto);
    cabeca.add(cranio);
    const bico = new THREE.Mesh(new THREE.ConeGeometry(e * 0.2, e * 0.6, 10), laranja);
    bico.rotation.x = Math.PI / 2 - 0.15;
    bico.position.set(0, -e * 0.08, e * 0.72);
    cabeca.add(bico);
    for (const s of [-1, 1] as const) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(e * 0.2, 12, 10), toon(0xffffff));
      olho.position.set(s * e * 0.28, e * 0.12, e * 0.38);
      olho.scale.set(1, 1.1, 0.6);
      cabeca.add(olho);
      const pupila = new THREE.Mesh(new THREE.SphereGeometry(e * 0.11, 10, 8), toon(0x15131a));
      pupila.position.set(s * e * 0.29, e * 0.1, e * 0.5);
      pupila.scale.set(1, 1.1, 0.5);
      cabeca.add(pupila);
      const luz = new THREE.Mesh(new THREE.SphereGeometry(e * 0.04, 6, 5), toon(0xffffff));
      luz.position.set(s * e * 0.27 - e * 0.04, e * 0.16, e * 0.56);
      cabeca.add(luz);
    }
    fundir(cabeca);
    const relogio = new THREE.Mesh(new THREE.BufferGeometry(), preto);
    relogio.name = 'relogio-do-corvinho';
    relogio.frustumCulled = false;
    let ultimo = -1;
    let t0 = 0;
    relogio.onBeforeRender = (renderer) => {
      const quadro = renderer.info.render.frame;
      if (quadro === ultimo) return;
      ultimo = quadro;
      const agora = performance.now() / 1000;
      if (!t0) t0 = agora;
      const t = agora - t0;
      // vira a cabeça em "pulinhos": olha para um lado, para, olha para o outro
      const passo2 = Math.floor(t / 1.6);
      const alvo = Math.sin(passo2 * 2.3) * 0.6;
      cabeca.rotation.y += (alvo - cabeca.rotation.y) * 0.25;
      cabeca.rotation.z = 0.12 * Math.sin(t * 2.1);
    };
    corvo.add(relogio);
  }
  return g;
}

/** um remendo de pano no tronco (quadrado torto) com o pesponto aparente em volta */
function remendoXadrez(m: MedidasCorpo, x: number, y: number, lado: number, cor: number, folga: number): THREE.Group {
  const g = new THREE.Group();
  const q = new THREE.Shape();
  const cantos: Array<[number, number]> = [[-lado, -lado * 0.9], [lado * 0.92, -lado], [lado, lado * 0.88], [-lado * 0.9, lado]];
  q.moveTo(x + cantos[0][0], y + cantos[0][1]);
  for (let k = 1; k < 4; k++) q.lineTo(x + cantos[k][0], y + cantos[k][1]);
  q.closePath();
  g.add(new THREE.Mesh(decalqueNoTronco(m, q, folga, m.h * 0.0015), toon(cor, { mapa: linho(0.03) })));
  const contorno = cantos.map(([cx, cy]) => [x + cx * 0.8, y + cy * 0.8] as [number, number]);
  g.add(pespontoNoTronco(m, contorno, folga + 0.012, toon(0xf6ecd4), m.h * 0.0012));
  return g;
}

/**
 * A CAMISA XADREZ DE REMENDOS (tronco): flanela xadrez vermelha e mostarda
 * (canvas) por cima do tronco, a GOLA de duas pontas, a carreira de botões
 * de madeira, dois REMENDOS costurados à mão (o azul na barriga e o caramelo
 * no peito) e os FIOS DE PALHA escapando pela gola — o espantalho é
 * recheado de palha.
 */
function camisaXadrez(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const fundo = peca?.cor ?? P.espantalhoXadrez;
  const mapa = xadrez(fundo, P.espantalhoXadrezClaro, P.espantalhoXadrezLinha);
  const flanela = toon(0xffffff, { mapa, doubleSide: true });
  const yGola = c.topo - m.torsoH * 0.02;
  const fundoDoV = yGola - h * 0.035;
  const decote = (a: number): number => {
    const k = Math.min(1, Math.abs(a) / 0.35);
    return fundoDoV + (yGola - fundoDoV) * Math.pow(k, 0.7);
  };
  const baixo = c.quadril - h * 0.004;
  g.add(new THREE.Mesh(corpete(m, { decote, baixo, folga: 1.075, colunas: 80, linhas: 18 }), flanela));
  // a gola de duas pontas, deitada no peito
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(s * h * 0.004, yGola);
    f.lineTo(s * h * 0.05, yGola + h * 0.004);
    f.lineTo(s * h * 0.03, yGola - h * 0.035);
    f.lineTo(s * h * 0.006, fundoDoV);
    f.closePath();
    g.add(new THREE.Mesh(decalqueNoTronco(m, f, 1.1, h * 0.002), flanela));
  }
  // os botões de madeira na carreira da frente
  const madeira = toon(P.pirataMadeiraEscura);
  for (let k = 0; k < 4; k++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0055, h * 0.0055, h * 0.003, 10), madeira);
    const y = fundoDoV - h * 0.012 - k * h * 0.03;
    b.position.copy(naPele(m, 0, y, 1.09));
    b.rotation.x = Math.PI / 2;
    g.add(b);
  }
  // os remendos
  g.add(remendoXadrez(m, -h * 0.04, c.quadril + m.torsoH * 0.3, h * 0.022, P.espantalhoRemendo, 1.09));
  g.add(remendoXadrez(m, h * 0.035, c.quadril + m.torsoH * 0.62, h * 0.017, P.espantalhoRemendoCaramelo, 1.09));
  // a palha escapando pela gola, nas costas e nos lados
  g.add(fiosDePalha(22, 31, (_k, rnd) => {
    const a = Math.PI * (0.35 + rnd() * 1.3) * (rnd() < 0.5 ? -1 : 1);
    const de = naPele(m, a, yGola - h * 0.004, 1.02);
    const dir = new THREE.Vector3(Math.sin(a) * 0.7, 0.8 + rnd() * 0.4, Math.cos(a) * 0.6);
    return { de, dir, L: h * (0.02 + rnd() * 0.025) };
  }, h * 0.0016));
  return fundir(g);
}

/** a MANGA XADREZ (`extraBraco`): a flanela até o punho, o remendo no cotovelo e a PALHA saindo pelo punho */
function mangaXadrez(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const fundo = peca?.cor ?? P.espantalhoXadrez;
  const flanela = toon(0xffffff, { mapa: xadrez(fundo, P.espantalhoXadrezClaro, P.espantalhoXadrezLinha), doubleSide: true });
  const L = m.armLen;
  const yPunho = -L * 0.74;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.049 * w, h * 0.014],
    [h * 0.052 * w, -h * 0.012],
    [h * 0.05 * w, -L * 0.4],
    [h * 0.05 * w, yPunho],
  ], 0, () => 0, 24), flanela));
  // o remendo caramelo no cotovelo (atrás do braço)
  const remendo = new THREE.Mesh(new THREE.CircleGeometry(h * 0.016, 14), toon(P.espantalhoRemendoCaramelo, { mapa: linho(0.03) }));
  remendo.position.set(0, -L * 0.42, -h * 0.051 * w);
  remendo.rotation.y = Math.PI;
  remendo.scale.y = 1.2;
  g.add(remendo);
  // a palha saindo pelo punho
  g.add(fiosDePalha(14, lado > 0 ? 41 : 43, (_k, rnd) => {
    const a = rnd() * Math.PI * 2;
    const de = new THREE.Vector3(Math.sin(a) * h * 0.038 * w, yPunho + h * 0.004, Math.cos(a) * h * 0.038 * w);
    const dir = new THREE.Vector3(Math.sin(a) * 0.6, -1, Math.cos(a) * 0.6);
    return { de, dir, L: h * (0.018 + rnd() * 0.02) };
  }, h * 0.0014));
  return fundir(g);
}

/**
 * A CALÇA DE REMENDO (pernas): brim desbotado, um tubo um tico folgado com a
 * barra torta (o pano gasto) e a palha escapando por ela, um remendo em cada
 * perna (o caramelo no joelho esquerdo, o azul na coxa direita) — e o
 * CINTO DE CORDA no quadril (`extraQuadril`).
 */
function calcaDeRemendo(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const cor = peca?.cor ?? P.espantalhoCalca;
  const FIM = -m.legH * 0.84;
  const rFim = h * 0.056 * w;
  g.add(new THREE.Mesh(torneada([
    [h * 0.03 * w, h * 0.016],
    [h * 0.054 * w, h * 0.012],
    [h * 0.054 * w, -m.legH * 0.4],
    [rFim, FIM],
  ], 7, (t) => h * 0.004 * t, 28), toon(cor, { mapa: linho(0.05), doubleSide: true })));
  // o remendo de cada perna
  const corR = lado < 0 ? P.espantalhoRemendoCaramelo : P.espantalhoRemendo;
  const yR = lado < 0 ? -m.legH * 0.5 : -m.legH * 0.2;
  const q = new THREE.Shape();
  const e = h * 0.018;
  q.moveTo(-e, -e * 0.9);
  q.lineTo(e * 0.9, -e);
  q.lineTo(e, e * 0.85);
  q.lineTo(-e * 0.85, e);
  q.closePath();
  const remendo = new THREE.Group();
  remendo.add(new THREE.Mesh(new THREE.ShapeGeometry(q), toon(corR, { mapa: linho(0.03), doubleSide: true })));
  const linha = toon(0xf6ecd4);
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    const ponto = new THREE.Mesh(new THREE.BoxGeometry(e * 0.4, e * 0.08, e * 0.06), linha);
    ponto.position.set(Math.cos(a) * e * 0.75, Math.sin(a) * e * 0.75, e * 0.04);
    ponto.rotation.z = a + Math.PI / 2;
    remendo.add(ponto);
  }
  remendo.position.set(lado * h * 0.012, yR, h * 0.056 * w);
  remendo.rotation.y = lado * 0.25;
  g.add(remendo);
  // a palha escapando pela barra
  g.add(fiosDePalha(10, lado > 0 ? 51 : 53, (_k, rnd) => {
    const a = rnd() * Math.PI * 2;
    const de = new THREE.Vector3(Math.sin(a) * rFim * 0.92, FIM + h * 0.004, Math.cos(a) * rFim * 0.92);
    return { de, dir: new THREE.Vector3(Math.sin(a) * 0.5, -1, Math.cos(a) * 0.5), L: h * (0.016 + rnd() * 0.018) };
  }, h * 0.0014));
  return fundir(g);
}

/** o CINTO DE CORDA (`extraQuadril` da calça de remendo): a corda torcida, o nó na frente e as duas pontas desfiadas */
function cintoDeCorda(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const y = c.quadril + h * 0.045;
  const R = Math.max(c.r * 1.12, h * 0.118 * w) * 1.02;
  const mat = toon(P.espantalhoCorda, { mapa: corda(P.espantalhoCorda, 0.025) });
  const anel = new THREE.Mesh(new THREE.TorusGeometry(R, h * 0.0055, 8, 48), mat);
  anel.rotation.x = Math.PI / 2;
  anel.scale.set(1, 0.84, 1);
  anel.position.y = y;
  g.add(anel);
  const a = -0.45;
  const pNo = new THREE.Vector3(Math.sin(a) * R * 1.02, y, Math.cos(a) * R * 0.84 * 1.02);
  const no = new THREE.Mesh(new THREE.TorusGeometry(h * 0.008, h * 0.005, 6, 12), mat);
  no.position.copy(pNo);
  no.lookAt(pNo.clone().multiplyScalar(2).setY(y));
  g.add(no);
  for (const s of [-1, 1] as const) {
    const fim = pNo.clone().add(new THREE.Vector3(s * h * 0.01, -h * 0.06, h * 0.012));
    const curva = new THREE.CatmullRomCurve3([pNo.clone(), pNo.clone().add(new THREE.Vector3(s * h * 0.006, -h * 0.03, h * 0.012)), fim]);
    g.add(new THREE.Mesh(tuboAfinado(curva, 10, h * 0.005, h * 0.0045, 6), mat));
    // a ponta desfiada
    for (let k = 0; k < 5; k++) {
      const fio = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.0008, h * 0.0012, h * 0.012, 4), mat);
      fio.position.copy(fim).add(new THREE.Vector3((k - 2) * h * 0.0016, -h * 0.005, 0));
      fio.rotation.z = (k - 2) * 0.18;
      g.add(fio);
    }
  }
  return fundir(g);
}

/**
 * A BOTA GASTA (pés), que substitui o pé: o couro marrom com os ARRANHÕES
 * claros no bico, o cano até a canela com o CADARÇO cruzado e o laço, e a
 * sola grossa.
 */
function botasGastas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const h = m.h;
  const p = pe(m);
  const couro = peca?.cor ?? P.espantalhoBota;
  const cano = h * 0.11;
  const { g, rCano, topoEm, zBico } = bota(m, { cor: couro, sola: 0x3a2a20, cano, abre: h * 0.006, rebaixa: 0.22, escala: 1.1, textura: veludo(0.06) });
  // os arranhões: manchas mais claras, achatadas no bico
  const gasto = toon(P.espantalhoBotaGasta);
  for (const [x, dz, s] of [[-0.4, -0.02, 1], [0.35, 0.006, 0.8], [0.05, 0.018, 0.7]] as const) {
    const z = zBico - h * 0.03 + h * dz;
    const mancha = new THREE.Mesh(new THREE.SphereGeometry(h * 0.009 * s, 10, 6), gasto);
    mancha.position.set(x * p.meiaLargura, topoEm(z) - h * 0.0035, z);
    mancha.scale.set(1.4, 0.25, 1);
    g.add(mancha);
  }
  // o cadarço cruzado na frente do cano
  const cad = toon(0xe9dcc0);
  const yA = p.chao + h * 0.04;
  for (let k = 0; k < 4; k++) {
    const y = yA + k * h * 0.016;
    for (const s of [-1, 1] as const) {
      const de = new THREE.Vector3(s * rCano * 0.42, y, rCano * 0.98);
      const ate = new THREE.Vector3(-s * rCano * 0.42, y + h * 0.014, rCano * 0.98);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(de, ate), 2, h * 0.0016, 4, false), cad));
    }
  }
  const lacinho = lacoDeFita(h * 0.008, 0xe9dcc0, 1.2);
  lacinho.position.set(0, yA + 4 * h * 0.016, rCano * 1.04);
  g.add(lacinho);
  return fundir(g);
}

/** as LUVAS DE COURO COM PALHA (mãos): gastas, com a costura no dorso e a palha escapando do punho para cima */
function luvasComPalha(m: MedidasCorpo, lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.espantalhoLuva;
  const mat = toon(cor, { mapa: veludo(0.05) });
  const mao = new THREE.Mesh(new THREE.SphereGeometry(c.raioMao * 1.12, 16, 12), mat);
  mao.position.y = c.yMao;
  mao.scale.set(1, 1.1, 0.98);
  g.add(mao);
  const polegar = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.013 * w, h * 0.016, 4, 8), mat);
  polegar.position.set(-lado * h * 0.022 * w, c.yMao + h * 0.004, h * 0.026 * w);
  polegar.rotation.set(0.5, 0, lado * 0.6);
  g.add(polegar);
  const yPunho = c.yPulso + h * 0.012;
  g.add(new THREE.Mesh(torneada([[h * 0.038 * w, c.yPulso - h * 0.008], [h * 0.044 * w, yPunho]], 0, () => 0, 22), toon(escuro(cor, 0.85), { doubleSide: true })));
  // a costura do dorso
  const fio = toon(escuro(cor, 0.6));
  for (let k = -1; k <= 1; k++) {
    const linha = new THREE.Mesh(new THREE.CapsuleGeometry(h * 0.0012, h * 0.016, 2, 4), fio);
    const a = k * 0.35;
    linha.position.set(lado * Math.cos(a) * c.raioMao * 1.13, c.yMao + h * 0.004, Math.sin(a) * c.raioMao * 1.1);
    g.add(linha);
  }
  g.add(fiosDePalha(10, lado > 0 ? 61 : 63, (_k, rnd) => {
    const a = rnd() * Math.PI * 2;
    const de = new THREE.Vector3(Math.sin(a) * h * 0.038 * w, yPunho - h * 0.004, Math.cos(a) * h * 0.038 * w);
    return { de, dir: new THREE.Vector3(Math.sin(a) * 0.6, 1, Math.cos(a) * 0.6), L: h * (0.014 + rnd() * 0.016) };
  }, h * 0.0013));
  return fundir(g);
}

/**
 * A BANDANA DE POÁ (acessório, no pescoço): o lenço vermelho de bolinhas
 * brancas, o anel em volta do pescoço, o triângulo caindo no peito e o nó
 * com as duas pontinhas na nuca.
 */
function bandanaDePoa(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const cor = peca?.cor ?? P.espantalhoBandana;
  const pano = toon(0xffffff, { mapa: poa(cor, 0xfbf3e4, 0.035), doubleSide: true });
  const yGola = c.topo - m.torsoH * 0.04;
  const anel = new THREE.Mesh(new THREE.TorusGeometry(c.r * 0.7, h * 0.01, 8, 32), pano);
  anel.rotation.x = Math.PI / 2 - 0.2;
  anel.position.set(0, yGola, c.r * 0.08);
  g.add(anel);
  const tri = new THREE.Shape();
  const topo = yGola - h * 0.004;
  tri.moveTo(-h * 0.062, topo);
  tri.quadraticCurveTo(0, topo - h * 0.012, h * 0.062, topo);
  tri.quadraticCurveTo(h * 0.02, topo - h * 0.06, 0, topo - h * 0.092);
  tri.quadraticCurveTo(-h * 0.02, topo - h * 0.06, -h * 0.062, topo);
  g.add(new THREE.Mesh(decalqueNoTronco(m, tri, 1.14, h * 0.002), pano));
  // o nó na nuca e as pontinhas
  const pNo = new THREE.Vector3(0, yGola - h * 0.004, -c.r * 0.68);
  const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.011, 10, 8), pano);
  no.position.copy(pNo);
  g.add(no);
  for (const s of [-1, 1] as const) {
    const f = new THREE.Shape();
    f.moveTo(-h * 0.008, 0);
    f.lineTo(h * 0.008, 0);
    f.lineTo(0, -h * 0.03);
    f.closePath();
    const ponta = new THREE.Mesh(new THREE.ShapeGeometry(f), pano);
    ponta.position.copy(pNo);
    ponta.rotation.set(0.4, Math.PI, s * 0.5);
    g.add(ponta);
  }
  return fundir(g);
}

// ============================================================= O BRUXINHO

/**
 * O CHAPÉU DE BRUXO (cabeça): a aba larga um tico mole, o CONE alto e TORTO
 * na ponta (ele dobra para o lado e para trás, como chapéu de bruxa de
 * verdade, com os amassadinhos), a faixa com a FIVELA dourada, três
 * estrelinhas bordadas no cone e a ESTRELA gordinha na pontinha.
 */
function chapeuDeBruxo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;
  const roxo = peca?.cor ?? P.bruxoRoxo;
  const ouro = peca?.corDetalhe ?? P.bruxoDourado;
  const chapeu = new THREE.Group();
  chapeu.rotation.set(-0.05, 0, 0.06);
  g.add(chapeu);
  const RC = r * 0.86;
  const base = alturaDaAba(m, RC);
  const mat = toon(roxo, { mapa: veludo(0.08), doubleSide: true });
  // a aba: larga, caindo de leve na beira, com uma onda
  const RA = r * 1.62;
  const aba = torneada([[RC * 0.99, r * 0.01], [r * 1.2, -r * 0.01], [r * 1.45, -r * 0.05], [RA, -r * 0.11]], 0, () => 0, 72);
  {
    const pa = aba.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i);
      const z = pa.getZ(i);
      const t = THREE.MathUtils.clamp((Math.hypot(x, z) - RC) / (RA - RC), 0, 1);
      pa.setY(i, pa.getY(i) + r * 0.05 * t * t * Math.sin(Math.atan2(x, z) * 3 + 0.5));
    }
    aba.computeVertexNormals();
  }
  aba.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(aba, mat));
  // O CONE: alto, com os amassados, e a ponta caindo para a esquerda e para trás
  const H = r * 1.75;
  const curva = (y: number): THREE.Vector3 => {
    const t = THREE.MathUtils.clamp(y / H, 0, 1);
    return new THREE.Vector3(-r * 0.55 * Math.pow(t, 2.6), -r * 0.28 * Math.pow(t, 3), -r * 0.22 * Math.pow(t, 2.4));
  };
  const perfil: THREE.Vector2[] = [];
  const NP = 26;
  for (let k = 0; k <= NP; k++) {
    const t = k / NP;
    const raio = RC * (1 - t) * (1 - 0.15 * Math.sin(Math.PI * t)) + r * 0.02 * t;
    perfil.push(new THREE.Vector2(Math.max(raio, r * 0.012), t * H));
  }
  const cone = new THREE.LatheGeometry(perfil, 40);
  {
    const pos = cone.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const amassa = 1 + 0.05 * Math.sin(y / r * 7) * Math.min(1, y / (r * 0.4));
      const d = curva(y);
      pos.setXYZ(i, x * amassa + d.x, y + d.y, z * amassa + d.z);
    }
    cone.computeVertexNormals();
  }
  cone.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(cone, mat));
  // a faixa e a fivela
  const faixa = torneada([[RC * 1.012, r * 0.02], [RC * 0.97, r * 0.2]], 0, () => 0, 40);
  faixa.translate(0, base, 0);
  chapeu.add(new THREE.Mesh(faixa, toon(P.bruxoRoxoEscuro)));
  const matOuro = toon(ouro);
  const fivela = new THREE.Group();
  const LF = r * 0.17;
  const E = r * 0.03;
  for (const [x, y, lx, ly] of [[0, LF / 2, LF + E, E], [0, -LF / 2, LF + E, E], [LF / 2, 0, E, LF], [-LF / 2, 0, E, LF]] as const) {
    const lado = new THREE.Mesh(new THREE.BoxGeometry(lx, ly, E), matOuro);
    lado.position.set(x, y, 0);
    fivela.add(lado);
  }
  fivela.position.set(0, base + r * 0.11, RC * 1.0);
  fivela.rotation.x = -0.18;
  chapeu.add(fivela);
  // as estrelinhas bordadas no cone, e a estrela gorda na ponta
  const raioEm = (y: number): number => {
    const t = y / H;
    return RC * (1 - t) * (1 - 0.15 * Math.sin(Math.PI * t)) + r * 0.02 * t;
  };
  for (const [fi, y, tam] of [[0.4, r * 0.48, 0.1], [-0.6, r * 0.78, 0.08], [0.9, r * 1.0, 0.065]] as const) {
    const est = new THREE.Mesh(new THREE.ShapeGeometry(formaDeEstrela(r * tam, r * tam * 0.48)), matOuro);
    const R = raioEm(y) * 1.03;
    const d = curva(y);
    est.position.set(Math.sin(fi) * R + d.x, base + y + d.y, Math.cos(fi) * R + d.z);
    est.lookAt(est.position.clone().add(new THREE.Vector3(Math.sin(fi), 0.35, Math.cos(fi))));
    chapeu.add(est);
  }
  const ponta = curva(H);
  const estrela = estrelaGorda(r * 0.16, matOuro);
  estrela.position.set(ponta.x, base + H + ponta.y - r * 0.02, ponta.z);
  estrela.rotation.set(0, 0.3, -0.5);
  chapeu.add(estrela);
  return fundir(g);
}

/**
 * A TÚNICA DE BRUXO (tronco): a `cor` pinta o tronco de roxo; por cima o
 * corpinho de linho até a cintura, a SAIA curta que anda com a perna (o pano
 * vivo da boutique, com a barra dourada), o CINTO de cordão com a fivela de
 * estrela, a GOLA de seis pontas com os pompons dourados e, no peito, a lua
 * e a estrelinha bordadas.
 */
function tunicaDeBruxo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const c = corpoDe(m);
  const roxo = peca?.cor ?? P.bruxoRoxo;
  const ouro = P.bruxoDourado;
  const yGola = c.topo - m.torsoH * 0.02;
  const yCintura = c.quadril + h * 0.058;
  const rCos = Math.max(c.r * 1.17, h * 0.122 * w);
  const pano = toon(roxo, { mapa: linho(0.07), doubleSide: true });
  g.add(new THREE.Mesh(corpete(m, { decote: () => yGola, baixo: yCintura - h * 0.004, folga: 1.075, colunas: 72, linhas: 16 }), pano));
  // a saia curta: o pano vivo da boutique, abrindo em sino até o meio da coxa
  const rBarra = c.r * 1.7;
  const saia = saiaViva(m, {
    yTopo: yCintura,
    yBarra: c.quadril - m.legH * 0.3,
    raio: (a, t) => rCos * 1.01 + (rBarra - rCos) * Math.pow(t, 0.85) + h * 0.004 * Math.sin(a * 8) * t,
    colunas: 96, linhas: 12, cortes: [0.9],
  }, [pano, toon(ouro, { doubleSide: true })]);
  g.add(saia);
  // o CINTO de cordão na cintura e a fivela de estrela
  g.add(new THREE.Mesh(cintaNaPele(m, yCintura + h * 0.004, h * 0.0065, rCos / Math.max(raioDoTronco(m, yCintura), c.r * 0.5) * 1.02), toon(P.bruxoCordao)));
  const fivela = estrelaGorda(h * 0.018, toon(ouro));
  fivela.position.set(0, yCintura + h * 0.004, rCos * 0.86 * 1.04 + h * 0.006);
  g.add(fivela);
  // A GOLA de seis pontas, deitada nos ombros, com os pompons
  const rGola = Math.max(raioDoTronco(m, yGola - h * 0.01) * 1.08, c.r * 0.66);
  const matGola = toon(P.bruxoRoxoEscuro, { mapa: veludo(0.05), doubleSide: true });
  const pompom = toon(ouro);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const f = new THREE.Shape();
    const L = h * 0.055;
    f.moveTo(-h * 0.03, 0);
    f.quadraticCurveTo(-h * 0.018, L * 0.6, 0, L);
    f.quadraticCurveTo(h * 0.018, L * 0.6, h * 0.03, 0);
    f.closePath();
    const ponta = new THREE.Group();
    ponta.add(new THREE.Mesh(new THREE.ShapeGeometry(f, 8), matGola));
    const bola = new THREE.Mesh(new THREE.SphereGeometry(h * 0.006, 10, 8), pompom);
    bola.position.set(0, L, h * 0.003);
    ponta.add(bola);
    const fora = new THREE.Vector3(Math.sin(a), 0, Math.cos(a) * 0.82).normalize();
    const desce = 0.8;
    const y = fora.clone().multiplyScalar(Math.cos(desce)).setY(-Math.sin(desce)).normalize();
    const x = new THREE.Vector3(-Math.cos(a), 0, Math.sin(a)).normalize();
    const z = new THREE.Vector3().crossVectors(x, y).normalize();
    ponta.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    ponta.position.set(Math.sin(a) * rGola, yGola - h * 0.004, Math.cos(a) * rGola * 0.82);
    g.add(ponta);
  }
  // a lua e a estrelinha bordadas no peito, do lado esquerdo
  const yBordado = c.quadril + m.torsoH * 0.55;
  const lua = new THREE.Shape();
  lua.absarc(-h * 0.035, yBordado, h * 0.016, 0, Math.PI * 2, false);
  const furo = new THREE.Path();
  furo.absarc(-h * 0.028, yBordado + h * 0.005, h * 0.013, 0, Math.PI * 2, true);
  lua.holes.push(furo);
  g.add(new THREE.Mesh(noTronco(new THREE.ShapeGeometry(lua, 16), m, 1.09), toon(ouro)));
  const est = formaDeEstrela(h * 0.009, h * 0.0042);
  const estGeo = new THREE.ShapeGeometry(est);
  estGeo.translate(-h * 0.012, yBordado + h * 0.016, 0);
  g.add(new THREE.Mesh(noTronco(estGeo, m, 1.09), toon(ouro)));
  return fundir(g);
}

/**
 * A MANGA LARGA da túnica (`extraBraco`): justa no ombro e abrindo em sino
 * até o punho, o FORRO lilás aparecendo por dentro da boca (a mesma malha
 * vista pelo verso) e o vivo dourado na barra.
 */
function mangaDeBruxo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const roxo = peca?.cor ?? P.bruxoRoxo;
  const L = m.armLen;
  const yBoca = -L * 0.78;
  const geo = torneada([
    [h * 0.02 * w, h * 0.028],
    [h * 0.048 * w, h * 0.014],
    [h * 0.052 * w, -h * 0.012],
    [h * 0.056 * w, -L * 0.3],
    [h * 0.074 * w, -L * 0.6],
    [h * 0.09 * w, yBoca],
  ], 9, (t) => h * 0.004 * t, 30);
  g.add(new THREE.Mesh(geo, toon(roxo, { mapa: linho(0.06) })));
  g.add(new THREE.Mesh(geo, forroDe(toon(P.bruxoForro))));
  const vivo = new THREE.Mesh(new THREE.TorusGeometry(h * 0.09 * w, h * 0.0035, 6, 30), toon(P.bruxoDourado));
  vivo.rotation.x = Math.PI / 2;
  vivo.position.y = yBoca;
  g.add(vivo);
  return fundir(g);
}

/** a MEIA LISTRADA de bruxo (pernas): roxo e verde-limão, de tricô, com o punho canelado */
function meiaListradaDeBruxo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h, w } = m;
  const escura = peca?.cor ?? P.bruxoRoxo;
  const listra = peca?.corDetalhe ?? P.bruxoListra;
  const pano = toon(0xffffff, { mapa: listrasDeMeia(escura, listra, h * 0.04), doubleSide: true });
  const PUNHO = -m.legH * 0.8;
  g.add(new THREE.Mesh(torneada([
    [h * 0.02 * w, h * 0.016],
    [h * 0.051 * w, h * 0.012],
    [h * 0.049 * w, -m.legH * 0.4],
    [h * 0.047 * w, PUNHO],
  ], 0, () => 0, 24), pano));
  return fundir(g);
}

/**
 * A BOTINHA DE BICO CURVO (pés): roxo-escura, o cano curto que termina em
 * seis pontas viradas para fora (com o vivo dourado) e o BICO comprido que
 * enrola para cima e para trás, com a estrelinha dourada na pontinha.
 */
function botinhaDeBicoCurvo(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const h = m.h;
  const p = pe(m);
  const cor = peca?.cor ?? P.bruxoBota;
  const cano = h * 0.085;
  const { g, rCano, topoEm, zBico } = bota(m, { cor, sola: 0x1a1522, cano, abre: h * 0.004, rebaixa: 0.45, escala: 1.0, textura: veludo(0.05) });
  const mat = toon(cor, { mapa: veludo(0.05), doubleSide: true });
  // o bico que enrola
  const yB = topoEm(zBico - h * 0.012) - h * 0.012;
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, yB, zBico - h * 0.02),
    new THREE.Vector3(0, yB + h * 0.004, zBico + h * 0.02),
    new THREE.Vector3(0, yB + h * 0.022, zBico + h * 0.042),
    new THREE.Vector3(0, yB + h * 0.042, zBico + h * 0.03),
    new THREE.Vector3(0, yB + h * 0.04, zBico + h * 0.014),
  ]);
  g.add(new THREE.Mesh(tuboAfinado(curva, 24, h * 0.016, h * 0.004, 10), mat));
  const estrela = estrelaGorda(h * 0.009, toon(P.bruxoDourado));
  estrela.position.copy(curva.getPoint(1)).add(new THREE.Vector3(0, h * 0.004, -h * 0.004));
  g.add(estrela);
  // as seis pontas da boca do cano, virando para fora, com o vivo
  const ouro = toon(P.bruxoDourado);
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const f = new THREE.Shape();
    f.moveTo(-h * 0.016, 0);
    f.lineTo(0, h * 0.024);
    f.lineTo(h * 0.016, 0);
    f.closePath();
    const pontaDoCano = new THREE.Mesh(new THREE.ShapeGeometry(f), mat);
    const R = rCano * 1.07;
    pontaDoCano.position.set(Math.sin(a) * R, p.chao + cano - h * 0.008, Math.cos(a) * R);
    pontaDoCano.rotation.set(0, a, 0, 'YXZ');
    pontaDoCano.rotateX(-0.6);
    g.add(pontaDoCano);
    const bolinha = new THREE.Mesh(new THREE.SphereGeometry(h * 0.003, 6, 5), ouro);
    bolinha.position.copy(pontaDoCano.position).add(new THREE.Vector3(Math.sin(a) * h * 0.012, h * 0.018, Math.cos(a) * h * 0.012));
    g.add(bolinha);
  }
  return fundir(g);
}

/**
 * A VASSOURA (mãos), na mão ESQUERDA: o cabo de madeira torto com os nós,
 * segurado em pé ao lado do corpo, como um cajado; o feixe de palha embaixo
 * da mão, amarrado com duas voltas de cordão vermelho, cada fio no seu
 * ângulo (um lote só) por cima do miolo cheio.
 */
function vassoura(m: MedidasCorpo, lado: -1 | 1 = 1, _peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  if (lado !== -1) return g;
  const { h } = m;
  const c = corpoDe(m);
  // EM PÉ ao lado do corpo, como um cajado do tamanho de quem segura: o cabo passa
  // da cabeça e a palha quase varre o chão. Deitada para a frente (a primeira
  // versão) ela virava um pauzinho na mão, com a palha escondida atrás da capa; e
  // curta, sumia dentro da manga de sino
  const mao = new THREE.Vector3(lado * h * 0.012, c.yMao, h * 0.014);
  const d = new THREE.Vector3(lado * 0.1, 1, 0.12).normalize();
  const lateral = new THREE.Vector3(0, 0, 1).cross(d).normalize();
  const ponta = mao.clone().addScaledVector(d, h * 0.36);
  const amarra = mao.clone().addScaledVector(d, -h * 0.15);
  const cabo = new THREE.CatmullRomCurve3([
    amarra.clone().addScaledVector(d, -h * 0.02),
    amarra.clone().lerp(mao, 0.5).addScaledVector(lateral, h * 0.004),
    mao.clone(),
    mao.clone().lerp(ponta, 0.5).addScaledVector(lateral, -h * 0.005),
    ponta,
  ]);
  const madeira = toon(P.bruxoCabo, { mapa: veio(P.bruxoCabo, 0.05) });
  g.add(new THREE.Mesh(tuboAfinado(cabo, 40, h * 0.0085, h * 0.0068, 8), madeira));
  // os nós do cabo
  for (const t of [0.55, 0.8, 0.95]) {
    const no = new THREE.Mesh(new THREE.SphereGeometry(h * 0.006, 8, 6), madeira);
    no.position.copy(cabo.getPointAt(t)).addScaledVector(lateral, h * 0.004);
    g.add(no);
  }
  // as duas voltas de cordão
  const cordao = toon(P.bruxoCordao);
  for (const k of [0, 1]) {
    const anel = new THREE.Mesh(new THREE.TorusGeometry(h * (0.013 + k * 0.004), h * 0.0028, 6, 16), cordao);
    anel.position.copy(amarra).addScaledVector(d, -k * h * 0.012);
    anel.lookAt(anel.position.clone().add(d));
    g.add(anel);
  }
  // o miolo do feixe, cheio, e os fios por cima
  const LF = h * 0.105;
  const miolo = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.014, h * 0.045, LF, 14, 1, true), toon(P.bruxoPalha, { mapa: palha(0.03), doubleSide: true }));
  miolo.position.copy(amarra).addScaledVector(d, -LF / 2 - h * 0.004);
  miolo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().negate());
  miolo.rotateX(Math.PI);
  g.add(miolo);
  g.add(fiosDePalha(64, 91, (_k, rnd) => {
    const a = rnd() * Math.PI * 2;
    const r0 = h * 0.012 * Math.sqrt(rnd());
    const perp1 = lateral.clone();
    const perp2 = new THREE.Vector3().crossVectors(d, perp1).normalize();
    const radial = perp1.clone().multiplyScalar(Math.cos(a)).addScaledVector(perp2, Math.sin(a));
    const de = amarra.clone().addScaledVector(d, -h * 0.006).addScaledVector(radial, r0);
    const abre = 0.12 + rnd() * 0.18;
    const dir = d.clone().negate().addScaledVector(radial, abre);
    return { de, dir, L: LF * (0.85 + rnd() * 0.25) };
  }, h * 0.0016, [P.bruxoPalha, escuro(P.bruxoPalha, 0.82)]));
  return fundir(g);
}

/**
 * A CAPA DE ESTRELINHAS (acessório, nas costas): a capa viva do vampiro
 * (`capaViva`), mais curta, anil com a estampa de estrelinhas douradas, o
 * forro lilás, a barra dourada e o fecho de estrela com o cordão.
 */
function capaDeEstrelinhas(m: MedidasCorpo, _lado: -1 | 1 = 1, peca?: ItemDef): THREE.Object3D {
  const g = new THREE.Group();
  const { h } = m;
  const c = corpoDe(m);
  const anil = peca?.cor ?? P.bruxoCapa;
  const forro = peca?.corDetalhe ?? P.bruxoForro;
  const yTopo = c.topo - m.torsoH * 0.04;
  const yBarra = m.legH * 0.42;
  const tOmbro = (yTopo - c.ombro) / (yTopo - yBarra);
  const debaixo = m.porBaixo;
  const ACH = 0.86;
  /** o que já está no corpo por baixo (a túnica, a gola), como cortina: a capa nunca entra */
  const precisa = (a: number, t: number): number => {
    if (!debaixo) return 0;
    const sen = Math.sin(a);
    const cos = ACH * Math.cos(a);
    const direcao = Math.atan2(sen, cos);
    const escala = 1.06 / Math.hypot(sen, cos);
    let r = 0;
    for (let k = 0; k <= 10; k++) {
      const s = (k / 10) * t;
      r = Math.max(r, debaixo(direcao, THREE.MathUtils.lerp(yTopo, yBarra, s)) * escala);
    }
    return r;
  };
  const rPescoco = Math.max(raioDoTronco(m, yTopo) * 1.25, c.r * 0.72);
  const ombroEm = (a: number): number => c.r * (1.14 + 0.5 * Math.sin(a) ** 2);
  const raio = (a: number, t: number): number => {
    let R: number;
    if (t <= tOmbro) {
      const u = t / tOmbro;
      R = THREE.MathUtils.lerp(rPescoco, ombroEm(a), 1 - (1 - u) * (1 - u));
    } else {
      const u = (t - tOmbro) / (1 - tOmbro);
      const dobra = h * 0.02 * Math.min(1, u * 1.4) * (0.5 - 0.5 * Math.cos((a - Math.PI) * 7));
      R = ombroEm(a) * (1 + 0.45 * Math.pow(u, 1.1)) - dobra;
    }
    return Math.max(R, precisa(a, t));
  };
  const linhas = [0, 0.02, 0.04, 0.065, 0.09, 0.12];
  for (let k = 1; k <= 12; k++) linhas.push(0.12 + (0.85 * k) / 12);
  linhas.push(1);
  const barra = linhas.length - 2;
  const cobre = (t: number): number => {
    const fechada = Math.PI - 0.2;
    const aberta = Math.PI - 1.05;
    const u = THREE.MathUtils.smoothstep(t, 0, 0.16);
    return THREE.MathUtils.lerp(fechada, aberta, u) - 0.1 * Math.max(0, t - 0.16);
  };
  const fora = toon(0xffffff, { mapa: estrelinhas(anil, P.bruxoEstrela) });
  const dentro = forroDe(toon(forro, { mapa: linho(0.08) }));
  const vivoDaBarra = toon(P.bruxoDourado);
  g.add(capaViva(m, { yTopo, yBarra, raio, cobre, linhas, colunas: 56, barra }, [fora, vivoDaBarra], dentro));
  // a gola: um cordão dourado em volta do pescoço, e o fecho de estrela
  const fixo = new THREE.Group();
  const yFecho = yTopo - h * 0.006;
  const cordao: THREE.Vector3[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (i / 24 - 0.5) * 2 * (Math.PI - 0.25);
    cordao.push(new THREE.Vector3(Math.sin(a) * rPescoco * 1.06, yTopo + h * 0.004, Math.cos(a) * rPescoco * ACH * 1.06));
  }
  fixo.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cordao), 48, h * 0.0035, 6, false), vivoDaBarra));
  const fecho = estrelaGorda(h * 0.016, toon(P.bruxoEstrela));
  fecho.position.set(0, yFecho, rPescoco * ACH * 1.12 + h * 0.004);
  fixo.add(fecho);
  g.add(fundir(fixo));
  return g;
}

export {
  // a abóbora (o Cookie)
  chapeuDeAbobora, macacaoDeAbobora, mangaDeAbobora, meiaCalcaVerde, botinhaVerde, luvinhasVerdes, golaDeFolhas,
  // o pirata (o Jean-Luc)
  tricornio, camisaDePirata, mangaDePirata, calcaBufante, botasDePirata, luvasDePirata, papagaio,
  // o gato preto (as coelhinhas)
  orelhasDeGato, moletomDeGato, mangaDeGato, leggingPreta, patinhasDeGato, luvasDePatinha, raboDeGato,
  // o espantalho (a Josefina)
  chapeuDePalhaAmassado, camisaXadrez, mangaXadrez, calcaDeRemendo, cintoDeCorda, botasGastas, luvasComPalha, bandanaDePoa,
  // o bruxinho (o Noel)
  chapeuDeBruxo, tunicaDeBruxo, mangaDeBruxo, meiaListradaDeBruxo, botinhaDeBicoCurvo, vassoura, capaDeEstrelinhas,
};
