import type { SlotRoupa } from '../../core/types';
import { CARTAS, fichaInicial, type CartaDoJardim, type Familia, type Raridade } from './cartas';
import { armaPorId, type ArmaId } from './armas';

/**
 * A CARTA COMO A TELA DESENHA — o que o painel das três cartas precisa saber.
 *
 * A `Ui` não importa o baralho: ela recebe isto, que é só dado. É a mesma
 * separação do cardápio e do quadro de inscrições, e é o que deixa o painel
 * ser desenhado e fotografado sem existir uma rodada (`scripts/gotas.mjs`).
 *
 * Tudo aqui é DERIVADO da carta — nenhum campo novo precisa ser escrito à mão
 * no catálogo para ela aparecer bonita. Carta nova entra na tela sozinha.
 */
export interface CartaNaTela {
  readonly id: string;
  readonly nome: string;
  readonly texto: string;
  readonly icone: string;
  readonly familia: Familia;
  readonly raridade: Raridade;
  /**
   * Em que degrau de uma SÉRIE ela está ("Bico mais longo II" é o 2 de 3). A
   * tela desenha isso como bolinhas, e é o que diz ao jogador que existe uma
   * próxima — sem isso a série é invisível até a II aparecer.
   */
  readonly degrau?: { readonly atual: number; readonly total: number };
  /**
   * Se pegar esta carta MUDA O REGADOR DA MÃO (§6 do plano). A tela põe um selo:
   * é o único jeito de o jogador saber, ANTES de escolher, que aquela carta vai
   * aparecer no objeto.
   */
  readonly mudaORegador: boolean;
  /**
   * Se pegar esta carta MUDA O JATO na animação de ataque — a regra do Renan:
   * carta de jato muda o que se vê. Mesma conta do selo do regador.
   */
  readonly mudaOJato: boolean;
  /** carta de consolo (o baralho acabou): outra moldura, e não entra na mão */
  readonly consolo: boolean;
  /**
   * A FITA de uma carta da família da arma quando a arma não é o regador
   * ("🐍 Mangueira"). Sem isto a fita é a da família, como sempre.
   */
  readonly arma?: { readonly icone: string; readonly nome: string };
}

/** A série de uma carta, pelo id: `bico-2` é o degrau 2 da série `bico`. */
function degrauDa(carta: CartaDoJardim): CartaNaTela['degrau'] {
  const m = /^(.+)-(\d+)$/.exec(carta.id);
  if (!m) return undefined;
  const irmas = CARTAS.filter((c) => new RegExp(`^${m[1]}-\\d+$`).test(c.id));
  if (irmas.length < 2) return undefined;
  return { atual: Number(m[2]), total: irmas.length };
}

/**
 * Se a carta escreve no desenho do regador.
 *
 * Aplica ela numa ficha zerada e olha o `estilo`: é a mesma conta que a mão
 * faz, então o selo nunca mente — uma carta nova que mexa na peça ganha o selo
 * sozinha, e uma que deixe de mexer perde.
 */
function mudaORegador(carta: CartaDoJardim): boolean {
  if (carta.repetivel) return false;
  const f = fichaInicial();
  carta.aplicar(f);
  return Object.keys(f.estilo).length > 0;
}

/** Se a carta escreve no desenho do jato (`FichaDaRodada.jato`). */
function mudaOJato(carta: CartaDoJardim): boolean {
  if (carta.repetivel) return false;
  const f = fichaInicial();
  carta.aplicar(f);
  return Object.keys(f.jato).length > 0;
}

/**
 * A carta como a tela desenha, NA RODADA DE UMA ARMA (`armas.ts`): a carta da
 * família do regador ganha a fita da arma, e o selo "muda o regador" só vale
 * quando a arma é o regador. A carta que é SÓ de uma arma (`soPara`) mostra a
 * fita dela em qualquer lugar — no livro também.
 */
export function cartaDaArma(carta: CartaDoJardim, arma: ArmaId): CartaNaTela {
  const base = cartaNaTela(carta);
  const dona = carta.soPara?.length === 1 ? carta.soPara[0] : arma;
  if (carta.familia !== 'regador' || dona === 'regador') return base;
  const ficha = armaPorId(dona);
  return { ...base, mudaORegador: false, arma: ficha ? { icone: ficha.icone, nome: ficha.nome } : undefined };
}

export function cartaNaTela(carta: CartaDoJardim): CartaNaTela {
  return {
    id: carta.id,
    nome: carta.nome,
    texto: carta.texto,
    icone: carta.icone,
    familia: carta.familia,
    raridade: carta.raridade,
    degrau: degrauDa(carta),
    mudaORegador: mudaORegador(carta),
    mudaOJato: mudaOJato(carta),
    consolo: carta.repetivel === true,
  };
}

