import { PALETTE as P } from '../palette';
import type { ItemDef } from '../core/types';
import {
  FANTASIAS_DA_ESTELLA, ITENS, PREMIOS_DA_APOSTILA, PREMIOS_DA_ARENA, PREMIOS_DA_FESTA, PREMIOS_DO_MANIA,
} from './itens';

/*
 * O ATELIÊ DE TINGIMENTO — as regras da tinta.
 *
 * Pedido do Ari (pelo Renan): mais cores para as roupas sem mais modelos.
 * A peça já guarda a COR PRINCIPAL (`cor`, ou `corBanho` nas bermudas) e a
 * de DETALHE (`corDetalhe`: manga, barra, renda, estampa), e a geometria da
 * maioria lê as duas da ficha (o que deixou a boutique ter o mesmo vestido em
 * seis cores). Tingir é vestir uma CÓPIA da ficha com uma das duas trocada:
 * o id não muda, e compra, prêmio, guarda-roupa e save continuam iguais.
 *
 * As decisões do Renan:
 * - desbloqueia UMA vez, por R$ 50 (`PRECO_DO_ATELIE`), e daí é de graça;
 * - a tinta é POR PESSOA: a calça do Ari pintada não pinta a do Renan;
 * - prêmio de personagem e uniforme NÃO mudam de cor (`PECAS_SEM_TINTA`);
 * - dá para pintar a cor principal ou os detalhes — o detalhe só aparece
 *   quando a peça tem um (`temDetalhe`).
 *
 * `scripts/tinta.mjs` veste cada peça que o ateliê oferece e confere que a
 * cor principal e o detalhe mudam de verdade no modelo.
 */

/** o que o ateliê cobra, uma vez só, para abrir */
export const PRECO_DO_ATELIE = 50;
/** a flag do save: o ateliê já foi pago */
export const FLAG_DO_ATELIE = 'atelie-de-tinta';

/** o que se pinta numa peça */
export type ParteDaTinta = 'cor' | 'detalhe';

/** a tinta de UMA peça de UMA pessoa: só o que foi trocado */
export interface TintaDaPeca {
  cor?: number;
  detalhe?: number;
}

export interface Tinta {
  /** o nome curto, sem acento (para o teste e para a tela achar) */
  id: string;
  /** o nome que aparece na cartela */
  nome: string;
  cor: number;
}

export interface FamiliaDeTinta {
  nome: string;
  tintas: readonly Tinta[];
}

