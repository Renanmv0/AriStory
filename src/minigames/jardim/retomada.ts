import { ARMAS, type ArmaId } from './armas';
import { cartaPorId } from './cartas';
import type { EntradaDePraga } from './progressao';

/**
 * O PONTO DE RETORNO DA RODADA — pedido do Ari, pelo Renan: o celular dele
 * descarta a aba no meio da rodada, a página recarrega e a rodada inteira ia
 * embora. Agora, no COMEÇO DE CADA ONDA, a rodada tira um retrato de si e
 * guarda no save; recarregou, a Josefina oferece continuar daquela onda.
 *
 * O RETRATO É NO COMEÇO DA ONDA, e não a cada segundo, porque é o único
 * momento limpo da rodada: nenhum bicho na estufa, nenhuma tela aberta,
 * nenhum jato no ar. Quem recarrega no meio da onda 12 volta para o começo da
 * 12 — perde segundos, e não a rodada.
 *
 * O QUE ENTRA é o que atravessa de uma onda para a outra, e nada mais:
 *
 * - **as cartas, na ordem em que foram pegas**. A ficha da rodada (alcance,
 *   tanque, regras…) é sempre DERIVADA da mão (`baralho.ts`), então a mão
 *   remontada na mesma ordem dá a mesma ficha — não existe número acumulado
 *   para escorregar;
 * - **o que a carta deixou no chão**: em qual canteiro está a cerca viva, o
 *   toldo, a pimenta e a dioneia; qual portão emperrou; onde caiu o picolé;
 * - **a conta da rodada**: nível, gotas juntadas, espantados (é por eles que
 *   o fim paga — a rodada continuada paga a rodada inteira, uma vez só);
 * - **a semente do sorteio**: a onda volta com os mesmos bichos.
 *
 * O que vale "uma vez por onda" (o Grito, o Espantalho, os chamados) zera no
 * começo de toda onda de qualquer jeito, e os relógios (gêiser, chuva, crivo)
 * são de segundos: nenhum dos dois precisa de retrato.
 *
 * Quando a rodada ACABA (vitória ou canteiros comidos) o retrato é apagado,
 * e começar do zero também apaga: continuar é só para rodada interrompida.
 */
export const CHAVE_DA_RETOMADA = 'jardim';
const VERSAO = 1;

export interface CanteiroNoRetrato {
  /** a vida, como FRAÇÃO da máxima (a máxima sai da ficha e do toldo) */
  vida: number;
  /** a cerca viva: se tem, e quanto dela está de pé (fração) */
  protegido: boolean;
  cerca: number;
  toldo: boolean;
  pimenta: boolean;
  carnivora: boolean;
}

export interface PontoDaRodada {
  versao: number;
  arma: ArmaId;
  /** a onda que COMEÇA (a 2 em diante), e de quantas é a rodada */
  onda: number;
  ondas: number;
  /** a mão, na ordem em que foi pega (só as que entram na mão) */
  cartas: string[];
  consolos: number;
  nivel: number;
  juntadas: number;
  proximoCoracao: number;
  sorteGasta: boolean;
  bisGasto: boolean;
  semente: number;
  /** o roteiro da onda, se o Noel já tinha sorteado e gritado */
  proximoPlano: EntradaDePraga[] | null;
  espantados: number;
  porPraga: Record<string, number>;
  /** as cartas que entraram no livro pela primeira vez nesta rodada */
  novas: string[];
  agua: number;
  ajuda: { carga: number; custo: number; vezes: number };
  emperrado: number | null;
  canteiros: CanteiroNoRetrato[];
  picole: { x: number; z: number } | null;
  /** quem recebeu um regador da rodada (sai da mochila no fim) */
  regadores: string[];
  /** as dicas da Josefina já dadas: não repetem depois de continuar */
  dicas: string[];
}

export function versaoDoRetrato(): number {
  return VERSAO;
}

