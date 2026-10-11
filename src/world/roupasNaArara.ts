import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon } from '../core/materials';
import type { ItemDef } from '../core/types';
import { PALETTE as P } from '../palette';

/**
 * ======================================== AS ROUPAS QUE A ARARA MOSTRA
 *
 * A arara da boutique mostra o que ela VENDE: a camisaria pendura as quatro
 * camisas do catálogo (linho, menta, terracota e a regata), os vestidos os
 * quatro vestidos, e assim por diante. A primeira versão pendurava "uma
 * coleção de cores que combinasse" — e quem abria a arara de pano azul via no
 * painel um vestido manteiga. Agora a peça pendurada e a peça à venda saem da
 * MESMA ficha (`ItemDef`, em `world/itens.ts`): a cor e o detalhe são os
 * dela.
 *
 * ================================================= A FORMA: silhueta fofa
 *
 * Cada roupa é a SILHUETA da peça (`Shape`: o ombro que cai, a manga, a saia
 * que abre, as duas pernas da calça) extrudada com bisel largo e as normais
 * alisadas — fica um pano estofado, de quina macia, que é a cara do jogo. A
 * versão antiga era uma pilha de caixas que afinam, e de perto lia como
 * tábua.
 *
 * O DETALHE (gola e punho da camisa, a renda da barra do vestido, o cós da
 * calça) é uma segunda silhueta, um fio mais GROSSA que o corpo: ela atravessa
 * o pano e aparece dos dois lados, sem face nenhuma no mesmo plano da roupa.
 *
 * ============================================= O PESO: uma malha por tipo
 *
 * Doze camisas são UM `InstancedMesh` (cor por cópia), e os doze cabides,
 * outro. Uma arara inteira sai em quatro ou cinco desenhos por quadro — a
 * antiga, de peça em peça, passava de cem.
 *
 * O EIXO: toda roupa nasce com o GANCHO do cabide na origem, a largura em X,
 * pendurada para −Y, e a espessura em Z. É o cabide visto de frente, com a
 * barra da arara entrando na tela (em Z). Pendurada de lado numa arara, ela
 * gira 90°; de frente (a arara premium), não gira.
 */

export type TipoNaArara =
  | 'camisa' | 'regata' | 'vestido' | 'calca'
  | 'gorro' | 'bota' | 'luvas' | 'pulseira' | 'presilha' | 'adesivo'
  // a coleção nova (`world/roupasDaBoutique.ts`)
  | 'blusaLonga' | 'casaco' | 'vestidoLongo' | 'saia' | 'jardineira' | 'luvasLongas'
  | 'sapatilha' | 'botaAlta'
  | 'colar' | 'tiara' | 'relogio'
  | 'chapeu' | 'fedora' | 'bolsa' | 'bolsaTransversal' | 'lenco';

/**
 * As peças da coleção nova têm silhueta própria na arara, e o slot não basta
 * para dizer qual (uma saia e uma calça moram na mesma vaga): vão por id.
 */
const TIPO_POR_ID: Readonly<Record<string, TipoNaArara>> = {
  'blusa-ciganinha': 'camisa',
  'camisa-de-seda': 'blusaLonga',
  'sueter-de-trancas': 'blusaLonga',
  'casaco-trench': 'casaco',
  'vestido-de-baile': 'vestidoLongo',
  'vestido-de-cetim': 'vestidoLongo',
  'saia-plissada': 'saia',
  'saia-de-tule': 'saia',
  'jardineira-jeans': 'jardineira',
  'luvas-longas': 'luvasLongas',
  'sapatilha-rosa': 'sapatilha',
  'sapatilha-preta': 'sapatilha',
  'bota-de-montaria': 'botaAlta',
  'colar-de-perolas': 'colar',
  'tiara-de-perolas': 'tiara',
  'relogio-dourado': 'relogio',
  'chapeu-de-palha': 'chapeu',
  'chapeu-fedora': 'fedora',
  'bolsa-de-mao': 'bolsa',
  'bolsa-transversal': 'bolsaTransversal',
  'lenco-de-seda': 'lenco',
};

/** como a ficha do catálogo aparece na arara */
export function tipoNaArara(item: ItemDef): TipoNaArara {
  const proprio = TIPO_POR_ID[item.id];
  if (proprio) return proprio;
  switch (item.slot) {
    case 'tronco':
      if (item.pernasNuas) return 'vestido';
      return item.bracosNus ? 'regata' : 'camisa';
    case 'pernas':
      return 'calca';
    case 'cabeca':
      return 'gorro';
    case 'pes':
      return 'bota';
    case 'maos':
      return item.id.includes('luva') ? 'luvas' : 'pulseira';
    default:
      return item.id.includes('estrela') ? 'presilha' : 'adesivo';
  }
}

/** os calçados: moram na prateleira de baixo */
export const CALCADOS: ReadonlySet<TipoNaArara> = new Set(['bota', 'sapatilha', 'botaAlta']);

/** a cor do detalhe: a da ficha, ou um degrau mais escuro da própria peça */
export function detalheDa(item: ItemDef): number {
  return item.corDetalhe ?? new THREE.Color(item.cor ?? 0xffffff).multiplyScalar(0.8).getHex();
}

/** as peças que PENDURAM (as outras sentam numa prateleira) */
export const PENDURA: ReadonlySet<TipoNaArara> = new Set([
  'camisa', 'regata', 'vestido', 'calca', 'luvas',
  'blusaLonga', 'casaco', 'vestidoLongo', 'saia', 'jardineira', 'luvasLongas',
]);

// =========================================================== as silhuetas

/**
 * Extruda a silhueta com bisel largo e ALISA as normais: o pano fica
 * estofado. O UV sai antes de juntar os vértices (roupa não tem textura), e
 * é ele que impediria a junção — cada face teria o seu.
 */
function estofar(forma: THREE.Shape, esp: number, bisel: number): THREE.BufferGeometry {
  return estofarVarias([forma], esp, bisel);
}

/** cada silhueta é montada uma vez por sessão e servida a todas as araras */
const prontas = new Map<string, THREE.BufferGeometry>();
function uma(chave: string, fazer: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = prontas.get(chave);
  if (!g) {
    g = fazer();
    prontas.set(chave, g);
  }
  return g;
}

/**
 * A CAMISA: gola redonda, ombro que cai, manga curta para fora e barra
 * arredondada. 46 cm de ombro a ombro, 64 de comprimento.
 */