/** A CARTELA: 57 tintas em sete famílias (seis de cor e a dos neutros), do claro para o escuro. */
export const CARTELA_DE_TINTAS: readonly FamiliaDeTinta[] = [
  {
    nome: 'Vermelhos e corais',
    tintas: [
      { id: 'vermelhoCereja', nome: 'Vermelho-cereja', cor: P.tintaVermelhoCereja },
      { id: 'tomate', nome: 'Tomate', cor: P.tintaTomate },
      { id: 'coral', nome: 'Coral', cor: P.tintaCoral },
      { id: 'salmao', nome: 'Salmão', cor: P.tintaSalmao },
      { id: 'terracota', nome: 'Terracota', cor: P.tintaTerracota },
      { id: 'framboesa', nome: 'Framboesa', cor: P.tintaFramboesa },
      { id: 'vinho', nome: 'Vinho', cor: P.tintaVinho },
      { id: 'bordo', nome: 'Bordô', cor: P.tintaBordo },
    ],
  },
  {
    nome: 'Rosas',
    tintas: [
      { id: 'rosaChiclete', nome: 'Rosa-chiclete', cor: P.tintaRosaChiclete },
      { id: 'rosaBebe', nome: 'Rosa-bebê', cor: P.tintaRosaBebe },
      { id: 'rose', nome: 'Rosé', cor: P.tintaRose },
      { id: 'rosaAntigo', nome: 'Rosa-antigo', cor: P.tintaRosaAntigo },
      { id: 'pessego', nome: 'Pêssego', cor: P.tintaPessego },
      { id: 'pink', nome: 'Pink', cor: P.tintaPink },
      { id: 'fucsia', nome: 'Fúcsia', cor: P.tintaFucsia },
      { id: 'magenta', nome: 'Magenta', cor: P.tintaMagenta },
    ],
  },
  {
    nome: 'Laranjas e amarelos',
    tintas: [
      { id: 'laranja', nome: 'Laranja', cor: P.tintaLaranja },
      { id: 'tangerina', nome: 'Tangerina', cor: P.tintaTangerina },
      { id: 'damasco', nome: 'Damasco', cor: P.tintaDamasco },
      { id: 'amareloSol', nome: 'Amarelo-sol', cor: P.tintaAmareloSol },
      { id: 'manteiga', nome: 'Manteiga', cor: P.tintaManteiga },
      { id: 'limao', nome: 'Limão', cor: P.tintaLimao },
      { id: 'mostarda', nome: 'Mostarda', cor: P.tintaMostarda },
      { id: 'ocre', nome: 'Ocre', cor: P.tintaOcre },
    ],
  },
  {
    nome: 'Verdes',
    tintas: [
      { id: 'menta', nome: 'Menta', cor: P.tintaMenta },
      { id: 'pistache', nome: 'Pistache', cor: P.tintaPistache },
      { id: 'verdeFolha', nome: 'Verde-folha', cor: P.tintaVerdeFolha },
      { id: 'verdeBandeira', nome: 'Verde-bandeira', cor: P.tintaVerdeBandeira },
      { id: 'verdeAgua', nome: 'Verde-água', cor: P.tintaVerdeAgua },
      { id: 'oliva', nome: 'Oliva', cor: P.tintaOliva },
      { id: 'musgo', nome: 'Musgo', cor: P.tintaMusgo },
      { id: 'verdeGarrafa', nome: 'Verde-garrafa', cor: P.tintaVerdeGarrafa },
    ],
  },
  {
    nome: 'Azuis',
    tintas: [
      { id: 'azulBebe', nome: 'Azul-bebê', cor: P.tintaAzulBebe },
      { id: 'azulCeu', nome: 'Azul-céu', cor: P.tintaAzulCeu },
      { id: 'celeste', nome: 'Celeste', cor: P.tintaCeleste },
      { id: 'turquesa', nome: 'Turquesa', cor: P.tintaTurquesa },
      { id: 'jeans', nome: 'Jeans', cor: P.tintaJeans },
      { id: 'azulRoyal', nome: 'Azul-royal', cor: P.tintaAzulRoyal },
      { id: 'petroleo', nome: 'Petróleo', cor: P.tintaPetroleo },
      { id: 'azulMarinho', nome: 'Azul-marinho', cor: P.tintaAzulMarinho },
    ],
  },
  {
    nome: 'Roxos',
    tintas: [
      { id: 'lavanda', nome: 'Lavanda', cor: P.tintaLavanda },
      { id: 'orquidea', nome: 'Orquídea', cor: P.tintaOrquidea },
      { id: 'lilas', nome: 'Lilás', cor: P.tintaLilas },
      { id: 'malva', nome: 'Malva', cor: P.tintaMalva },
      { id: 'violeta', nome: 'Violeta', cor: P.tintaVioleta },
      { id: 'ameixa', nome: 'Ameixa', cor: P.tintaAmeixa },
      { id: 'uva', nome: 'Uva', cor: P.tintaUva },
      { id: 'indigo', nome: 'Índigo', cor: P.tintaIndigo },
    ],
  },
  {
    nome: 'Neutros e terrosos',
    tintas: [
      { id: 'brancoGelo', nome: 'Branco-gelo', cor: P.tintaBrancoGelo },
      { id: 'creme', nome: 'Creme', cor: P.tintaCreme },
      { id: 'areia', nome: 'Areia', cor: P.tintaAreia },
      { id: 'bege', nome: 'Bege', cor: P.tintaBege },
      { id: 'caramelo', nome: 'Caramelo', cor: P.tintaCaramelo },
      { id: 'chocolate', nome: 'Chocolate', cor: P.tintaChocolate },
      { id: 'cinzaClaro', nome: 'Cinza-claro', cor: P.tintaCinzaClaro },
      { id: 'grafite', nome: 'Grafite', cor: P.tintaGrafite },
      { id: 'quasePreto', nome: 'Quase-preto', cor: P.tintaQuasePreto },
    ],
  },
];

/** todas as tintas numa lista só */
export const TODAS_AS_TINTAS: readonly Tinta[] = CARTELA_DE_TINTAS.flatMap((f) => f.tintas);

/**
 * AS PEÇAS QUE NÃO SE PINTAM.
 *
 * - os PRÊMIOS DE PERSONAGEM (pedido do Renan): o que a arena, o Walter, o
 *   Gatito, as coelhinhas e a Josefina dão — a cor é deles;
 * - os UNIFORMES (pedido do Renan): o dos Gatitos e o de torcida já estão nos
 *   prêmios da apostila e da festa, e o do Mania nos do Walter;
 * - as peças TEMÁTICAS cuja cor é o personagem (a tiara do Walter, a do
 *   Pelusa, o boné da Gina, o chapéu joaninha): o modelo tem a cor cravada,
 *   e uma joaninha azul deixaria de ser joaninha.
 *
 * Os ACESSÓRIOS miúdos (pins, óculos, pulseiras, colar, a tiara de
 * conchinhas e a mochila de casco) se pintam: pedido do Ari. Até o pin de
 * joaninha — ali é enfeite de cabelo, e quem pede a joaninha azul é ele.
 */
