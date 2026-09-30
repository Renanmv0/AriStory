import type * as THREE from 'three';
import { CharacterRig } from '../characters/CharacterRig';
import { ARI, RENAN } from '../characters/cast';
import { Gatito } from '../entities/bichos/Gatito';
import { Josefina } from '../entities/bichos/Josefina';
import { Estrella, Luna, Sol } from '../entities/bichos/CoelhaDaTorcida';
import { Walter } from '../entities/bichos/Walter';
import type { Falante } from '../minigames/aula/tipos';
import { retratoDoRosto } from './retrato';

/**
 * O ROSTO DE QUEM FALA nos quadrinhos da apostila do Gatito — o MESMO modelo
 * do jogo, fotografado de frente pelo estúdio de `retrato.ts` (uma foto por
 * pessoa, guardada). Nada de desenho à parte: o Gatito da apostila é o Gatito
 * da escola, de oculinhos, que é como ele dá aula.
 */

/** o bicho não passeia no estúdio: a área dele é um ponto */
const PARADO = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };

const MONTA: Record<Falante, { monta: () => THREE.Object3D; cabeca?: string }> = {
  ari: { monta: () => new CharacterRig(ARI).group },
  renan: { monta: () => new CharacterRig(RENAN).group },
  gatito: {
    monta: () => {
      const g = new Gatito(PARADO);
      g.usarOculos(true);
      return g.group;
    },
  },
  luna: { monta: () => new Luna(PARADO).group, cabeca: 'cabeca-da-luna' },
  sol: { monta: () => new Sol(PARADO).group, cabeca: 'cabeca-da-sol' },
  estrella: { monta: () => new Estrella(PARADO).group, cabeca: 'cabeca-da-estrella' },
  walter: { monta: () => new Walter(PARADO).group },
  josefina: { monta: () => new Josefina(PARADO).group },
};

export function retratoDoFalante(quem: Falante): string {
  const m = MONTA[quem];
  return m ? retratoDoRosto(`rosto:${quem}`, m.monta, { cabeca: m.cabeca }) : '';
}