function formaDaCamisa(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.075, -0.035);
  s.lineTo(-0.2, -0.075);
  s.lineTo(-0.285, -0.165);
  s.lineTo(-0.3, -0.28);
  s.lineTo(-0.215, -0.315);
  s.lineTo(-0.19, -0.23);
  s.lineTo(-0.2, -0.62);
  s.quadraticCurveTo(-0.1, -0.665, 0, -0.655);
  s.quadraticCurveTo(0.1, -0.665, 0.2, -0.62);
  s.lineTo(0.19, -0.23);
  s.lineTo(0.215, -0.315);
  s.lineTo(0.3, -0.28);
  s.lineTo(0.285, -0.165);
  s.lineTo(0.2, -0.075);
  s.lineTo(0.075, -0.035);
  s.quadraticCurveTo(0, -0.1, -0.075, -0.035);
  return s;
}

/** a gola em duas abas, os dois punhos e a carcela de botões */
function detalheDaCamisa(): THREE.Shape[] {
  const formas: THREE.Shape[] = [];
  for (const l of [-1, 1] as const) {
    const aba = new THREE.Shape();
    aba.moveTo(l * 0.078, -0.03);
    aba.lineTo(l * 0.012, -0.115);
    aba.lineTo(l * 0.1, -0.085);
    aba.closePath();
    formas.push(aba);
    const punho = new THREE.Shape();
    punho.moveTo(l * 0.302, -0.282);
    punho.lineTo(l * 0.213, -0.318);
    punho.lineTo(l * 0.205, -0.285);
    punho.lineTo(l * 0.293, -0.248);
    punho.closePath();
    formas.push(punho);
  }
  const carcela = new THREE.Shape();
  carcela.moveTo(-0.011, -0.11);
  carcela.lineTo(0.011, -0.11);
  carcela.lineTo(0.011, -0.64);
  carcela.lineTo(-0.011, -0.64);
  carcela.closePath();
  formas.push(carcela);
  return formas;
}

/** a regata: alça fina, cava funda, sem manga */
function formaDaRegata(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.11, -0.04);
  s.lineTo(-0.065, -0.04);
  s.quadraticCurveTo(0, -0.17, 0.065, -0.04);
  s.lineTo(0.11, -0.04);
  s.quadraticCurveTo(0.12, -0.19, 0.19, -0.23);
  s.lineTo(0.2, -0.58);
  s.quadraticCurveTo(0, -0.615, -0.2, -0.58);
  s.lineTo(-0.19, -0.23);
  s.quadraticCurveTo(-0.12, -0.19, -0.11, -0.04);
  return s;
}

/** a barra da regata, um friso no fim do pano */
function detalheDaRegata(): THREE.Shape[] {
  const b = new THREE.Shape();
  b.moveTo(-0.2, -0.58);
  b.quadraticCurveTo(0, -0.615, 0.2, -0.58);
  b.lineTo(0.2, -0.545);
  b.quadraticCurveTo(0, -0.58, -0.2, -0.545);
  b.closePath();
  return [b];
}

/** um ponto da barra do vestido (bezier de três pontos) */
function barraDoVestido(t: number): THREE.Vector2 {
  const a = new THREE.Vector2(-0.3, -0.92);
  const c = new THREE.Vector2(0, -0.985);
  const b = new THREE.Vector2(0.3, -0.92);
  const u = 1 - t;
  return new THREE.Vector2(
    u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  );
}

/**
 * O VESTIDO: alça fina, decote coração, corpete justo, cintura marcada e a
 * saia que ABRE — é a abertura (26 cm na cintura, 60 na barra) que separa
 * vestido de camisa comprida de longe.
 */
function formaDoVestido(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.1, -0.04);
  s.lineTo(-0.075, -0.04);
  s.quadraticCurveTo(-0.04, -0.13, 0, -0.12);
  s.quadraticCurveTo(0.04, -0.13, 0.075, -0.04);
  s.lineTo(0.1, -0.04);
  s.lineTo(0.16, -0.2);
  s.lineTo(0.13, -0.35);
  s.quadraticCurveTo(0.2, -0.6, 0.3, -0.92);
  s.quadraticCurveTo(0, -0.985, -0.3, -0.92);
  s.quadraticCurveTo(-0.2, -0.6, -0.13, -0.35);
  s.lineTo(-0.16, -0.2);
  s.closePath();
  return s;
}

/** a faixa da cintura e a renda recortada da barra */
function detalheDoVestido(): THREE.Shape[] {
  const faixa = new THREE.Shape();
  faixa.moveTo(-0.142, -0.325);
  faixa.lineTo(0.142, -0.325);
  faixa.lineTo(0.135, -0.375);
  faixa.lineTo(-0.135, -0.375);
  faixa.closePath();
  // a renda: o topo segue a barra 6 cm acima, e o fundo é recortado em
  // meias-luas, uma por trecho
  const renda = new THREE.Shape();
  const N = 10;
  const topo = (t: number): THREE.Vector2 => barraDoVestido(t).add(new THREE.Vector2(0, 0.06));
  renda.moveTo(topo(0).x, topo(0).y);
  for (let i = 1; i <= N; i++) renda.lineTo(topo(i / N).x, topo(i / N).y);
  const fim = barraDoVestido(1);
  renda.lineTo(fim.x, fim.y);
  for (let i = N - 1; i >= 0; i--) {
    const a = barraDoVestido((i + 1) / N);
    const b = barraDoVestido(i / N);
    renda.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 0.028, b.x, b.y);
  }
  renda.closePath();
  return [faixa, renda];
}

/**
 * A CALÇA, pendurada pelo cós num cabide de presilha: cós reto, duas pernas
 * que afinam um tico e o gancho no meio.
 */
function formaDaCalca(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.17, -0.06);
  s.lineTo(0.17, -0.06);
  s.lineTo(0.19, -0.3);
  s.lineTo(0.175, -1.0);
  s.lineTo(0.03, -1.0);
  s.lineTo(0, -0.36);
  s.lineTo(-0.03, -1.0);
  s.lineTo(-0.175, -1.0);
  s.lineTo(-0.19, -0.3);
  s.closePath();
  return s;
}

/** o cós */
function detalheDaCalca(): THREE.Shape[] {
  const c = new THREE.Shape();
  c.moveTo(-0.172, -0.058);
  c.lineTo(0.172, -0.058);
  c.lineTo(0.176, -0.11);
  c.lineTo(-0.176, -0.11);
  c.closePath();
  return [c];
}