export const PECAS_SEM_TINTA: ReadonlySet<string> = new Set<string>([
  ...Object.values(PREMIOS_DA_ARENA).flat().map((p) => p.id),
  ...Object.values(PREMIOS_DO_MANIA).flat().map((p) => p.id),
  ...Object.values(PREMIOS_DA_APOSTILA).flat().map((p) => p.id),
  ...PREMIOS_DA_FESTA.map((p) => p.id),
  ...FANTASIAS_DA_ESTELLA.map((p) => p.id),
  ITENS.gravataDoWalter.id,
  ITENS.chapeuPingPong.id,
  ITENS.chapeuDeJardineira.id,
  ITENS.aventalDaJosefina.id,
  'tiara-do-walter',
  'tiara-da-pelusa',
  'bone-da-gina',
  'gorro-joaninha',
]);

/** o campo da COR PRINCIPAL da peça: `cor`, ou o `corBanho` da bermuda */
function campoPrincipal(peca: ItemDef): 'cor' | 'corBanho' | null {
  if (peca.cor !== undefined) return 'cor';
  if (peca.corBanho !== undefined) return 'corBanho';
  return null;
}

/**
 * A peça entra no ateliê? Roupa (não item de mão nem equipamento como os
 * patins), com uma cor principal na ficha, e fora da lista de cima.
 */
export function podeTingir(peca: ItemDef): boolean {
  return peca.tipo === 'vestivel' && !peca.funcional && !PECAS_SEM_TINTA.has(peca.id) && campoPrincipal(peca) !== null;
}

/**
 * O DETALHE QUE O MODELO DESENHA FIXO: a ficha tem `corDetalhe`, mas a
 * geometria não pinta nada com ela (a renda do vestido rosa da foto, a
 * estampa de várias cores das bermudas e do chinelo de melancia, o bordado da
 * ciganinha, o laço do vestido de cetim). Nelas o ateliê oferece só a cor
 * principal. Quem achou foi o `scripts/tinta.mjs`, que pinta o detalhe de
 * cada peça e confere se algo mudou no corpo.
 */
const DETALHE_FIXO: ReadonlySet<string> = new Set([
  'vestido-rosa', 'bermuda-havaiana', 'bermuda-de-abacaxi', 'bermuda-de-melancia',
  'chinelo-de-melancia', 'blusa-ciganinha', 'vestido-de-cetim',
]);

/** A peça tem DETALHE para pintar? Só se a ficha tiver um e o modelo o pintar. */
export function temDetalhe(peca: ItemDef): boolean {
  return podeTingir(peca) && peca.corDetalhe !== undefined && !DETALHE_FIXO.has(peca.id);
}

/** A cor que a peça mostra hoje numa parte (com a tinta, se houver). */
export function corAtual(peca: ItemDef, parte: ParteDaTinta, tinta?: TintaDaPeca): number | null {
  if (parte === 'detalhe') return tinta?.detalhe ?? peca.corDetalhe ?? null;
  const campo = campoPrincipal(peca);
  return tinta?.cor ?? (campo ? (peca[campo] ?? null) : null);
}

/**
 * A FICHA TINGIDA: uma cópia com a cor principal e/ou o detalhe trocados. A
 * peça sem tinta (ou que não se pinta) volta como está, a mesma instância.
 */
export function fichaTingida(peca: ItemDef, tinta?: TintaDaPeca | null): ItemDef {
  if (!tinta || (tinta.cor === undefined && tinta.detalhe === undefined) || !podeTingir(peca)) return peca;
  const copia: ItemDef = { ...peca };
  const campo = campoPrincipal(peca);
  if (tinta.cor !== undefined && campo) copia[campo] = tinta.cor;
  if (tinta.detalhe !== undefined && peca.corDetalhe !== undefined) copia.corDetalhe = tinta.detalhe;
  return copia;
}

/** Uma assinatura curta da tinta, para o rig saber se precisa refazer a peça. */
export function chaveDaTinta(tinta?: TintaDaPeca | null): string {
  if (!tinta) return '';
  return `${tinta.cor ?? ''}/${tinta.detalhe ?? ''}`;
}

/** O nome da tinta pela cor (ou null se for a cor original da peça). */
export function nomeDaTinta(cor: number): string | null {
  return TODAS_AS_TINTAS.find((t) => t.cor === cor)?.nome ?? null;
}
