import { PRAGAS } from './bichosDoJardim';
import { retratoDe } from './retrato';

/**
 * O RETRATO DE UMA PRAGA para a aba de pragas do livro — o MESMO modelo 3D
 * da rodada, fotografado pelo estúdio de `retrato.ts`, de três quartos como a
 * câmera do jogo vê.
 */
export function retratoDePraga(id: string): string {
  const ficha = PRAGAS.find((p) => p.id === id);
  return ficha ? retratoDe(`praga:${id}`, () => ficha.monta(1, 0.5), -0.6) : '';
}
