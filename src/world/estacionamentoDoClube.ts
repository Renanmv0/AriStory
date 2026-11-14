import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { novaTextura } from './texturasDeChao';

/** Peças do clube: metal verde/grafite, concreto claro e cobertura vazada. */
function caixa(g: THREE.Group, l: number, a: number, p: number, x: number, y: number, z: number, cor: number, raio = 0.025): THREE.Mesh {
  const m = new THREE.Mesh(quina(l, a, p, raio), toon(cor));
  m.position.set(x, y, z);
  g.add(m);
  return m;
}

/** Cantiléver: colunas só no fundo, nenhum pilar no corredor de circulação. */
export function coberturaDoEstacionamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'cobertura-do-estacionamento-do-clube';
  for (const z of [-3.3, 3.3]) {
    caixa(g, 0.55, 0.12, 0.6, -2.6, 0.06, z, P.clubeEstacionamentoConcreto);
    caixa(g, 0.18, 3.25, 0.2, -2.6, 1.7, z, P.clubeEstacionamentoMetal);
    const mao = caixa(g, 2.1, 0.13, 0.14, -1.7, 2.8, z, P.clubeEstacionamentoMetal);
    mao.rotation.z = 0.38;
    caixa(g, 5.9, 0.18, 0.16, 0, 3.29, z, P.clubeEstacionamentoMetal);
  }
  caixa(g, 0.18, 0.2, 8.1, -2.6, 3.25, 0, P.clubeEstacionamentoMetal);
  caixa(g, 0.12, 0.13, 8.1, 2.87, 3.34, 0, P.portaoMetal);
  // As ripas compartilham geometria/material: sombra leve e carros visíveis.
  const ripas = new THREE.InstancedMesh(quina(5.8, 0.09, 0.22, 0.018), toon(P.metalGrey), 17);
  const matriz = new THREE.Matrix4();
  for (let i = 0; i < 17; i++) ripas.setMatrixAt(i, matriz.makeTranslation(0, 3.43, -4 + i * 0.5));
  g.add(ripas);
  return g;
}

/** Jardineira oca, com terra abaixo da borda e capins de folhas curvas em lote. */
export function jardineiraDoEstacionamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'jardineira-do-estacionamento-do-clube';
  const concreto = P.clubeEstacionamentoConcreto;
  caixa(g, 3.4, 0.16, 1, 0, 0.09, 0, concreto);
  for (const z of [-0.43, 0.43]) caixa(g, 3.4, 0.5, 0.14, 0, 0.34, z, concreto);
  for (const x of [-1.63, 1.63]) caixa(g, 0.14, 0.49, 0.74, x, 0.33, 0, concreto);
  caixa(g, 3.1, 0.08, 0.7, 0, 0.49, 0, P.dirt);
  // Faixa rebaixada na frente: a jardineira pertence à arquitetura do clube.
  caixa(g, 3.2, 0.055, 0.018, 0, 0.23, 0.507, P.portaoMetal, 0.006);
  const folha = new THREE.Shape();
  folha.moveTo(-0.022, 0);
  folha.quadraticCurveTo(-0.12, 0.52, -0.31, 0.78);
  folha.quadraticCurveTo(-0.13, 0.65, 0.022, 0);
  const folhas = new THREE.InstancedMesh(new THREE.ShapeGeometry(folha, 5), toon(P.portaoMetal, { doubleSide: true }), 56);
  const m = new THREE.Object3D();
  for (let i = 0; i < 56; i++) {
    const tufo = Math.floor(i / 14), giro = i * 2.39996;
    m.position.set(-1.12 + tufo * 0.75 + Math.sin(giro) * 0.08, 0.52, Math.cos(giro) * 0.12);
    m.rotation.set(0, giro, 0);
    m.scale.setScalar(0.6 + (i % 5) * 0.085);
    m.updateMatrix();
    folhas.setMatrixAt(i, m.matrix);
  }
  g.add(folhas);
  return g;
}

/** Luminária linear, sem adicionar luz real ao renderizador. */
export function posteDoEstacionamento(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'poste-do-estacionamento-do-clube';
  caixa(g, 0.32, 0.13, 0.32, 0, 0.065, 0, P.clubeEstacionamentoConcreto);
  caixa(g, 0.1, 3.7, 0.12, 0, 1.9, 0, P.clubeEstacionamentoMetal);
  caixa(g, 1.25, 0.12, 0.32, 0.5, 3.74, 0, P.clubeEstacionamentoMetal);
  const luz = caixa(g, 1.08, 0.025, 0.23, 0.5, 3.67, 0, P.metalWhite, 0.008);
  luz.material = toon(P.metalWhite, { glow: 0.7 });
  return g;
}

/** O P integrado no totem de acesso, em vez da placa azul de poste do parque. */
export function totemDoEstacionamentoDoClube(): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'totem-do-estacionamento-do-clube';
  caixa(g, 0.82, 0.12, 0.5, 0, 0.06, 0, P.clubeEstacionamentoConcreto);
  caixa(g, 0.68, 1.95, 0.26, 0, 1.05, 0, P.clubeEstacionamentoMetal, 0.06);
  caixa(g, 0.72, 0.09, 0.29, 0, 1.91, 0, P.portaoMetal);
  const mapa = novaTextura('totem-do-clube', 1, (ctx, s) => {
    ctx.fillStyle = `#${P.portaoMetal.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = `#${P.metalWhite.toString(16)}`;
    ctx.font = `900 ${s * 0.7}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('P', s / 2, s * 0.49);
    ctx.fillRect(s * 0.2, s * 0.87, s * 0.6, s * 0.025);
  }).clone();
  mapa.repeat.set(1, 1);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.67), toon(P.metalWhite, { mapa, glow: 0.12 }));
  face.position.set(0, 1.4, 0.141);
  g.add(face);
  return g;
}
