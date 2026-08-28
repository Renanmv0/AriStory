import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { ItemDef } from '../core/types';
import { copoDeSuco, frisbee, iceCream } from './props';

/**
 * O catalogo de itens do jogo.
 *
 * Um lugar so para as tres coisas que precisam andar juntas: a FICHA do item
 * (id, nome, emoji, pose), o MODELO que aparece na mao e o DONO, quando o item
 * e de uma pessoa so. Espalhar isso pelas cenas foi tentador e daria errado no
 * primeiro item que aparecesse em dois cenarios.
 *
 * Zero asset externo, como o resto: o emoji e o rosto do item no painel e o
 * corpo dele vem de `props.ts`, geometria procedural como qualquer peca.
 */

/** so para nao escrever a mesma string em quatro lugares */
export const ITENS = {
  sorveteMorango: {
    id: 'sorvete-morango',
    nome: 'Sorvete de morango',
    icone: '🍦',
    tipo: 'mao',
    nota: 'do Ari',
    holdPose: 'upright',
  },
  sorveteMaracuja: {
    id: 'sorvete-maracuja',
    nome: 'Sorvete de maracujá',
    icone: '🍦',
    tipo: 'mao',
    nota: 'do Renan',
    holdPose: 'upright',
  },
  sucoPessego: {
    id: 'suco-pessego',
    nome: 'Suco de pêssego',
    icone: '🥤',
    tipo: 'mao',
    nota: 'do Ari',
    holdPose: 'upright',
  },
  sucoMorango: {
    id: 'suco-morango',
    nome: 'Suco de morango',
    icone: '🥤',
    tipo: 'mao',
    nota: 'do Renan',
    holdPose: 'upright',
  },
  chapeuPingPong: {
    id: 'chapeu-ping-pong',
    nome: 'Chapéu de campeão',
    icone: '👑',
    tipo: 'vestivel',
    nota: 'ping pong, 5 a 0',
  },
  frisbee: {
    id: 'frisbee',
    nome: 'Frisbee',
    icone: '🥏',
    tipo: 'mao',
    nota: 'do parque',
    holdPose: 'relaxed',
  },
} as const satisfies Record<string, ItemDef>;

/**
 * O corpo de cada item, na MAO.
 *
 * O que se veste nao entra aqui: acessorio e parte do corpo (o chapeu de
 * campeao ja nasce dentro do `CharacterRig`), e o inventario so decide se ele
 * aparece ou nao.
 *
 * Cada chamada devolve uma malha NOVA: o mesmo `Object3D` nao pode ter dois
 * pais, e a mesma ficha pode acabar na mao de duas pessoas em cenas diferentes.
 */
const MODELOS: Record<string, () => THREE.Object3D> = {
  'sorvete-morango': () => iceCream(P.morango),
  'sorvete-maracuja': () => iceCream(P.maracuja),
  'suco-pessego': () => copoDeSuco(P.pessego),
  'suco-morango': () => copoDeSuco(P.morango),
  'frisbee': () => frisbee(P.frisbee),
};

/** Modelo do item para pendurar na mao, ou null se ele nao tem corpo. */
export function modeloDoItem(id: string): THREE.Object3D | null {
  const obj = MODELOS[id]?.();
  if (!obj) return null;
  // etiqueta para o teste conseguir dizer o que cada mao esta segurando
  obj.userData.item = id;
  return obj;
}