/** a luva de jardim: palma, polegar aberto e o punho largo */
function formaDaLuva(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.045, -0.02);
  s.lineTo(0.045, -0.02);
  s.lineTo(0.05, -0.1);
  s.quadraticCurveTo(0.09, -0.11, 0.085, -0.15);
  s.lineTo(0.05, -0.16);
  s.quadraticCurveTo(0.055, -0.24, 0, -0.245);
  s.quadraticCurveTo(-0.055, -0.24, -0.05, -0.15);
  s.closePath();
  return s;
}
function detalheDaLuva(): THREE.Shape[] {
  const p = new THREE.Shape();
  p.moveTo(-0.05, -0.018);
  p.lineTo(0.05, -0.018);
  p.lineTo(0.05, -0.07);
  p.lineTo(-0.05, -0.07);
  p.closePath();
  return [p];
}

/**
 * O VESTIDO LONGO (o de baile, o de cetim): o mesmo corpete do vestido, e a
 * saia descendo até 1,32 m, bem mais aberta embaixo.
 */
function barraDoLongo(t: number): THREE.Vector2 {
  const a = new THREE.Vector2(-0.37, -1.28);
  const c = new THREE.Vector2(0, -1.34);
  const b = new THREE.Vector2(0.37, -1.28);
  const u = 1 - t;
  return new THREE.Vector2(u * u * a.x + 2 * u * t * c.x + t * t * b.x, u * u * a.y + 2 * u * t * c.y + t * t * b.y);
}
function formaDoVestidoLongo(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.1, -0.04);
  s.lineTo(-0.075, -0.04);
  s.quadraticCurveTo(-0.04, -0.13, 0, -0.12);
  s.quadraticCurveTo(0.04, -0.13, 0.075, -0.04);
  s.lineTo(0.1, -0.04);
  s.lineTo(0.16, -0.2);
  s.lineTo(0.13, -0.35);
  s.quadraticCurveTo(0.24, -0.8, 0.37, -1.28);
  s.quadraticCurveTo(0, -1.34, -0.37, -1.28);
  s.quadraticCurveTo(-0.24, -0.8, -0.13, -0.35);
  s.lineTo(-0.16, -0.2);
  s.closePath();
  return s;
}
function detalheDoVestidoLongo(): THREE.Shape[] {
  const faixa = new THREE.Shape();
  faixa.moveTo(-0.142, -0.325);
  faixa.lineTo(0.142, -0.325);
  faixa.lineTo(0.135, -0.375);
  faixa.lineTo(-0.135, -0.375);
  faixa.closePath();
  const barra = new THREE.Shape();
  const N = 12;
  const topo = (t: number): THREE.Vector2 => barraDoLongo(t).add(new THREE.Vector2(0, 0.07));
  barra.moveTo(topo(0).x, topo(0).y);
  for (let i = 1; i <= N; i++) barra.lineTo(topo(i / N).x, topo(i / N).y);
  barra.lineTo(barraDoLongo(1).x, barraDoLongo(1).y);
  for (let i = N - 1; i >= 0; i--) {
    const a = barraDoLongo((i + 1) / N);
    const b = barraDoLongo(i / N);
    barra.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - 0.03, b.x, b.y);
  }
  barra.closePath();
  return [faixa, barra];
}

/** a SAIA, pendurada pelo cós num cabide de presilha: o cós reto e a saia abrindo */
function formaDaSaia(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.16, -0.05);
  s.lineTo(0.16, -0.05);
  s.quadraticCurveTo(0.22, -0.3, 0.29, -0.62);
  s.quadraticCurveTo(0, -0.67, -0.29, -0.62);
  s.quadraticCurveTo(-0.22, -0.3, -0.16, -0.05);
  return s;
}
function detalheDaSaia(): THREE.Shape[] {
  const c = new THREE.Shape();
  c.moveTo(-0.162, -0.048);
  c.lineTo(0.162, -0.048);
  c.lineTo(0.168, -0.1);
  c.lineTo(-0.168, -0.1);
  c.closePath();
  return [c];
}

/** a BLUSA DE MANGA COMPRIDA (a de seda, o suéter): o corpo da camisa e as mangas caindo rentes */
function formaDaBlusaLonga(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.075, -0.035);
  s.lineTo(-0.2, -0.075);
  s.lineTo(-0.27, -0.16);
  s.lineTo(-0.29, -0.6);
  s.lineTo(-0.225, -0.615);
  s.lineTo(-0.205, -0.25);
  s.lineTo(-0.2, -0.62);
  s.quadraticCurveTo(-0.1, -0.665, 0, -0.655);
  s.quadraticCurveTo(0.1, -0.665, 0.2, -0.62);
  s.lineTo(0.205, -0.25);
  s.lineTo(0.225, -0.615);
  s.lineTo(0.29, -0.6);
  s.lineTo(0.27, -0.16);
  s.lineTo(0.2, -0.075);
  s.lineTo(0.075, -0.035);
  s.quadraticCurveTo(0, -0.1, -0.075, -0.035);
  return s;
}
/** a gola e os dois punhos */
function detalheDaBlusaLonga(): THREE.Shape[] {
  const formas: THREE.Shape[] = [];
  const gola = new THREE.Shape();
  gola.moveTo(-0.078, -0.03);
  gola.quadraticCurveTo(0, -0.1, 0.078, -0.03);
  gola.lineTo(0.06, -0.06);
  gola.quadraticCurveTo(0, -0.125, -0.06, -0.06);
  gola.closePath();
  formas.push(gola);
  for (const l of [-1, 1] as const) {
    const punho = new THREE.Shape();
    punho.moveTo(l * 0.291, -0.6);
    punho.lineTo(l * 0.224, -0.616);
    punho.lineTo(l * 0.222, -0.57);
    punho.lineTo(l * 0.287, -0.556);
    punho.closePath();
    formas.push(punho);
  }
  return formas;
}

/** o CASACO comprido: ombro, manga até o punho, e o corpo descendo até o joelho */
function formaDoCasaco(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.08, -0.035);
  s.lineTo(-0.21, -0.075);
  s.lineTo(-0.285, -0.17);
  s.lineTo(-0.31, -0.62);
  s.lineTo(-0.24, -0.635);
  s.lineTo(-0.215, -0.26);
  s.lineTo(-0.235, -0.98);
  s.quadraticCurveTo(0, -1.0, 0.235, -0.98);
  s.lineTo(0.215, -0.26);
  s.lineTo(0.24, -0.635);
  s.lineTo(0.31, -0.62);
  s.lineTo(0.285, -0.17);
  s.lineTo(0.21, -0.075);
  s.lineTo(0.08, -0.035);
  s.lineTo(0, -0.2);
  s.closePath();
  return s;
}
/** as lapelas, o cinto e os punhos */
function detalheDoCasaco(): THREE.Shape[] {
  const formas: THREE.Shape[] = [];
  for (const l of [-1, 1] as const) {
    const lapela = new THREE.Shape();
    lapela.moveTo(l * 0.082, -0.03);
    lapela.lineTo(l * 0.15, -0.09);
    lapela.lineTo(l * 0.12, -0.13);
    lapela.lineTo(l * 0.04, -0.3);
    lapela.lineTo(l * 0.012, -0.22);
    lapela.closePath();
    formas.push(lapela);
    const punho = new THREE.Shape();
    punho.moveTo(l * 0.311, -0.62);
    punho.lineTo(l * 0.239, -0.637);
    punho.lineTo(l * 0.236, -0.6);
    punho.lineTo(l * 0.306, -0.584);
    punho.closePath();
    formas.push(punho);
  }
  const cinto = new THREE.Shape();
  cinto.moveTo(-0.222, -0.4);
  cinto.lineTo(0.222, -0.4);
  cinto.lineTo(0.224, -0.445);
  cinto.lineTo(-0.224, -0.445);
  cinto.closePath();
  formas.push(cinto);
  return formas;
}

