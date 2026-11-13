import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { quina } from './lojaDeRoupas';
import { fundir } from './fundir';
import { novaTextura } from './texturasDeChao';

/** Frente retrô, paralamas curvos e detalhes próprios de cada pequeno comércio. */
export function acabamentoDosCarros(jardim: boolean): THREE.Group {
  const g = new THREE.Group();
  const creme = P.aventalFaixa, destaque = jardim ? P.portaoMetal : P.aventalDoNoel;
  const por = (geo: THREE.BufferGeometry, cor: number, x: number, y: number, z: number): THREE.Mesh => {
    const m = new THREE.Mesh(geo, toon(cor)); m.position.set(x, y, z); g.add(m); return m;
  };
  por(quina(1.94, .42, .24, .11), creme, 0, .59, 2.16);
  por(quina(.88, .22, .04, .08), destaque, 0, .58, 2.295);
  for (const y of [.52, .58, .64]) por(quina(.72, .018, .028, .007), P.metalGrey, 0, y, 2.324);
  for (const lado of [-1, 1]) {
    por(new THREE.TorusGeometry(.18, .045, 8, 20), P.metalGrey, lado * .69, .72, 2.29);
    const luz = por(new THREE.SphereGeometry(.15, 14, 10), P.casaLuzDoMuro, lado * .69, .72, 2.30); luz.scale.z = .35;
    for (const z of [-1.364, 1.364]) {
      const arco = por(new THREE.TorusGeometry(.405, .075, 8, 20, Math.PI), creme, lado * 1.015, .34, z); arco.rotation.y = Math.PI / 2;
    }
    por(quina(.045, .38, .045, .015), P.metalGrey, lado * 1.06, 1.1, .71);
    const espelho = por(quina(.22, .29, .12, .055), creme, lado * 1.13, 1.29, .71); espelho.rotation.y = lado * .25;
    por(quina(.27, .045, .05, .015), P.metalGrey, lado * 1.025, .84, .1);
    por(quina(.04, .055, 2.9, .015), creme, lado * 1.024, .4, -.1);
  }
  // Painéis em madeira com desenho de folhas, ou faixa cítrica pintada no capô.
  const mapa = novaTextura(jardim ? 'carro-jardim-madeira' : 'carro-sucos-citricos', 1, (ctx, s) => {
    const tinta = (c: number): string => '#' + c.toString(16).padStart(6, '0');
    ctx.fillStyle = tinta(jardim ? P.wood : creme); ctx.fillRect(0, 0, s, s);
    if (jardim) {
      ctx.strokeStyle = tinta(P.woodDark); ctx.lineWidth = 2;
      for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.moveTo(0, i * s / 14); ctx.bezierCurveTo(s * .3, i * s / 14 + 7, s * .7, i * s / 14 - 7, s, i * s / 14); ctx.stroke(); }
    }
    for (let i = 0; i < 3; i++) {
      const x = s * (.22 + i * .28), y = s * .52;
      ctx.fillStyle = tinta(jardim ? P.lacoDaJosefina : P.laranjaCasca);
      for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(k) * s * .055, y + Math.sin(k) * s * .055, s * .05, s * .035, k, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = tinta(P.laranjaPolpa); ctx.beginPath(); ctx.arc(x, y, s * .035, 0, Math.PI * 2); ctx.fill();
    }
  });
  const face = (w: number, h: number, x: number, y: number, z: number, giro: number): void => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), toon(P.metalWhite, { mapa })); m.position.set(x, y, z); m.rotation.y = giro; g.add(m);
  };
  if (jardim) {
    for (const lado of [-1, 1]) face(1.42, .30, lado * .958, 1.23, -1.3, lado * Math.PI / 2);
  } else {
    por(quina(.32, .025, 1.1, .01), destaque, -.56, .997, 1.36);
    face(.8, .25, 0, .6, -2.235, Math.PI);
  }
  return fundir(g);
}