/** O que acompanha as três cartas na tela: o nível e o que já está na mão. */
export interface ContextoDaEscolha {
  /** o nível que ACABOU de ser alcançado */
  readonly nivel: number;
  /** as cartas já pegas, na ordem — a tela mostra como fileira de fichinhas */
  readonly mao: readonly Pick<CartaNaTela, 'id' | 'nome' | 'icone' | 'raridade'>[];
  /**
   * Tela de PRÊMIO de cinco em cinco níveis (a 1ª de 2, por exemplo). Sem
   * isto é a tela de sempre, a de subir de nível.
   */
  readonly premio?: { readonly atual: number; readonly total: number };
}

/**
 * O FIM DE UMA RODADA, como a tela desenha: vitória ou não, os números, quem
 * foi espantado e as cartas da mão. Dado puro, pelo mesmo motivo da carta.
 */
export interface FimDoJardim {
  /** aguentou todas as ondas com pelo menos um canteiro de pé */
  readonly venceu: boolean;
  /** a onda em que acabou, de quantas */
  readonly onda: number;
  readonly ondas: number;
  readonly espantados: number;
  /** quantos de cada praga, já com o nome, do mais espantado ao menos */
  readonly porPraga: readonly { readonly nome: string; readonly quantos: number }[];
  readonly canteiros: number;
  readonly totalDeCanteiros: number;
  readonly nivel: number;
  /** as cartas da mão no fim, na ordem em que foram pegas */
  readonly cartas: readonly CartaNaTela[];
  /** as que entraram no livro pela primeira vez nesta rodada */
  readonly novas: readonly string[];
  /** o que a rodada pagou pelos bichos espantados (`premios.ts`): reais e girassóis */
  readonly pagamento?: { readonly espantados: number; readonly dinheiro: number; readonly girassois: number };
  /** os prêmios únicos que esta rodada destravou pela primeira vez */
  readonly marcos?: readonly { readonly onda: number; readonly nome: string; readonly icone: string }[];
}

/**
 * AS OUTRAS ABAS DO LIVRO DA BANCADA (pedido do Renan): as pragas já vistas e
 * as recompensas dos marcos. Quem monta é a cena, pelas flags do save; o
 * retrato de cada praga o `Game` pinta na hora (`world/retratoDePraga.ts`).
 */
export interface PragaNoLivro {
  readonly id: string;
  readonly nome: string;
  /** o tier dito como gente fala: fraca, média, grandona, chefe */
  readonly tier: string;
  readonly mistura: string;
  readonly descricao: string;
  /** já apareceu numa rodada? Se não, a vaga fica cinza */
  readonly vista: boolean;
}

export interface RecompensaNoLivro {
  readonly onda: number;
  readonly nome: string;
  readonly icone: string;
  readonly descricao: string;
  /** ainda não chegaram / chegaram e podem resgatar / já resgataram */
  readonly estado: 'trancada' | 'pronta' | 'resgatada';
}

export interface ConteudoDoLivro {
  readonly pragas: readonly PragaNoLivro[];
  readonly recompensas: readonly RecompensaNoLivro[];
  /** a maior onda vencida numa rodada */
  readonly recorde: number;
  /** quantos reais cada tantos bichos pagam, e quantos bichos valem um girassol, para a aba explicar o pagamento */
  readonly reaisPorLote: number;
  readonly bichosPorLote: number;
  readonly bichosPorGirassol: number;
}

/**
 * A LOJINHA DA JOSEFINA (a banca no canto da estufa) — o que o painel dela
 * recebe. Quem monta é a cena, pelo save; o painel só desenha e devolve o que
 * a dupla apertou.
 */
export interface RoupaNaLoja {
  readonly id: string;
  /** a parte do corpo: o painel separa a prateleira por ela */
  readonly slot: SlotRoupa;
  readonly nome: string;
  readonly icone: string;
  readonly nota?: string;
  readonly preco: number;
  /** a cor da peça em CSS, para a amostra do cartão */
  readonly cor: string;
  /** já pagaram por ela (o armário repõe para sempre) */
  readonly jaTem: boolean;
  /** a onda em que a Josefina passa a vender (o recorde tem que chegar lá) */
  readonly onda: number;
  /** o recorde ainda não chegou: cartão com cadeado, sem botão de comprar */
  readonly travada: boolean;
}