/** a JARDINEIRA: as alças, o peitilho e as duas pernas */
function formaDaJardineira(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.13, -0.05);
  s.lineTo(-0.1, -0.05);
  s.lineTo(-0.085, -0.13);
  s.lineTo(0.085, -0.13);
  s.lineTo(0.1, -0.05);
  s.lineTo(0.13, -0.05);
  s.lineTo(0.1, -0.13);
  s.lineTo(0.11, -0.3);
  s.lineTo(0.18, -0.32);
  s.lineTo(0.175, -1.0);
  s.lineTo(0.03, -1.0);
  s.lineTo(0, -0.5);
  s.lineTo(-0.03, -1.0);
  s.lineTo(-0.175, -1.0);
  s.lineTo(-0.18, -0.32);
  s.lineTo(-0.11, -0.3);
  s.lineTo(-0.1, -0.13);
  s.closePath();
  return s;
}
/** o bolso do peitilho, o cós e as barras dobradas */
function detalheDaJardineira(): THREE.Shape[] {
  const bolso = new THREE.Shape();
  bolso.moveTo(-0.05, -0.16);
  bolso.lineTo(0.05, -0.16);
  bolso.lineTo(0.045, -0.24);
  bolso.lineTo(-0.045, -0.24);
  bolso.closePath();
  const cos = new THREE.Shape();
  cos.moveTo(-0.181, -0.3);
  cos.lineTo(0.181, -0.3);
  cos.lineTo(0.182, -0.34);
  cos.lineTo(-0.182, -0.34);
  cos.closePath();
  const formas = [bolso, cos];
  for (const l of [-1, 1] as const) {
    const barra = new THREE.Shape();
    barra.moveTo(l * 0.176, -0.94);
    barra.lineTo(l * 0.028, -0.94);
    barra.lineTo(l * 0.03, -1.0);
    barra.lineTo(l * 0.176, -1.0);
    barra.closePath();
    formas.push(barra);
  }
  return formas;
}

/** a LUVA LONGA de ópera: a mão e o cano comprido */
function formaDaLuvaLonga(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.04, -0.02);
  s.lineTo(0.04, -0.02);
  s.lineTo(0.034, -0.3);
  s.quadraticCurveTo(0.075, -0.31, 0.07, -0.35);
  s.lineTo(0.04, -0.36);
  s.quadraticCurveTo(0.045, -0.44, 0, -0.445);
  s.quadraticCurveTo(-0.045, -0.44, -0.04, -0.35);
  s.lineTo(-0.036, -0.3);
  s.closePath();
  return s;
}
function detalheDaLuvaLonga(): THREE.Shape[] {
  const p = new THREE.Shape();
  p.moveTo(-0.04, -0.018);
  p.lineTo(0.04, -0.018);
  p.lineTo(0.04, -0.05);
  p.lineTo(-0.04, -0.05);
  p.closePath();
  return [p];
}

/** as geometrias de corpo e de detalhe de cada tipo que pendura */
function geoDoCorpo(tipo: TipoNaArara): THREE.BufferGeometry {
  return uma(`corpo:${tipo}`, () => {
    switch (tipo) {
      case 'camisa': return estofar(formaDaCamisa(), 0.03, 0.016);
      case 'regata': return estofar(formaDaRegata(), 0.026, 0.014);
      case 'vestido': return estofar(formaDoVestido(), 0.026, 0.016);
      case 'calca': return estofar(formaDaCalca(), 0.03, 0.016);
      case 'luvas': return estofar(formaDaLuva(), 0.016, 0.01);
      case 'vestidoLongo': return estofar(formaDoVestidoLongo(), 0.03, 0.018);
      case 'saia': return estofar(formaDaSaia(), 0.026, 0.016);
      case 'blusaLonga': return estofar(formaDaBlusaLonga(), 0.032, 0.016);
      case 'casaco': return estofar(formaDoCasaco(), 0.036, 0.018);
      case 'jardineira': return estofar(formaDaJardineira(), 0.03, 0.016);
      case 'luvasLongas': return estofar(formaDaLuvaLonga(), 0.016, 0.01);
      default: throw new Error(`${tipo} nao pendura`);
    }
  });
}
function geoDoDetalhe(tipo: TipoNaArara): THREE.BufferGeometry {
  return uma(`detalhe:${tipo}`, () => {
    // um fio mais grosso que o corpo (espessura + bisel): atravessa o pano
    switch (tipo) {
      case 'camisa': return estofarVarias(detalheDaCamisa(), 0.058, 0.008);
      case 'regata': return estofarVarias(detalheDaRegata(), 0.05, 0.007);
      case 'vestido': return estofarVarias(detalheDoVestido(), 0.054, 0.008);
      case 'calca': return estofarVarias(detalheDaCalca(), 0.058, 0.008);
      case 'luvas': return estofarVarias(detalheDaLuva(), 0.04, 0.006);
      case 'vestidoLongo': return estofarVarias(detalheDoVestidoLongo(), 0.06, 0.008);
      case 'saia': return estofarVarias(detalheDaSaia(), 0.05, 0.008);
      case 'blusaLonga': return estofarVarias(detalheDaBlusaLonga(), 0.06, 0.008);
      case 'casaco': return estofarVarias(detalheDoCasaco(), 0.066, 0.008);
      case 'jardineira': return estofarVarias(detalheDaJardineira(), 0.058, 0.008);
      case 'luvasLongas': return estofarVarias(detalheDaLuvaLonga(), 0.04, 0.006);
      default: throw new Error(`${tipo} nao pendura`);
    }
  });
}

