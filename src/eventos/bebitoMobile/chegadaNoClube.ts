import * as THREE from 'three';
import { animarChegadaNoParque } from './chegadaNoParque';

let motoristaDaChegada: string | null = null;
export function agendarChegadaNoClube(motorista: string): void { motoristaDaChegada = motorista; }
export function consumirChegadaNoClube(): string | null {
  const motorista = motoristaDaChegada; motoristaDaChegada = null; return motorista;
}

/** A cancela e a descida compartilham o motor do parque; o clube tem tomadas próprias. */
export function animarChegadaNoClube(palco: Parameters<typeof animarChegadaNoParque>[0], p: Parameters<typeof animarChegadaNoParque>[1]): void {
  const v = (x: number, z: number): THREE.Vector3 => new THREE.Vector3(x, 0, z);
  animarChegadaNoParque(palco, { ...p,
    apresentacao: 1.8,
    duracoes: [5, 3.8, 3.8, 3.2, 5.2],
    tomada: (posicao, fase, trecho, emPe) => {
      if (fase === 'apresentando') {
        const para = new THREE.Vector3(-48, 0.9, 7.5);
        return { para, de: para.clone().add(new THREE.Vector3(13, 17, 18).multiplyScalar(emPe ? 2.6 : 1)) };
      }
      if (trecho >= 3) {
        // Inclui o carro e a vaga na mesma imagem; a curva não some atrás dele.
        const para = posicao.clone().lerp(new THREE.Vector3(-58.2, 0, 3), 0.35);
        para.y = 0.8;
        return { para, de: para.clone().add(new THREE.Vector3(7.5, 9, 10.5).multiplyScalar(emPe ? 1.6 : 1)) };
      }
      // A câmera vem do lado do lote, em vez de olhar através do ônibus na rua.
      const para = posicao.clone().add(new THREE.Vector3(0, 0.7, 0));
      return { para, de: para.clone().add(new THREE.Vector3(-7.8, 7.4, 9.2).multiplyScalar(emPe ? 1.5 : 1)) };
    },
    trajeto: [
    new THREE.CubicBezierCurve3(v(-35.6, -1), v(-35.6, 8), v(-35.6, 12.5), v(-38, 12.5)),
    new THREE.LineCurve3(v(-38, 12.5), v(-45.5, 12.5)),
    new THREE.CubicBezierCurve3(v(-45.5, 12.5), v(-50, 12.5), v(-52.2, 12.5), v(-52.2, 10)),
    new THREE.LineCurve3(v(-52.2, 10), v(-52.2, 5.5)),
    new THREE.CubicBezierCurve3(v(-52.2, 5.5), v(-52.2, 3), v(-55.3, 3), v(-58.2, 3)),
  ] });
}
