import type { GameAPI } from '../../core/types';
import { ARI, RENAN } from '../../characters/cast';

/** O pouco que os pedacos do parque precisam dividir entre si. */

export const A = ARI.name;
export const R = RENAN.name;

export type Conversa = (falas: Array<readonly [string, string]>) => Promise<void>;

/** Vai e volta de falas, com o nome certo em cada balao. */
export function criarConversa(g: GameAPI): Conversa {
  return async (falas) => {
    for (const [quem, texto] of falas) await g.say([texto], quem);
  };
}

// A quadra de frisbee: fora dela o disco nem aparece na mao.
export const QUADRA = { x: 18, z: -4.5, largura: 26, profundidade: 19 };

export const qx0 = QUADRA.x - QUADRA.largura / 2; // 5
export const qx1 = QUADRA.x + QUADRA.largura / 2; // 31
export const qz0 = QUADRA.z - QUADRA.profundidade / 2; // -14
export const qz1 = QUADRA.z + QUADRA.profundidade / 2; // 5

export const naQuadra = (x: number, z: number, margem = 0): boolean =>
  Math.abs(x - QUADRA.x) < QUADRA.largura / 2 - margem &&
  Math.abs(z - QUADRA.z) < QUADRA.profundidade / 2 - margem;

/** Sorteio de especie de arvore. A repeticao de 'redonda' deixa ela mais comum. */
export const KINDS = ['redonda', 'redonda', 'pinheiro', 'florida', 'palmeira'] as const;