/** o mesmo `estofar`, com várias formas numa geometria só (elas não se tocam) */
function estofarVarias(formas: THREE.Shape[], esp: number, bisel: number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(formas, {
    depth: esp, bevelEnabled: true, bevelThickness: bisel, bevelSize: bisel * 0.85,
    bevelSegments: 2, curveSegments: 4,
  });
  geo.translate(0, 0, -esp / 2);
  geo.deleteAttribute('uv');
  geo.deleteAttribute('normal');
  const lisa = mergeVertices(geo, 1e-4);
  lisa.computeVertexNormals();
  geo.dispose();
  return lisa;
}

// ================================================================ cabides

/**
 * O CABIDE DE MADEIRA: a barra dos ombros curvada (um tubo num arco raso) e,
 * por cima, o gancho de latão — um arame que sobe do meio da barra e dá a
 * volta por cima da barra da arara.
 *
 * O GANCHO É GIRATÓRIO, como o de cabide de loja: ele sempre abraça a barra
 * (que corre em X), e quem gira é a peça. Na arara comum a peça fica de lado
 * e o gancho no plano dela; na premium a peça fica de frente, e o gancho dá
 * um quarto de volta em relação a ela.
 */
function geoDaBarraDoCabide(): THREE.BufferGeometry {
  return uma('cabide:barra', () => {
    const curva = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.215, -0.085, 0),
      new THREE.Vector3(0, -0.035, 0),
      new THREE.Vector3(0.215, -0.085, 0),
    );
    const geo = new THREE.TubeGeometry(curva, 10, 0.013, 5, false);
    // as duas pontas fechadas com uma bolinha: tubo aberto mostra o oco
    const pontas = [-1, 1].map((l) => {
      const b = new THREE.SphereGeometry(0.013, 5, 4);
      b.translate(l * 0.215, -0.085, 0);
      return b;
    });
    return juntar([geo, ...pontas]);
  });
}

function geoDoGancho(): THREE.BufferGeometry {
  return uma('cabide:gancho', () => {
    // o arame no plano XY, dando a volta num eixo Z que passa pela origem
    const pts = [
      [0, -0.05], [-0.004, -0.03], [-0.024, -0.008], [-0.026, 0.012],
      [-0.012, 0.027], [0.01, 0.027], [0.024, 0.012], [0.022, -0.006],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.0045, 4, false);
  });
}

/** junta geometrias soltas (todas com posição e normal; o resto sai) */
function juntar(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const limpas = geos.map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    for (const nome of Object.keys(n.attributes)) if (nome !== 'position' && nome !== 'normal') n.deleteAttribute(nome);
    return n;
  });
  const pos: number[] = [];
  const nor: number[] = [];
  for (const g of limpas) {
    pos.push(...(g.getAttribute('position').array as Float32Array));
    nor.push(...(g.getAttribute('normal').array as Float32Array));
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}

// ======================================================= o que senta

/**
 * O GORRO: cúpula de tricô (a canelura é o raio ondulando em volta, 18
 * gomos), o pompom, e a barra dobrada embaixo na cor do detalhe. Base em y=0.
 */
function geoDoGorro(): THREE.BufferGeometry {
  return uma('gorro:corpo', () => {
    const perfil = [
      [0.001, 0.19], [0.05, 0.185], [0.095, 0.16], [0.125, 0.115], [0.135, 0.07], [0.132, 0.035],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(perfil, 36);
    canelar(geo, 18, 0.008);
    const pompom = new THREE.IcosahedronGeometry(0.045, 1);
    pompom.translate(0, 0.215, 0);
    return juntar([geo, pompom]);
  });
}
function geoDaBarraDoGorro(): THREE.BufferGeometry {
  return uma('gorro:barra', () => {
    const perfil = [
      [0.128, 0.0], [0.142, 0.004], [0.146, 0.025], [0.142, 0.048], [0.128, 0.052],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const geo = new THREE.LatheGeometry(perfil, 36);
    canelar(geo, 18, 0.006);
    return geo;
  });
}

/** canelura de tricô: o raio de cada vértice ondula com o ângulo */
function canelar(geo: THREE.BufferGeometry, gomos: number, fundo: number): void {
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    if (r < 1e-4) continue;
    const a = Math.atan2(z, x);
    const k = (r - fundo * (0.5 - 0.5 * Math.cos(a * gomos))) / r;
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  geo.computeVertexNormals();
}

/**
 * A BOTA (uma só; o par é montado na prateleira): o pé de bico redondo, o
 * cano e a sola. A ponta olha para +Z, base em y=0.
 */
export function geoDaBota(): THREE.BufferGeometry {
  return uma('bota:corpo', () => {
    const pe = new THREE.SphereGeometry(1, 14, 10);
    pe.scale(0.058, 0.055, 0.13);
    pe.translate(0, 0.05, 0.035);
    const cano = new THREE.CylinderGeometry(0.056, 0.06, 0.2, 14);
    cano.translate(0, 0.15, -0.035);
    const sola = new THREE.CylinderGeometry(1, 1, 0.022, 14);
    sola.scale(0.062, 1, 0.135);
    sola.translate(0, 0.011, 0.03);
    return juntar([pe, cano, sola]);
  });
}
export function geoDoCanoDaBota(): THREE.BufferGeometry {
  return uma('bota:cano', () => {
    const geo = new THREE.TorusGeometry(0.058, 0.017, 6, 16);
    geo.rotateX(Math.PI / 2);
    geo.translate(0, 0.25, -0.035);
    return geo;
  });
}

/** a pulseira de miçangas: um anel de contas com um coraçãozinho */
function geoDaPulseira(): THREE.BufferGeometry {
  return uma('pulseira', () => {
    const contas: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const b = new THREE.IcosahedronGeometry(0.011, 0);
      b.translate(Math.cos(a) * 0.042, Math.sin(a) * 0.042, 0);
      contas.push(b);
    }
    return juntar(contas);
  });
}

/** a cartela (presilha de estrela, adesivo de coração): papelão em pé no suporte */
function geoDaCartela(): THREE.BufferGeometry {
  return uma('cartela', () => {
    const geo = new THREE.BoxGeometry(0.11, 0.15, 0.008);
    geo.translate(0, 0.095, 0);
    return geo;
  });
}
/** o que vai colado na cartela: três estrelas ou três corações */
function geoDoEnfeiteDaCartela(estrela: boolean): THREE.BufferGeometry {
  return uma(`cartela:${estrela}`, () => {
    const s = new THREE.Shape();
    if (estrela) {
      for (let i = 0; i < 10; i++) {
        const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
        const r = i % 2 === 0 ? 0.024 : 0.011;
        if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      s.closePath();
    } else {
      s.moveTo(0, -0.02);
      s.bezierCurveTo(-0.03, 0.0, -0.022, 0.025, 0, 0.012);
      s.bezierCurveTo(0.022, 0.025, 0.03, 0.0, 0, -0.02);
    }
    const geos: THREE.BufferGeometry[] = [];
    for (const [x, y] of [[0, 0.135], [-0.024, 0.085], [0.024, 0.05]] as const) {
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.006, bevelEnabled: false, curveSegments: 4 });
      // nasce na face da cartela que olha para +Z, e um gêmeo na de trás
      g.translate(x, y, 0.004);
      geos.push(g);
      const costas = g.clone();
      costas.rotateY(Math.PI);
      geos.push(costas);
    }
    return juntar(geos);
  });
}


