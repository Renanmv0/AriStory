import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { canteiroDeHorta, estufa, fence, tree } from './props';
import { novaTextura } from './texturasDeChao';
import { quina } from './lojaDeRoupas';

/** Novos motivos de paisagem, montados com as plantas e construções do jogo. */
export function hortaDaAlameda(semente: number): THREE.Group {
  const g = new THREE.Group(); g.userData.peca = 'horta-da-alameda';
  for (const x of [-2, 2]) for (let k = 0; k < 3; k++) {
    const canteiro = canteiroDeHorta(k % 2 ? 'lavanda' : 'girassol', 2.6, 1.5, semente + k * 0.17);
    canteiro.position.set(x, 0, -3 + k * 3); g.add(canteiro);
  }
  const casca = estufa(6, 3.2); casca.position.set(0, 0, -8); g.add(casca);
  const cerca = fence(10, 0.85); cerca.position.set(0, 0, 5); g.add(cerca);
  return g;
}

/** Pomar: árvores existentes com as laranjas em um único lote. */
export function pomarDaAlameda(semente: number): THREE.Group {
  const g = new THREE.Group(); g.userData.peca = 'pomar-da-alameda';
  const frutas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), toon(P.laranjaCasca), 24);
  const m = new THREE.Matrix4();
  for (let k = 0; k < 3; k++) {
    const arvore = tree('redonda', 0.85, semente + k); arvore.position.set(0, 0, k * 5 - 5); g.add(arvore);
    for (let i = 0; i < 8; i++) {
      const a = i * 2.4 + k;
      frutas.setMatrixAt(k * 8 + i, m.makeTranslation(Math.cos(a) * 1.05, 2.25 + (i % 3) * 0.2, k * 5 - 5 + Math.sin(a) * 1.05));
    }
  }
  g.add(frutas); return g;
}

/** Quadra ao ar livre na região do clube: pintura em canvas, rede e alambrado baixo. */
export function quadraNaAlameda(): THREE.Group {
  const g = new THREE.Group(); g.userData.peca = 'quadra-na-alameda';
  const mapa = novaTextura('quadra-da-alameda', 1, (ctx, s) => {
    ctx.fillStyle = `#${P.portaoMetal.toString(16)}`; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = `#${P.metalWhite.toString(16)}`; ctx.lineWidth = 2;
    ctx.strokeRect(s * 0.12, s * 0.08, s * 0.76, s * 0.84);
    ctx.strokeRect(s * 0.22, s * 0.08, s * 0.56, s * 0.84);
    ctx.strokeRect(s * 0.22, s * 0.3, s * 0.56, s * 0.4);
    ctx.beginPath(); ctx.moveTo(s / 2, s * 0.3); ctx.lineTo(s / 2, s * 0.7); ctx.stroke();
  }).clone(); mapa.repeat.set(1, 1);
  const piso = new THREE.Mesh(new THREE.BoxGeometry(11, 0.08, 19), toon(P.clubeEstacionamentoConcreto));
  piso.position.y = 0.04; g.add(piso);
  const pintura = new THREE.Mesh(new THREE.PlaneGeometry(10, 18), toon(P.metalWhite, { mapa }));
  pintura.rotation.x = -Math.PI / 2; pintura.position.y = 0.085; g.add(pintura);
  for (const x of [-4.3, 4.3]) {
    const p = new THREE.Mesh(quina(0.08, 1.1, 0.08, 0.015), toon(P.portaoMetal)); p.position.set(x, 0.55, 0); g.add(p);
  }
  const fios = new THREE.Group();
  for (let y = 0.3; y <= 1.05; y += 0.15) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.015, 0.015), toon(P.metalWhite)); f.position.y = y; fios.add(f);
  }
  for (let x = -4.2; x < 4.3; x += 0.3) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.78, 0.012), toon(P.portaoMetal)); f.position.set(x, 0.66, 0.007); fios.add(f);
  }
  g.add(fios);
  for (const z of [-10, 10]) { const cerca = fence(12, 1); cerca.position.z = z; g.add(cerca); }
  return g;
}
