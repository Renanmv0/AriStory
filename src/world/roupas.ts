import * as THREE from 'three';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import type { MedidasCorpo, PecaRoupa, SlotRoupa } from '../core/types';

/**
 * O acervo de roupas do jogo.
 *
 * Mesma ideia do catalogo de itens em `itens.ts`, e pelo mesmo motivo: o save
 * guarda o ID da peca, nunca uma copia da ficha. Copia envelhece — foi assim
 * que o chapeu de campeao ficou preso como item de mao numa versao antiga — e
 * aqui e o catalogo, e so ele, que diz em que slot a peca mora e de que cor
 * ela e.
 *
 * Este e um sistema PARALELO ao inventario: nada aqui ocupa vaga de mochila
 * nem de acessorio, e os patins e o chapeu de campeao continuam sendo `ItemDef`
 * como sempre foram.
 *
 * Zero asset externo, como todo o resto: a peca e primitiva do Three.js e o
 * material vem de `toon()`.
 */

// ------------------------------------------------------------------ geometria
//
// So `cabeca` e `pes` tem corpo proprio. Tronco e pernas se resolvem trocando o
// material das capsulas que ja existem — e o que garante que nenhuma roupa
// encoste nos pivos de rotacao da caminhada.

/**
 * Gorro de la: calota que cobre o cabelo, com a barra dobrada na borda.
 *
 * A barra tem que cair EXATAMENTE na borda de baixo da calota, e nao mais
 * larga que ela. Uma casca esferica de raio R aberta ate `thetaLength` termina
 * em `y = centro + R·cos(theta)` com raio `R·sen(theta)` — errar essas duas
 * contas poe um anel largo no meio da cupula, e o gorro vira sombrero.
 */
function gorroDeLa(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const r = m.headR;

  // Este gorro pede `cobreCabelo`, entao ele pode ser JUSTO: sem a juba por
  // baixo, basta folgar um pouco do cranio. Um chapeu que so pousa por cima
  // (bone, o chapeu de campeao) e que precisa medir pelo cabelo.
  const RAIO = r * 1.07;
  const ABRE = Math.PI * 0.54;
  const CENTRO = r * 0.06;
  const calota = new THREE.Mesh(
    new THREE.SphereGeometry(RAIO, 18, 12, 0, Math.PI * 2, 0, ABRE),
    toon(P.roupaLa),
  );
  calota.position.y = CENTRO;
  calota.scale.y = 1.16; // um pouco alto: gorro achatado lembra boina
  g.add(calota);

  // onde a casca de fato termina — ver o comentario do cabecalho
  const borda = CENTRO + RAIO * Math.cos(ABRE) * 1.16;
  const raioNaBorda = RAIO * Math.sin(ABRE);
  const barra = new THREE.Mesh(
    new THREE.CylinderGeometry(raioNaBorda * 1.03, raioNaBorda * 1.03, r * 0.26, 18),
    toon(P.roupaLaBarra),
  );
  barra.position.y = borda;
  g.add(barra);

  const pompom = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.2, 10, 8),
    toon(P.roupaLaBarra),
  );
  pompom.position.y = CENTRO + RAIO * 1.16;
  g.add(pompom);

  return g;
}

/**
 * Cano da bota, no tornozelo.
 *
 * Nasce no referencial do PIVO da perna, igual ao patins: o pe esta em
 * `-legH + h*0.022`, entao o cano fica logo acima disso e desce um pouco para
 * cobrir a costura.
 */
function canoDaBota(m: MedidasCorpo): THREE.Object3D {
  const g = new THREE.Group();
  const cano = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.05 * m.w, m.h * 0.055 * m.w, m.h * 0.08, 12),
    toon(P.roupaBotaCano),
  );
  cano.position.y = -m.legH + m.h * 0.075;
  g.add(cano);

  const dobra = new THREE.Mesh(
    new THREE.CylinderGeometry(m.h * 0.058 * m.w, m.h * 0.058 * m.w, m.h * 0.018, 12),
    toon(P.roupaBota),
  );
  dobra.position.y = -m.legH + m.h * 0.113;
  g.add(dobra);

  return g;
}

// ------------------------------------------------------------------- catalogo

/** so para nao escrever a mesma string em quatro lugares */
export const ROUPAS = {
  gorroDeLa: {
    id: 'gorro-la',
    nome: 'Gorro de lã',
    icone: '🧢',
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
    slot: 'tronco',
    cor: P.roupaListra,
    corDetalhe: P.roupaListraManga,
    nota: 'mangas claras',
  },
  calcaJeans: {
    id: 'calca-jeans',
    nome: 'Calça jeans',
    icone: '👖',
    slot: 'pernas',
    cor: P.roupaJeans,
  },
  botaAmarela: {
    id: 'bota-amarela',
    nome: 'Bota amarela',
    icone: '🥾',
    slot: 'pes',
    cor: P.roupaBota,
    corDetalhe: P.roupaBotaCano,
    extra: canoDaBota,
  },
} as const satisfies Record<string, PecaRoupa>;

const PORID: Record<string, PecaRoupa> = Object.fromEntries(
  Object.values(ROUPAS).map((p) => [p.id, p as PecaRoupa]),
);

/**
 * A ficha oficial de uma peca, pelo id.
 *
 * Autoridade unica: o save guarda id, e tudo o mais — slot, cor, geometria —
 * sai daqui na hora de usar. Devolve null para id desconhecido, que e como uma
 * peca tirada do catalogo some sozinha de um save antigo.
 */
export function fichaDaPeca(id: string): PecaRoupa | null {
  return PORID[id] ?? null;
}

/** Todas as pecas de um slot, para a tela do armario montar a prateleira. */
export function pecasDoSlot(slot: SlotRoupa): PecaRoupa[] {
  return Object.values(PORID).filter((p) => p.slot === slot);
}

/** O acervo inteiro, na ordem do catalogo. */
export function todasAsPecas(): PecaRoupa[] {
  return Object.values(PORID);
}