const numero = (v: unknown, padrao = 0): number => (typeof v === 'number' && Number.isFinite(v) ? v : padrao);
const inteiro = (v: unknown, padrao = 0): number => Math.max(0, Math.floor(numero(v, padrao)));
const fracao = (v: unknown): number => Math.max(0, Math.min(1, numero(v, 1)));
const textos = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

/**
 * LÊ O RETRATO GUARDADO, conferindo campo por campo. O save vive no navegador
 * e atravessa versões do jogo: uma carta pode ter saído do baralho, a rodada
 * pode ter mudado de tamanho. Retrato que não fecha volta `null` (a Josefina
 * simplesmente não oferece continuar), e nunca uma rodada torta.
 */
export function lerPontoDaRodada(dados: unknown, ondasDoJogo: number): PontoDaRodada | null {
  if (!dados || typeof dados !== 'object') return null;
  const d = dados as Record<string, unknown>;
  if (d.versao !== VERSAO) return null;
  const arma = ARMAS.find((a) => a.id === d.arma);
  if (!arma) return null;
  const ondas = Math.min(ondasDoJogo, inteiro(d.ondas, ondasDoJogo)) || ondasDoJogo;
  const onda = inteiro(d.onda);
  if (onda < 2 || onda > ondas) return null;
  if (!Array.isArray(d.canteiros)) return null;

  const plano = Array.isArray(d.proximoPlano)
    ? (d.proximoPlano as unknown[]).filter((e): e is EntradaDePraga => {
      const x = e as Partial<EntradaDePraga> | null;
      return !!x && typeof x.praga === 'string' && typeof x.t === 'number' && typeof x.porta === 'number'
        && x.porta >= 0 && x.porta <= 2;
    })
    : null;
  const porPraga: Record<string, number> = {};
  if (d.porPraga && typeof d.porPraga === 'object') {
    for (const [k, v] of Object.entries(d.porPraga as Record<string, unknown>)) porPraga[k] = inteiro(v);
  }
  const ajuda = (d.ajuda ?? {}) as Record<string, unknown>;
  const picole = d.picole as { x?: unknown; z?: unknown } | null;
  const emperrado = typeof d.emperrado === 'number' && d.emperrado >= 0 && d.emperrado <= 2 ? Math.floor(d.emperrado) : null;

  return {
    versao: VERSAO,
    arma: arma.id,
    onda,
    ondas,
    // a carta que saiu do jogo numa atualização fica de fora; o resto continua
    cartas: textos(d.cartas).filter((id) => !!cartaPorId(id)),
    consolos: inteiro(d.consolos),
    nivel: inteiro(d.nivel),
    juntadas: inteiro(d.juntadas),
    proximoCoracao: Math.max(20, inteiro(d.proximoCoracao, 20)),
    sorteGasta: d.sorteGasta === true,
    bisGasto: d.bisGasto === true,
    semente: inteiro(d.semente, 20260923) >>> 0 || 20260923,
    proximoPlano: plano && plano.length ? plano : null,
    espantados: inteiro(d.espantados),
    porPraga,
    novas: textos(d.novas),
    agua: Math.max(0, numero(d.agua)),
    ajuda: { carga: Math.max(0, numero(ajuda.carga)), custo: Math.max(1, numero(ajuda.custo, 30)), vezes: inteiro(ajuda.vezes) },
    emperrado,
    canteiros: (d.canteiros as unknown[]).map((c) => {
      const x = (c ?? {}) as Record<string, unknown>;
      return {
        vida: fracao(x.vida),
        protegido: x.protegido === true,
        cerca: fracao(x.cerca),
        toldo: x.toldo === true,
        pimenta: x.pimenta === true,
        carnivora: x.carnivora === true,
      };
    }),
    picole: picole && typeof picole.x === 'number' && typeof picole.z === 'number' ? { x: picole.x, z: picole.z } : null,
    regadores: textos(d.regadores),
    dicas: textos(d.dicas),
  };
}
