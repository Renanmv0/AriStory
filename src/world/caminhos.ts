/**
 * OS CAMINHOS DO PARQUE: a rede de asfalto como UMA mancha de borda viva.
 *
 * Os caminhos eram retângulos (`w.patch`) colados uns nos outros: a junção
 * de dois fazia um "T" de quina viva de 90°, a ponta era cortada a régua e a
 * linha entre o asfalto e a grama era reta como risco de esquadro. Caminho de
 * parque não é assim — ele alarga na curva, a grama come a beira e a beira
 * tem cascalho solto.
 *
 * O jeito: o desenho do caminho é uma CONTA DE DISTÂNCIA (`Distancia`): cada
 * trecho é uma cápsula, cada largo um disco ou uma caixa de quina redonda, e
 * a união deles é SUAVE (`uniaoSuave`, o "smooth min") — é ela que arredonda
 * a junção com uma curva do raio pedido, sem ninguém desenhar a curva. Um
 * ruído leve na conta deixa a beira torta e a largura respirando. Daí:
 *
 * - `mancha()` varre a conta numa grade e devolve a geometria de onde ela é
 *   negativa (os quadradinhos inteiros juntados por linha, e a beira pelos
 *   "marching squares" — o corte de cada quadradinho onde a conta passa por
 *   zero, interpolado, então a beira sai lisa e não em degraus);
 * - a cena põe a geometria no lugar de um `w.patch` de 1 × 1 (que dá o lugar
 *   na fila de pintura do chão e o material com a textura em metros);
 * - `BeiraDoCaminho` espalha os tufos de grama e as pedrinhas na beira, em
 *   lote, com o vento do kit nos tufos.
 */
import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { Vento } from '../core/shaders';
import { novaTextura, sorteio } from './texturasDeChao';

/** quanto o ponto está FORA da forma (negativo: dentro), em metros */
export type Distancia = (x: number, z: number) => number;

/** um trecho reto de caminho, de `a` a `b`, com meia largura `r` (as pontas saem redondas) */
export function capsula(ax: number, az: number, bx: number, bz: number, r: number): Distancia {
  const dx = bx - ax;
  const dz = bz - az;
  const l2 = dx * dx + dz * dz || 1e-9;
  return (x, z) => {
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2));
    return Math.hypot(x - ax - dx * t, z - az - dz * t) - r;
  };
}

/** um largo redondo */
export function disco(cx: number, cz: number, r: number): Distancia {
  return (x, z) => Math.hypot(x - cx, z - cz) - r;
}

/** um largo retangular de quina redonda (`raio`) */
export function caixaRedonda(cx: number, cz: number, meiaX: number, meiaZ: number, raio: number): Distancia {
  return (x, z) => {
    const qx = Math.abs(x - cx) - meiaX + raio;
    const qz = Math.abs(z - cz) - meiaZ + raio;
    return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - raio;
  };
}

/**
 * A união SUAVE: onde duas formas se encontram, a junção ganha uma curva de
 * uns `k` metros em vez da quina viva (o "smooth min" polinomial).
 */
export function uniaoSuave(k: number, ...formas: Distancia[]): Distancia {
  return (x, z) => {
    let d = formas[0](x, z);
    for (let i = 1; i < formas.length; i++) {
      const b = formas[i](x, z);
      const h = Math.max(k - Math.abs(d - b), 0) / k;
      d = Math.min(d, b) - h * h * k * 0.25;
    }
    return d;
  };
}

/** ruído de valor liso (0 a 1), para a beira torta e a largura respirando */
export function ruidoLiso(semente: number): (x: number, z: number) => number {
  const canto = (i: number, j: number): number => {
    let n = Math.imul(i, 374761393) ^ Math.imul(j, 668265263) ^ Math.imul(semente, 1274126177);
    n = Math.imul(n ^ (n >>> 13), 1103515245);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  };
  return (x, z) => {
    const i = Math.floor(x);
    const j = Math.floor(z);
    const fx = x - i;
    const fz = z - j;
    const u = fx * fx * (3 - 2 * fx);
    const v = fz * fz * (3 - 2 * fz);
    const a = canto(i, j) + (canto(i + 1, j) - canto(i, j)) * u;
    const b = canto(i, j + 1) + (canto(i + 1, j + 1) - canto(i, j + 1)) * u;
    return a + (b - a) * v;
  };
}

