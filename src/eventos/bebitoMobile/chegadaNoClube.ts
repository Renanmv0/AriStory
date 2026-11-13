import * as THREE from 'three';
import { animarChegadaNoParque } from './chegadaNoParque';

let motoristaDaChegada: string | null = null;
export function agendarChegadaNoClube(motorista: string): void { motoristaDaChegada = motorista; }
export function consumirChegadaNoClube(): string | null {
  const motorista = motoristaDaChegada; motoristaDaChegada = null; return motorista;
}

/** A mesma coreografia do parque, com o trajeto da rua e do lote do clube. */
export function animarChegadaNoClube(palco: Parameters<typeof animarChegadaNoParque>[0], p: Parameters<typeof animarChegadaNoParque>[1]): void {
  const v = (x: number, z: number): THREE.Vector3 => new THREE.Vector3(x, 0, z);
  animarChegadaNoParque(palco, { ...p, trajeto: [
    new THREE.CubicBezierCurve3(v(-35.6, -1), v(-35.6, 8), v(-35.6, 12.5), v(-38, 12.5)),
    new THREE.LineCurve3(v(-38, 12.5), v(-45.5, 12.5)),
    new THREE.CubicBezierCurve3(v(-45.5, 12.5), v(-50, 12.5), v(-52.2, 12.5), v(-52.2, 10)),
    new THREE.LineCurve3(v(-52.2, 10), v(-52.2, 5.5)),
    new THREE.CubicBezierCurve3(v(-52.2, 5.5), v(-52.2, 3), v(-55.3, 3), v(-58.2, 3)),
  ] });
}
