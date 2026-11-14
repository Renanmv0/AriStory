import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { reboco } from './texturasDeFachada';
import { uvDeParede } from './acabamento';
import { novaTextura, tapeteDeGrama } from './texturasDeChao';

/**
 * ===================================================== O ESTACIONAMENTO DA ESCOLA DO GATITO
 *
 * Do outro lado da rua do pátio (`scenes/escolaPatio.ts`), pedido pelo Renan:
 * "do outro lado da rua deve ter um estacionamento, faça ambos bonitos
 * detalhados". As peças: o POSTE alto de duas luminárias com as bandeirolas
 * dos Gatitos (o espírito de escola americana), a ILHA elevada com a guia de
 * concreto e a grama, os BATENTES de roda em lote, a SETA pintada e o
 * símbolo da VAGA de cadeira de rodas. A pintura das vagas, as faixas e o
 * coração da vaga do Bebito são da cena (decalques juntados).
 */

// ================================================================ o poste

/**
 * O POSTE DO ESTACIONAMENTO: a coluna cônica de ferro escuro num pé de
 * concreto, o braço em T no alto com as duas luminárias chatas (a face de
 * baixo acesa) e, no meio da coluna, as duas BANDEIROLAS dos Gatitos — uma
 * azul com a pata, outra amarela com o nome. ~6,6 m. Frente para `+Z`.
 */
export function posteDoEstacionamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'poste-do-estacionamento';
  const metal = toon(P.escolaFerro);
  const concreto = toon(P.concrete, { mapa: reboco(1.2) });
  const luz = toon(P.luzDoPoste, { glow: 0.9 });
  const pe = new THREE.Mesh(uvDeParede(new THREE.CylinderGeometry(0.32, 0.38, 0.6, 12)), concreto);
  pe.position.y = 0.3;
  g.add(pe);
  const coluna = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 6.0, 10), metal);
  coluna.position.y = 0.6 + 3.0;
  g.add(coluna);
  const braco = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), metal);
  braco.position.y = 6.5;
  g.add(braco);
  for (const s of [-1, 1]) {
    const cabeca = new THREE.Mesh(quina(0.72, 0.14, 0.36, 0.04), metal);
    cabeca.position.set(s * 1.05, 6.44, 0);
    g.add(cabeca);
    const acesa = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.26), luz);
    acesa.rotation.x = Math.PI / 2;
    acesa.position.set(s * 1.05, 6.365, 0);
    g.add(acesa);
  }
  const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), toon(P.gold));
  ponta.position.y = 6.62;
  g.add(ponta);
  // as bandeirolas: os dois suportes e os dois panos, de costas um para o outro
  for (const s of [-1, 1]) {
    for (const y of [3.0, 4.55]) {
      const suporte = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.62, 5), metal);
      suporte.rotation.z = Math.PI / 2;
      suporte.position.set(s * 0.37, y, 0);
      g.add(suporte);
    }
    for (const lado of [-1, 1]) {
      const pano = new THREE.Mesh(geoDaBandeirola(), toon(0xffffff, { mapa: bandeirola(s < 0 ? 'pata' : 'nome') }));
      pano.position.set(s * 0.38, 3.77, lado * 0.012);
      if (lado < 0) pano.rotation.y = Math.PI;
      g.add(pano);
    }
  }
  return g;
}

/** o pano da bandeirola já recortado com a ponta em V (o UV de 0 a 1 no retângulo dele) */
function geoDaBandeirola(): THREE.BufferGeometry {
  const forma = new THREE.Shape();
  forma.moveTo(-0.28, 0.75);
  forma.lineTo(-0.28, -0.75);
  forma.lineTo(0, -0.55);
  forma.lineTo(0.28, -0.75);
  forma.lineTo(0.28, 0.75);
  forma.closePath();
  const geo = new THREE.ShapeGeometry(forma);
  const pos = geo.getAttribute('position');
  const uv = geo.getAttribute('uv');
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + 0.28) / 0.56, (pos.getY(i) + 0.75) / 1.5);
  return geo;
}

const bandeirolas = new Map<string, THREE.CanvasTexture>();