/** a forma com a beira torta: dois ruídos, um largo (a largura respira) e um miúdo (a beira) */
export function beiraTorta(forma: Distancia, semente: number, largo = 0.22, miudo = 0.07): Distancia {
  const r1 = ruidoLiso(semente);
  const r2 = ruidoLiso(semente + 17);
  return (x, z) => forma(x, z) + (r1(x * 0.45, z * 0.45) - 0.5) * largo + (r2(x * 2.6, z * 2.6) - 0.5) * miudo;
}

export interface Caixa { x0: number; z0: number; x1: number; z1: number }

/**
 * A MANCHA de onde a conta é negativa, deitada como um `w.patch` deixaria: o
 * `x` local é o `x` do mundo e o `y` local é o `-z` do mundo (o decalque é
 * girado `-π/2` em X). O UV é a posição em metros, como o de um `patch` de
 * 1 × 1: a textura do chão continua com o azulejo do tamanho de sempre.
 *
 * Os quadradinhos inteiros de uma linha viram um retângulo só (são a maior
 * parte da área); a beira é o corte de cada quadradinho onde a conta troca de
 * sinal, com o ponto do corte interpolado entre os dois cantos.
 */
export function mancha(d: Distancia, caixa: Caixa, passo = 0.25): THREE.BufferGeometry {
  const nx = Math.ceil((caixa.x1 - caixa.x0) / passo);
  const nz = Math.ceil((caixa.z1 - caixa.z0) / passo);
  const v = new Float32Array((nx + 1) * (nz + 1));
  for (let j = 0; j <= nz; j++) {
    for (let i = 0; i <= nx; i++) v[j * (nx + 1) + i] = d(caixa.x0 + i * passo, caixa.z0 + j * passo);
  }
  const val = (i: number, j: number): number => v[j * (nx + 1) + i];
  const pos: number[] = [];
  /** um polígono convexo (ou quase) no plano do mundo, em leque, virado para cima */
  const poligono = (pts: Array<[number, number]>): void => {
    for (let k = 1; k < pts.length - 1; k++) {
      // (x, -z): a ordem do mundo vista de cima é a horária no plano local, e o
      // leque vai ao contrário para a face olhar para +Y
      for (const [x, z] of [pts[0], pts[k + 1], pts[k]]) pos.push(x, -z, 0);
    }
  };
  for (let j = 0; j < nz; j++) {
    const z0 = caixa.z0 + j * passo;
    const z1 = z0 + passo;
    let corrida = -1;
    const fecharCorrida = (ate: number): void => {
      if (corrida < 0) return;
      const xa = caixa.x0 + corrida * passo;
      const xb = caixa.x0 + ate * passo;
      poligono([[xa, z0], [xb, z0], [xb, z1], [xa, z1]]);
      corrida = -1;
    };
    for (let i = 0; i < nx; i++) {
      const a = val(i, j);
      const b = val(i + 1, j);
      const c = val(i + 1, j + 1);
      const e = val(i, j + 1);
      if (a < 0 && b < 0 && c < 0 && e < 0) {
        if (corrida < 0) corrida = i;
        continue;
      }
      fecharCorrida(i);
      if (a >= 0 && b >= 0 && c >= 0 && e >= 0) continue;
      const x0 = caixa.x0 + i * passo;
      const x1 = x0 + passo;
      const cantos: Array<[number, number, number]> = [[x0, z0, a], [x1, z0, b], [x1, z1, c], [x0, z1, e]];
      const pts: Array<[number, number]> = [];
      for (let k = 0; k < 4; k++) {
        const [px, pz, pv] = cantos[k];
        const [qx, qz, qv] = cantos[(k + 1) % 4];
        if (pv < 0) pts.push([px, pz]);
        if ((pv < 0) !== (qv < 0)) {
          const t = pv / (pv - qv);
          pts.push([px + (qx - px) * t, pz + (qz - pz) * t]);
        }
      }
      if (pts.length >= 3) poligono(pts);
    }
    fecharCorrida(nx);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const uv = new Float32Array((pos.length / 3) * 2);
  const nor = new Float32Array(pos.length);
  for (let k = 0; k < pos.length / 3; k++) {
    uv[k * 2] = pos[k * 3];
    uv[k * 2 + 1] = pos[k * 3 + 1];
    nor[k * 3 + 2] = 1;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  geo.computeBoundingSphere();
  return geo;
}

/**
 * Uma mancha de quina redonda no lugar de um retângulo (a calçada em volta de
 * um prédio), deitada como `mancha()` — no quadro de um `w.patch` de 1 × 1
 * posto no centro dela.
 */
export function retanguloRedondo(meiaX: number, meiaZ: number, raio: number): THREE.ShapeGeometry {
  const s = new THREE.Shape();
  const r = Math.min(raio, meiaX, meiaZ);
  s.moveTo(-meiaX + r, -meiaZ);
  s.lineTo(meiaX - r, -meiaZ);
  s.absarc(meiaX - r, -meiaZ + r, r, -Math.PI / 2, 0, false);
  s.lineTo(meiaX, meiaZ - r);
  s.absarc(meiaX - r, meiaZ - r, r, 0, Math.PI / 2, false);
  s.lineTo(-meiaX + r, meiaZ);
  s.absarc(-meiaX + r, meiaZ - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-meiaX, -meiaZ + r);
  s.absarc(-meiaX + r, -meiaZ + r, r, Math.PI, Math.PI * 1.5, false);
  return new THREE.ShapeGeometry(s, 8);
}

/**
 * O CASCALHO da beira: terra batida clara com grão miúdo e pedrinha solta.
 * Quase branco (o material multiplica pela cor da paleta): os grãos são
 * manchas de 2 a 4 px, que sobrevivem ao mipmap.
 */
export function cascalho(lado = 1.2): THREE.CanvasTexture {
  return novaTextura(`cascalho:${lado}`, lado, (ctx, s) => {
    const rnd = sorteio(5150);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    // a terra mais escura em manchas soltas
    for (let i = 0; i < 26; i++) {
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, 'rgba(150,130,100,0.18)');
      g.addColorStop(1, 'rgba(150,130,100,0)');
      const x = rnd() * s;
      const y = rnd() * s;
      const r = s * (0.06 + rnd() * 0.12);
      for (const [dx, dy] of [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s]]) {
        ctx.save();
        ctx.translate(x + dx, y + dy);
        ctx.scale(r, r);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    // o grão: pedrinhas claras e escuras de 2 a 4 px
    for (let i = 0; i < 900; i++) {
      const claro = rnd() < 0.5;
      ctx.fillStyle = claro ? 'rgba(255,255,255,0.9)' : `rgba(${110 + rnd() * 40},${100 + rnd() * 30},${85 + rnd() * 20},0.45)`;
      const t = 2 + Math.floor(rnd() * 3);
      ctx.beginPath();
      ctx.ellipse(rnd() * s, rnd() * s, t * 0.6, t * 0.45, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/**
 * A BEIRA VIVA do caminho: os tufos de grama (lote, balançando no vento) e as
 * pedrinhas soltas (lote, sem sombra), espalhados pelos pontos onde a conta do
 * caminho passa perto da linha de fora do cascalho.
 *
 * `livre(x, z)` é da cena: onde não pode nascer tufo (dentro da praça, da
 * calçada de um prédio, do vão do portão).
 */
export class BeiraDoCaminho {
  readonly grupo = new THREE.Group();
  readonly tufos: number;
  readonly pedrinhas: number;

  constructor(d: Distancia, caixa: Caixa, vento: Vento, livre: (x: number, z: number) => boolean, semente = 7310) {
    const rnd = sorteio(semente);
    const passo = 0.35;
    const pontosDeTufo: Array<[number, number, number]> = [];
    const pontosDePedra: Array<[number, number]> = [];
    // varre a beira: cada ponto da grade perto da linha do caminho sorteia
    for (let z = caixa.z0; z <= caixa.z1; z += passo) {
      for (let x = caixa.x0; x <= caixa.x1; x += passo) {
        const px = x + (rnd() - 0.5) * passo;
        const pz = z + (rnd() - 0.5) * passo;
        const dist = d(px, pz);
        if (dist < -0.05 || dist > 0.95 || !livre(px, pz)) continue;
        // os tufos: no cascalho de fora e na grama colada nele, mais juntos na linha
        if (dist > 0.18 && rnd() < 0.62 * (1 - Math.abs(dist - 0.42) / 0.55)) {
          pontosDeTufo.push([px, pz, 0.7 + rnd() * 0.6]);
        }
        if (dist < 0.32 && rnd() < 0.42) pontosDePedra.push([px, pz]);
      }
    }
    this.tufos = pontosDeTufo.length;
    this.pedrinhas = pontosDePedra.length;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();

    if (pontosDeTufo.length) {
      const tufo = new THREE.InstancedMesh(geoDoTufo(), vento.material(0xffffff), pontosDeTufo.length);
      const verdes = [P.leafMid, P.leafLight, P.grassDark, P.leafLight, P.grass];
      const c = new THREE.Color();
      pontosDeTufo.forEach(([x, z, t], i) => {
        q.setFromEuler(e.set(0, rnd() * Math.PI * 2, 0));
        m.compose(p.set(x, 0, z), q, s.set(t, t * (0.8 + rnd() * 0.5), t));
        tufo.setMatrixAt(i, m);
        tufo.setColorAt(i, c.setHex(verdes[Math.floor(rnd() * verdes.length)]));
      });
      tufo.instanceMatrix.needsUpdate = true;
      if (tufo.instanceColor) tufo.instanceColor.needsUpdate = true;
      tufo.computeBoundingSphere();
      tufo.userData.semSombra = true;
      tufo.name = 'tufos-da-beira';
      this.grupo.add(tufo);
    }
    if (pontosDePedra.length) {
      const geo = new THREE.IcosahedronGeometry(1, 0);
      const pedras = new THREE.InstancedMesh(geo, toon(0xffffff), pontosDePedra.length);
      const cores = [P.seixoClaro, P.seixoMeio, P.seixoEscuro, P.seixoMeio];
      const c = new THREE.Color();
      pontosDePedra.forEach(([x, z], i) => {
        const tam = 0.025 + rnd() * rnd() * 0.05;
        q.setFromEuler(e.set(rnd() * 3, rnd() * 3, rnd() * 3));
        m.compose(p.set(x, tam * 0.15, z), q, s.set(tam, tam * 0.5, tam * (0.8 + rnd() * 0.5)));
        pedras.setMatrixAt(i, m);
        pedras.setColorAt(i, c.setHex(cores[Math.floor(rnd() * cores.length)]));
      });
      pedras.instanceMatrix.needsUpdate = true;
      if (pedras.instanceColor) pedras.instanceColor.needsUpdate = true;
      pedras.computeBoundingSphere();
      pedras.userData.semSombra = true;
      pedras.name = 'pedrinhas-da-beira';
      this.grupo.add(pedras);
    }
  }
}

/**
 * O TUFO: sete folhinhas de capim em leque, cada uma um triângulo dobrado ao
 * meio (a dobra pega a luz do toon e separa uma folha da outra), as de fora
 * mais deitadas. ~20 cm de altura na escala 1.
 */
function geoDoTufo(): THREE.BufferGeometry {
  const pos: number[] = [];
  const rnd = sorteio(4242);
  const folhas = 7;
  for (let k = 0; k < folhas; k++) {
    const giro = (k / folhas) * Math.PI * 2 + rnd() * 0.6;
    const deita = 0.25 + rnd() * 0.55;
    const alto = 0.13 + rnd() * 0.1;
    const largo = 0.022 + rnd() * 0.012;
    const dir = new THREE.Vector3(Math.sin(giro), 0, Math.cos(giro));
    const lado = new THREE.Vector3(Math.cos(giro), 0, -Math.sin(giro));
    const ponta = dir.clone().multiplyScalar(Math.sin(deita) * alto * 1.3).setY(Math.cos(deita) * alto);
    const meio = dir.clone().multiplyScalar(Math.sin(deita) * alto * 0.45).setY(Math.cos(deita) * alto * 0.5);
    const base = dir.clone().multiplyScalar(0.012);
    const l = lado.clone().multiplyScalar(largo);
    // a nervura levanta um pouco o meio da folha: a dobra
    const nervura = meio.clone().add(new THREE.Vector3(0, 0.008, 0)).addScaledVector(dir, -0.006);
    const a = base.clone().sub(l);
    const b = base.clone().add(l);
    const ml = meio.clone().addScaledVector(lado, -largo * 0.7);
    const mr = meio.clone().addScaledVector(lado, largo * 0.7);
    for (const tri of [[a, base, nervura], [a, nervura, ml], [base, b, nervura], [b, mr, nervura], [ml, nervura, ponta], [nervura, mr, ponta]]) {
      for (const v of tri) pos.push(v.x, v.y, v.z);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}