export interface DecoracaoNaLoja {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  readonly descricao: string;
  /** o preço, em girassóis 🌻 */
  readonly girassois: number;
  /** a onda em que a Josefina passa a vender (o recorde tem que chegar lá) */
  readonly onda: number;
  readonly travada: boolean;
  /** compradas e esperando lugar */
  readonly guardadas: number;
  /** já no chão da estufa */
  readonly postas: number;
}

export interface ConteudoDaLoja {
  /** reais, na carteira do casal: compram as ROUPAS */
  readonly saldo: number;
  /** girassóis 🌻, que só a rodada paga: compram os ENFEITES */
  readonly girassois: number;
  /** a maior onda vencida: é ela que destranca a loja */
  readonly recorde: number;
  readonly roupas: readonly RoupaNaLoja[];
  readonly decoracoes: readonly DecoracaoNaLoja[];
}

/** o que o painel pede SEM fechar: comprar (ele se redesenha com a resposta) */
export interface AcaoNaLoja {
  readonly tipo: 'comprar-roupa' | 'comprar-decoracao';
  readonly id: string;
}

/**
 * Como o painel fechou: só fechando (`null`), indo PROVAR as roupas no boneco
 * (a arara da boutique), indo COLOCAR um enfeite guardado no chão, ou entrando
 * no MODO DE EDIÇÃO (mexer nos enfeites que já estão no chão).
 */
export type SaidaDaLoja =
  | null
  | { readonly tipo: 'provar' }
  | { readonly tipo: 'colocar'; readonly id: string }
  | { readonly tipo: 'editar' };

/**
 * A BARRA DE BAIXO DA TELA, nos dois modos do decorador:
 *
 * - **colocar**: o enfeite que está na mão, se ele cabe onde está, e os três
 *   botões (que também são teclas: G, E e X);
 * - **editar**: o modo de edição — quantos enfeites estão no chão e o botão de
 *   terminar (X). Mexer em cada um é chegar perto e apertar E.
 */
export type EstadoDoPosicionador =
  | {
    readonly tipo: 'colocar';
    readonly nome: string;
    readonly icone: string;
    readonly valido: boolean;
    /** por que não dá, quando não dá ("em cima do canteiro", "no vão do portão") */
    readonly motivo?: string;
  }
  | { readonly tipo: 'editar'; readonly postos: number };
export type BotaoDoPosicionador = 'girar' | 'colocar' | 'cancelar' | 'pronto';

/**
 * O PAINEL DA RODADA no alto da tela, e o BOTÃO DA AJUDA DO PAR: a onda, a
 * água, os canteiros, e quanto falta para chamar quem ficou lá atrás.
 */
export interface PainelDoJardim {
  onda: number;
  ondas: number;
  agua: number;
  tanque: number;
  canteiros: number;
  totalDeCanteiros: number;
  enchendo: boolean;
  /** a mangueira: presa no tonel, a água nunca acaba (o painel mostra ∞) */
  infinita?: boolean;
  /** a ajuda do par: o nome de quem vem, o anel (0 a 1), se está pronta, e os segundos que restam dela */
  ajuda?: { nome: string; carga: number; pronta: boolean; resta: number };
}

/**
 * A BANCADA DO ARSENAL (pedido do Renan: "parecido com o livro inicial") — o
 * painel das armas. Uma aba por arma: o estado dela, o que falta para
 * destrancar, e as cartas DELA (as que servem nela), descobertas ou cinzas.
 * Quem monta é a cena, pelo save; o painel só desenha e devolve a arma que a
 * dupla mandou usar.
 */
export interface ArmaNoArsenal {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  readonly descricao: string;
  /**
   * `escolhida` = a que vai para a próxima rodada; `aberta` = dá para usar;
   * `trancada` = faltam ondas jogadas com a anterior (15, somando rodadas); `em-construcao` =
   * destrancada, mas a rodada dela ainda não existe no jogo.
   */
  readonly estado: 'escolhida' | 'aberta' | 'trancada' | 'em-construcao';
  /** a meta dita como gente fala: "Joguem 15 ondas com o regador, somando as rodadas" */
  readonly meta: string;
  /** a maior onda vencida com ela */
  readonly recorde: number;
  /** as ondas já jogadas com a anterior, para a barrinha da meta (0 a `ondaParaAbrir`) */
  readonly progresso: number;
  /** as ondas jogadas com ELA, somando as rodadas */
  readonly ondas: number;
  /** as cartas que servem nela, já com a fita da arma */
  readonly cartas: readonly CartaNaTela[];
}

export interface ConteudoDoArsenal {
  readonly armas: readonly ArmaNoArsenal[];
  /** quantas ondas jogadas com a anterior destrancam a próxima */
  readonly ondaParaAbrir: number;
}