/** a bandeirola: azul com a pata amarela, ou amarela com "GATITOS" de pé, e a ponta em V */
function bandeirola(qual: 'pata' | 'nome'): THREE.CanvasTexture {
  const pronta = bandeirolas.get(qual);
  if (pronta) return pronta;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 342;
  const ctx = canvas.getContext('2d');
  const hex = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;
  if (ctx) {
    const W = 128;
    const H = 342;
    const fundo = qual === 'pata' ? P.bandeiraGatitosAzul : P.escolaArmarioAmarelo;
    const frente = qual === 'pata' ? P.escolaArmarioAmarelo : P.bandeiraGatitosAzul;
    // (a ponta em V é a forma do pano: o canvas é o retângulo inteiro)
    ctx.fillStyle = hex(fundo);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = hex(frente);
    ctx.fillRect(0, 8, W, 8);
    if (qual === 'pata') {
      ctx.beginPath();
      ctx.ellipse(W / 2, H * 0.48, 26, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      for (const [dx, dy] of [[-30, -28], [-11, -42], [11, -42], [30, -28]]) {
        ctx.beginPath();
        ctx.ellipse(W / 2 + dx, H * 0.48 + dy, 9, 11, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.save();
      ctx.translate(W / 2, H * 0.45);
      ctx.rotate(-Math.PI / 2);
      ctx.font = '800 54px ui-rounded, "Nunito", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GATITOS', 0, 0);
      ctx.restore();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  bandeirolas.set(qual, tex);
  return tex;
}

// ================================================================ a ilha

/**
 * A ILHA do estacionamento: a guia de concreto em volta (quatro réguas com a
 * quina chanfrada, as compridas passando por cima das pontas) e o miolo de
 * grama um palmo acima do asfalto. Centrada, `largura` no X e `fundo` no Z.
 */
export function ilhaDoEstacionamento(largura: number, fundo: number): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'ilha-do-estacionamento';
  const guia = toon(P.concrete);
  const grama = toon(P.grass, { mapa: tapeteDeGrama(9) });
  for (const s of [-1, 1]) {
    const comprida = new THREE.Mesh(quina(largura, 0.16, 0.18, 0.03), guia);
    comprida.position.set(0, 0.08, s * (fundo / 2 - 0.09));
    g.add(comprida);
    const ponta = new THREE.Mesh(quina(0.18, 0.15, fundo - 0.36, 0.03), guia);
    ponta.position.set(s * (largura / 2 - 0.09), 0.075, 0);
    g.add(ponta);
  }
  const miolo = new THREE.BoxGeometry(largura - 0.34, 0.12, fundo - 0.34);
  // o UV da grama em metros, visto de cima (o mesmo azulejo do chão da cena)
  const uv = miolo.getAttribute('uv');
  const pos = miolo.getAttribute('position');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i), -pos.getZ(i));
  const m = new THREE.Mesh(miolo, grama);
  m.position.y = 0.06;
  g.add(m);
  return g;
}

// ============================================================ os batentes

/** os batentes de roda (o "tijolo" de concreto na cabeça da vaga), num lote: `[x, z, giro]` */
export function batentesDeRoda(pontos: ReadonlyArray<readonly [number, number, number]>): THREE.InstancedMesh {
  const geo = quina(1.7, 0.13, 0.24, 0.04);
  const lote = new THREE.InstancedMesh(geo, toon(P.escolaPedra), pontos.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  pontos.forEach(([x, z, giro], i) => {
    m.compose(new THREE.Vector3(x, 0.065, z), q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), giro), new THREE.Vector3(1, 1, 1));
    lote.setMatrixAt(i, m);
  });
  lote.instanceMatrix.needsUpdate = true;
  lote.computeBoundingSphere();
  lote.userData.peca = 'batentes-de-roda';
  return lote;
}

// ============================================================ o que se pinta

/**
 * A SETA pintada no asfalto, no plano do decalque (`x` é o `x` do mundo e o
 * `y` é o `−z`), apontando para `+X`, com 2,4 m de comprimento.
 */
export function geoSeta(x: number, z: number, sentido: 1 | -1): THREE.BufferGeometry {
  const s = new THREE.Shape();
  const pts: Array<[number, number]> = [[-1.2, -0.16], [0.35, -0.16], [0.35, -0.48], [1.2, 0], [0.35, 0.48], [0.35, 0.16], [-1.2, 0.16]];
  pts.forEach(([px, py], i) => (i ? s.lineTo(px * sentido, py) : s.moveTo(px * sentido, py)));
  s.closePath();
  const geo = new THREE.ShapeGeometry(s);
  if (sentido < 0) {
    // espelhada, a forma vira a face para baixo: o índice ao contrário a desvira
    const idx = geo.getIndex();
    if (idx) for (let i = 0; i < idx.count; i += 3) { const a = idx.getX(i + 1); idx.setX(i + 1, idx.getX(i + 2)); idx.setX(i + 2, a); }
  }
  geo.translate(x, -z, 0);
  return geo;
}

/**
 * O SÍMBOLO DA VAGA de cadeira de rodas: o bonequinho branco sobre o azul
 * (um azulejo de 1,4 m, uma cópia só). A vaga em volta é pintada de azul.
 */
export function simboloDeAcessivel(): THREE.CanvasTexture {
  return novaTextura('escola:acessivel', 1.4, (ctx, s) => {
    ctx.fillStyle = `#${P.vagaAcessivel.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = s * 0.07;
    ctx.lineCap = 'round';
    const k = s / 256;
    // a cabeça, o tronco, o braço, a perna e a roda
    ctx.beginPath();
    ctx.arc(118 * k, 52 * k, 17 * k, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(112 * k, 82 * k);
    ctx.lineTo(118 * k, 146 * k);
    ctx.lineTo(176 * k, 146 * k);
    ctx.lineTo(196 * k, 196 * k);
    ctx.moveTo(114 * k, 108 * k);
    ctx.lineTo(160 * k, 108 * k);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(116 * k, 168 * k, 46 * k, -Math.PI * 0.15, Math.PI * 1.45);
    ctx.stroke();
  });
}