// ============================================ o que senta: a coleção nova

/** a SAPATILHA (uma; o par é montado na prateleira): a parede baixa, o bico fechado e a sola */
function geoDaSapatilha(): THREE.BufferGeometry {
  return uma('sapatilha:corpo', () => {
    const parede = new THREE.CylinderGeometry(1, 1, 1, 22, 1, true);
    parede.scale(0.042, 0.022, 0.1);
    parede.translate(0, 0.019, 0);
    const bico = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI, 0, Math.PI / 2);
    bico.scale(0.042, 0.02, 0.1);
    bico.translate(0, 0.03, 0);
    return juntar([parede, bico]);
  });
}
/** a sola e o lacinho no bico */
function geoDaSolaDaSapatilha(): THREE.BufferGeometry {
  return uma('sapatilha:detalhe', () => {
    const sola = new THREE.CylinderGeometry(1, 1, 1, 22);
    sola.scale(0.045, 0.008, 0.103);
    sola.translate(0, 0.004, 0);
    const lacos = [-1, 1].map((l) => {
      const a = new THREE.SphereGeometry(0.009, 8, 6);
      a.scale(1.3, 0.8, 0.6);
      a.translate(l * 0.01, 0.05, 0.055);
      return a;
    });
    return juntar([sola, ...lacos]);
  });
}

/** a BOTA DE MONTARIA: o pé, o cano alto até 0,5 m e a sola */
function geoDaBotaAlta(): THREE.BufferGeometry {
  return uma('botaAlta:corpo', () => {
    const pe = new THREE.SphereGeometry(1, 14, 10);
    pe.scale(0.056, 0.05, 0.13);
    pe.translate(0, 0.05, 0.035);
    const cano = new THREE.CylinderGeometry(0.06, 0.054, 0.42, 16);
    cano.translate(0, 0.29, -0.03);
    return juntar([pe, cano]);
  });
}
/** a sola, o salto e a beirada de cima */
function geoDoDetalheDaBotaAlta(): THREE.BufferGeometry {
  return uma('botaAlta:detalhe', () => {
    const sola = new THREE.CylinderGeometry(1, 1, 0.02, 14);
    sola.scale(0.062, 1, 0.14);
    sola.translate(0, 0.01, 0.03);
    const beirada = new THREE.TorusGeometry(0.06, 0.009, 6, 18);
    beirada.rotateX(Math.PI / 2);
    beirada.translate(0, 0.5, -0.03);
    return juntar([sola, beirada]);
  });
}

/** o COLAR de pérolas deitado na bandeja: duas voltas em U */
function geoDoColar(): THREE.BufferGeometry {
  return uma('colar:perolas', () => {
    const contas: THREE.BufferGeometry[] = [];
    for (const [rx, rz, n] of [[0.075, 0.1, 22], [0.095, 0.13, 26]] as const) {
      for (let i = 0; i <= n; i++) {
        const a = Math.PI * 0.08 + (i / n) * Math.PI * 0.84;
        const b = new THREE.SphereGeometry(0.0085, 8, 6);
        b.translate(Math.cos(a) * rx, 0.009, -Math.sin(a) * rz + rz * 0.5);
        contas.push(b);
      }
    }
    return juntar(contas);
  });
}
function geoDoFechoDoColar(): THREE.BufferGeometry {
  return uma('colar:fecho', () => {
    const f = new THREE.SphereGeometry(0.011, 8, 6);
    f.translate(0, 0.01, 0.06);
    return f;
  });
}

/** a TIARA em pé na bandeja: o arco da faixa */
function geoDaTiara(): THREE.BufferGeometry {
  return uma('tiara:faixa', () => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = Math.PI * 0.12 + (i / 16) * Math.PI * 0.76;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.075, Math.sin(a) * 0.09, 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.007, 6, false);
  });
}
/** as pérolas em cima da faixa */
function geoDasPerolasDaTiara(): THREE.BufferGeometry {
  return uma('tiara:perolas', () => {
    const contas: THREE.BufferGeometry[] = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * 0.16 + (i / 12) * Math.PI * 0.68;
      const r = 0.008 + 0.004 * Math.sin(a);
      const b = new THREE.SphereGeometry(r, 8, 6);
      b.translate(Math.cos(a) * 0.085, Math.sin(a) * 0.1, 0);
      contas.push(b);
    }
    return juntar(contas);
  });
}

/** o RELÓGIO em pé na almofadinha: a pulseira em anel e a caixa */
function geoDoRelogio(): THREE.BufferGeometry {
  return uma('relogio:corpo', () => {
    const pulseira = new THREE.TorusGeometry(0.032, 0.007, 6, 22);
    pulseira.translate(0, 0.04, 0);
    const caixa = new THREE.CylinderGeometry(0.019, 0.019, 0.01, 20);
    caixa.rotateX(Math.PI / 2);
    caixa.translate(0, 0.072, 0.004);
    return juntar([pulseira, caixa]);
  });
}
function geoDoMostradorNaVitrine(): THREE.BufferGeometry {
  return uma('relogio:mostrador', () => {
    const m = new THREE.CylinderGeometry(0.0155, 0.0155, 0.004, 20);
    m.rotateX(Math.PI / 2);
    m.translate(0, 0.072, 0.009);
    return m;
  });
}

/** o CHAPÉU DE PALHA: a copa e a aba larga caindo na beira (base em y = 0) */
function geoDoChapeu(): THREE.BufferGeometry {
  return uma('chapeu:corpo', () => {
    const copa = new THREE.LatheGeometry([[0.001, 0.105], [0.06, 0.1], [0.085, 0.085], [0.09, 0.03], [0.092, 0.012]].map(([r, y]) => new THREE.Vector2(r, y)).reverse(), 28);
    const aba = new THREE.LatheGeometry([[0.2, -0.012], [0.16, 0.0], [0.12, 0.01], [0.09, 0.014]].map(([r, y]) => new THREE.Vector2(r, y)), 36);
    return juntar([copa, aba]);
  });
}
function geoDaFitaDoChapeu(): THREE.BufferGeometry {
  return uma('chapeu:fita', () => {
    const fita = new THREE.CylinderGeometry(0.093, 0.094, 0.026, 28, 1, true);
    fita.translate(0, 0.03, 0);
    const laco = new THREE.SphereGeometry(0.016, 8, 6);
    laco.scale(1, 0.7, 0.6);
    laco.translate(-0.094, 0.032, 0.02);
    return juntar([fita, laco]);
  });
}

