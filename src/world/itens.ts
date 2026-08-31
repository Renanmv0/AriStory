import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import type { ItemDef } from '../core/types';
import { copoDeSuco, frisbee, iceCream } from './props';
import {
  canoDaBota, gargantilhaDeLaco, gorroDeLa,
  vestidoGatinho, vestidoMarinheiro, vestidoRosa,
} from './roupas';

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
  // ------------------------------------------------------------ vestiveis
  // Todo vestivel declara o `slot`, porque as 4 vagas de vestimenta SAO as 4
  // partes do corpo. E o que faz chapeu e patins conviverem (cabeca e pe sao
  // vagas diferentes) e dois chapeus nao conviverem.
  chapeuPingPong: {
    id: 'chapeu-ping-pong',
    nome: 'Chapéu de campeão',
    icone: '👑',
    tipo: 'vestivel',
    slot: 'cabeca',
    nota: 'ping pong, 5 a 0',
  },
  patins: {
    id: 'patins',
    nome: 'Patins',
    icone: '🛼',
    tipo: 'vestivel',
    slot: 'pes',
    nota: 'da lojinha do parque',
  },
  gorroDeLa: {
    id: 'gorro-la',
    nome: 'Gorro de lã',
    icone: '🧢',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.roupaLa,
    corDetalhe: P.roupaLaBarra,
    nota: 'para o frio que nunca faz',
    cobreCabelo: true,
    extra: gorroDeLa,
  },
  camisaListrada: {
    id: 'camisa-listrada',
    nome: 'Camisa listrada',
    icone: '👕',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.roupaListra,
    corDetalhe: P.roupaListraManga,
    nota: 'mangas claras',
  },
  calcaJeans: {
    id: 'calca-jeans',
    nome: 'Calça jeans',
    icone: '👖',
    tipo: 'vestivel',
    slot: 'pernas',
    cor: P.roupaJeans,
    nota: 'a de sempre',
  },
  vestidoRosa: {
    id: 'vestido-rosa',
    nome: 'Vestido rosa de babados',
    icone: '👗',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.vestidoRosa,
    corDetalhe: P.vestidoRenda,
    nota: 'da vitrine que o Renan viu',
    // sem manga e com a perna de fora, como na foto
    bracosNus: true,
    pernasNuas: true,
    extra: vestidoRosa,
  },
  maidMarinheiro: {
    id: 'maid-marinheiro',
    nome: 'Maid marinheiro',
    icone: '🖤',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.maidPreto,
    // a manga bufante da foto e BRANCA, e a manga do rig e o `detalhe`
    corDetalhe: P.maidCreme,
    nota: 'gola de marinheiro e cadarço',
    pernasNuas: true,
    extra: vestidoMarinheiro,
  },
  maidGatinho: {
    id: 'maid-gatinho',
    nome: 'Maid gatinho',
    icone: '🐱',
    tipo: 'vestivel',
    slot: 'tronco',
    cor: P.maidPreto,
    // neste a manga bufante e preta, igual ao corpo
    corDetalhe: P.maidPreto,
    nota: 'com guizo e cara de gato',
    pernasNuas: true,
    extra: vestidoGatinho,
  },
  gargantilhaDeLaco: {
    id: 'gargantilha-laco',
    nome: 'Gargantilha de laço',
    icone: '🎀',
    tipo: 'vestivel',
    slot: 'cabeca',
    cor: P.vestidoFita,
    nota: 'combina com o vestido',
    extra: gargantilhaDeLaco,
  },
  botaAmarela: {
    id: 'bota-amarela',
    nome: 'Bota amarela',
    icone: '🥾',
    tipo: 'vestivel',
    slot: 'pes',
    cor: P.roupaBota,
    corDetalhe: P.roupaBotaCano,
    nota: 'chama atenção de longe',
    extra: canoDaBota,
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

const PORID: Record<string, ItemDef> = Object.fromEntries(
  Object.values(ITENS).map((i) => [i.id, i as ItemDef]),
);

/**
 * A ficha oficial de um item, pelo id.
 *
 * O save guarda uma COPIA do item dentro da vaga, e copia envelhece: uma versao
 * antiga do jogo chegou a reescrever o `tipo` ao mover de lista, e o chapeu
 * salvo naquele dia virou um item de mao que nao dava mais para vestir. Por
 * isso o catalogo, e nao o save, e quem manda na categoria.
 *
 * Devolve null para id que nao esta no catalogo (item de teste, por exemplo).
 */
export function fichaDoItem(id: string): ItemDef | null {
  return PORID[id] ?? null;
}

/** Modelo do item para pendurar na mao, ou null se ele nao tem corpo. */
export function modeloDoItem(id: string): THREE.Object3D | null {
  const obj = MODELOS[id]?.();
  if (!obj) return null;
  // etiqueta para o teste conseguir dizer o que cada mao esta segurando
  obj.userData.item = id;
  return obj;
}