/** o FEDORA: a copa alta com o vinco e a aba curta */
function geoDoFedora(): THREE.BufferGeometry {
  return uma('fedora:corpo', () => {
    const copa = new THREE.LatheGeometry([[0.001, 0.1], [0.04, 0.115], [0.072, 0.105], [0.082, 0.06], [0.085, 0.012]].map(([r, y]) => new THREE.Vector2(r, y)).reverse(), 28);
    const aba = new THREE.LatheGeometry([[0.15, 0.02], [0.12, 0.004], [0.085, 0.012]].map(([r, y]) => new THREE.Vector2(r, y)), 32);
    return juntar([copa, aba]);
  });
}
function geoDaFitaDoFedora(): THREE.BufferGeometry {
  return uma('fedora:fita', () => {
    const fita = new THREE.CylinderGeometry(0.086, 0.087, 0.02, 28, 1, true);
    fita.translate(0, 0.024, 0);
    return fita;
  });
}

/** a BOLSA DE MÃO em pé: o corpo em trapézio, a aba e a alça em arco */
function geoDaBolsa(): THREE.BufferGeometry {
  return uma('bolsa:corpo', () => {
    const f = new THREE.Shape();
    f.moveTo(-0.085, 0);
    f.lineTo(0.085, 0);
    f.lineTo(0.07, 0.11);
    f.lineTo(-0.07, 0.11);
    f.closePath();
    const corpo = new THREE.ExtrudeGeometry(f, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 2, curveSegments: 4 });
    corpo.translate(0, 0.012, -0.02);
    const alca = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.05, 0.12, 0), new THREE.Vector3(-0.035, 0.17, 0), new THREE.Vector3(0, 0.185, 0),
      new THREE.Vector3(0.035, 0.17, 0), new THREE.Vector3(0.05, 0.12, 0),
    ]), 16, 0.006, 5, false);
    return juntar([corpo, alca]);
  });
}
function geoDoFechoDaBolsa(): THREE.BufferGeometry {
  return uma('bolsa:fecho', () => {
    const fecho = new THREE.BoxGeometry(0.026, 0.016, 0.008);
    fecho.translate(0, 0.08, 0.036);
    return fecho;
  });
}

/** a BOLSA TRANSVERSAL deitada de pé: o corpo retangular de quina macia e a alça enrolada atrás */
function geoDaBolsaTransversal(): THREE.BufferGeometry {
  return uma('transversal:corpo', () => {
    const f = new THREE.Shape();
    f.moveTo(-0.07, 0);
    f.lineTo(0.07, 0);
    f.lineTo(0.07, 0.1);
    f.lineTo(-0.07, 0.1);
    f.closePath();
    const corpo = new THREE.ExtrudeGeometry(f, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 4 });
    corpo.translate(0, 0.012, -0.015);
    const alca = new THREE.TorusGeometry(0.075, 0.0055, 5, 28);
    alca.rotateX(Math.PI / 2);
    alca.scale(1.1, 1, 0.55);
    alca.translate(0, 0.006, -0.06);
    return juntar([corpo, alca]);
  });
}
function geoDoFechoDaTransversal(): THREE.BufferGeometry {
  return uma('transversal:fecho', () => {
    const anel = new THREE.TorusGeometry(0.011, 0.003, 6, 14);
    anel.translate(0, 0.07, 0.03);
    return anel;
  });
}

/** o LENÇO dobrado em quadrado, com uma ponta caindo pela beira */
function geoDoLenco(): THREE.BufferGeometry {
  return uma('lenco:corpo', () => {
    const dobrado = new THREE.BoxGeometry(0.12, 0.012, 0.12, 1, 1, 1);
    dobrado.translate(0, 0.006, 0);
    const f = new THREE.Shape();
    f.moveTo(-0.04, 0);
    f.lineTo(0.04, 0);
    f.lineTo(0, -0.08);
    f.closePath();
    const ponta = new THREE.ExtrudeGeometry(f, { depth: 0.004, bevelEnabled: false });
    ponta.translate(0.02, 0.006, 0.06);
    return juntar([dobrado, ponta]);
  });
}
function geoDaBarraDoLenco(): THREE.BufferGeometry {
  return uma('lenco:barra', () => {
    const tiras = [
      [0, 0.0125, 0.052, 0.12, 0.004, 0.012],
      [0, 0.0125, -0.052, 0.12, 0.004, 0.012],
      [0.052, 0.0125, 0, 0.012, 0.004, 0.096],
      [-0.052, 0.0125, 0, 0.012, 0.004, 0.096],
    ].map(([x, y, z, lx, ly, lz]) => {
      const b = new THREE.BoxGeometry(lx, ly, lz);
      b.translate(x, y, z);
      return b;
    });
    return juntar(tiras);
  });
}

// ============================================================ a vitrine

/**
 * UMA REMESSA DE CÓPIAS: tudo o que repete numa arara (doze camisas, doze
 * cabides, oito botas) entra aqui e sai como um `InstancedMesh` por
 * geometria, com cor por cópia.
 */
export class Vitrine {
  private readonly lotes = new Map<THREE.BufferGeometry, { m: THREE.Matrix4[]; c: THREE.Color[]; mat: THREE.Material }>();
  /** quantas PEÇAS DO CATÁLOGO estão à mostra (é o que o teste conta) */
  pecas = 0;

  por(geo: THREE.BufferGeometry, matriz: THREE.Matrix4, cor: number, mat?: THREE.Material): void {
    let lote = this.lotes.get(geo);
    if (!lote) {
      lote = { m: [], c: [], mat: mat ?? toon(0xffffff) };
      this.lotes.set(geo, lote);
    }
    lote.m.push(matriz.clone());
    lote.c.push(new THREE.Color(cor));
  }

  montar(pai: THREE.Object3D): void {
    for (const [geo, lote] of this.lotes) {
      const im = new THREE.InstancedMesh(geo, lote.mat, lote.m.length);
      lote.m.forEach((m, i) => {
        im.setMatrixAt(i, m);
        im.setColorAt(i, lote.c[i]);
      });
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere();
      im.computeBoundingBox();
      im.castShadow = true;
      im.receiveShadow = true;
      pai.add(im);
    }
  }
}

const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const UM = new THREE.Vector3(1, 1, 1);
function matriz(x: number, y: number, z: number, giroY = 0, giroX = 0, escala: THREE.Vector3 = UM): THREE.Matrix4 {
  tmpE.set(giroX, giroY, 0, 'YXZ');
  tmpQ.setFromEuler(tmpE);
  return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), tmpQ, escala);
}

/**
 * PENDURA uma peça com o cabide numa barra que corre em X, na altura `y`.
 *
 * `deLado` é como a arara de loja guarda roupa: a peça perpendicular à barra,
 * e o olho vê a fila de ombros. Sem `deLado` ela fica DE FRENTE — é como a
 * arara premium expõe a peça cara, uma de cada vez.
 */
export function pendurar(
  v: Vitrine, item: ItemDef, x: number, y: number, z: number, deLado: boolean, giro = 0,
): void {
  const tipo = tipoNaArara(item);
  const m = matriz(x, y, z, (deLado ? Math.PI / 2 : 0) + giro);
  const corpo = geoDoCorpo(tipo);
  const detalhe = geoDoDetalhe(tipo);
  if (tipo === 'luvas' || tipo === 'luvasLongas') {
    // o par, lado a lado no mesmo cabide
    for (const l of [-1, 1] as const) {
      const luva = m.clone().multiply(new THREE.Matrix4().makeTranslation(l * 0.06, -0.02, l * 0.004));
      v.por(corpo, luva, item.cor ?? 0xffffff);
      v.por(detalhe, luva, detalheDa(item));
    }
  } else {
    v.por(corpo, m, item.cor ?? 0xffffff);
    v.por(detalhe, m, detalheDa(item));
  }
  // a luva pendura num cabide de presilha, curto: o de ombro passaria do par
  const barra = tipo === 'luvas' || tipo === 'luvasLongas' ? m.clone().multiply(new THREE.Matrix4().makeScale(0.6, 1, 1)) : m;
  v.por(geoDaBarraDoCabide(), barra, P.boutiqueCabide);
  v.por(geoDoGancho(), matriz(x, y, z, Math.PI / 2 + giro), P.boutiqueOuro);
  v.pecas++;
}

/**
 * SENTA uma peça numa prateleira (o tampo em `y`): gorro, par de botas,
 * pulseira no suporte, cartela no pezinho. `giro` vira a peça (a bota olha
 * para quem chega).
 */
export function sentar(v: Vitrine, item: ItemDef, x: number, y: number, z: number, giro = 0): void {
  const tipo = tipoNaArara(item);
  const cor = item.cor ?? 0xffffff;
  const det = detalheDa(item);
  switch (tipo) {
    case 'gorro': {
      v.por(geoDoGorro(), matriz(x, y, z, giro), cor);
      v.por(geoDaBarraDoGorro(), matriz(x, y, z, giro), det);
      break;
    }
    case 'bota': {
      for (const l of [-1, 1] as const) {
        const m = matriz(x + l * 0.065, y, z + (l > 0 ? 0.02 : 0), giro + l * 0.08);
        v.por(geoDaBota(), m, cor);
        v.por(geoDoCanoDaBota(), m, det);
      }
      break;
    }
    case 'pulseira': {
      // em pé, enfiada no braço do suporte
      v.por(geoDaPulseira(), matriz(x, y + 0.075, z, giro), cor);
      break;
    }
    case 'presilha':
    case 'adesivo': {
      const m = matriz(x, y, z, giro, -0.12);
      v.por(geoDaCartela(), m, P.metalWhite);
      v.por(geoDoEnfeiteDaCartela(tipo === 'presilha'), m, cor);
      break;
    }
    case 'sapatilha':
    case 'botaAlta': {
      const corpo = tipo === 'sapatilha' ? geoDaSapatilha() : geoDaBotaAlta();
      const detalhe = tipo === 'sapatilha' ? geoDaSolaDaSapatilha() : geoDoDetalheDaBotaAlta();
      const meio = tipo === 'sapatilha' ? 0.05 : 0.065;
      for (const l of [-1, 1] as const) {
        const m = matriz(x + l * meio, y, z + (l > 0 ? 0.02 : 0), giro + l * 0.08);
        v.por(corpo, m, cor);
        v.por(detalhe, m, det);
      }
      break;
    }
    case 'colar':
      v.por(geoDoColar(), matriz(x, y, z, giro), cor);
      v.por(geoDoFechoDoColar(), matriz(x, y, z, giro), det);
      break;
    case 'tiara':
      v.por(geoDaTiara(), matriz(x, y, z, giro), cor);
      v.por(geoDasPerolasDaTiara(), matriz(x, y, z, giro), det);
      break;
    case 'relogio':
      v.por(geoDoRelogio(), matriz(x, y, z, giro), cor);
      v.por(geoDoMostradorNaVitrine(), matriz(x, y, z, giro), det);
      break;
    case 'chapeu':
      v.por(geoDoChapeu(), matriz(x, y, z, giro), cor);
      v.por(geoDaFitaDoChapeu(), matriz(x, y, z, giro), det);
      break;
    case 'fedora':
      v.por(geoDoFedora(), matriz(x, y, z, giro), cor);
      v.por(geoDaFitaDoFedora(), matriz(x, y, z, giro), det);
      break;
    case 'bolsa':
      v.por(geoDaBolsa(), matriz(x, y, z, giro), cor);
      v.por(geoDoFechoDaBolsa(), matriz(x, y, z, giro), det);
      break;
    case 'bolsaTransversal':
      v.por(geoDaBolsaTransversal(), matriz(x, y, z, giro), cor);
      v.por(geoDoFechoDaTransversal(), matriz(x, y, z, giro), det);
      break;
    case 'lenco':
      v.por(geoDoLenco(), matriz(x, y, z, giro), cor);
      v.por(geoDaBarraDoLenco(), matriz(x, y, z, giro), det);
      break;
    default:
      throw new Error(`${tipo} pendura, nao senta`);
  }
  v.pecas++;
}

/**
 * UMA PEÇA SOLTA, sem instância: a roupa com cabide e gancho como um grupo de
 * malhas comuns — para quando ela é uma só (o vestido no gancho do provador).
 */
export function roupaSolta(tipo: TipoNaArara, cor: number, detalhe: number): THREE.Group {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geoDoCorpo(tipo), toon(cor)));
  g.add(new THREE.Mesh(geoDoDetalhe(tipo), toon(detalhe)));
  g.add(new THREE.Mesh(geoDaBarraDoCabide(), toon(P.boutiqueCabide)));
  const gancho = new THREE.Mesh(geoDoGancho(), toon(P.boutiqueOuro));
  gancho.rotation.y = Math.PI / 2;
  g.add(gancho);
  return g;
}
