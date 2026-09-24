import { CARTAS, fichaInicial, type CartaDoJardim, type Familia, type Raridade } from './cartas';

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
  /** o que a rodada pagou na carteira (`premios.ts`): por onda, o bônus dos marcos e o total */
  readonly pagamento?: { readonly vencidas: number; readonly porOnda: number; readonly bonus: number; readonly total: number };
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
  /** o bônus em reais de toda rodada que chegar nesta onda */
  readonly moedas: number;
  /** ainda não chegaram / chegaram e podem resgatar / já resgataram */
  readonly estado: 'trancada' | 'pronta' | 'resgatada';
}

export interface ConteudoDoLivro {
  readonly pragas: readonly PragaNoLivro[];
  readonly recompensas: readonly RecompensaNoLivro[];
  /** a maior onda vencida numa rodada */
  readonly recorde: number;
  /** quanto cada onda vencida paga, para a aba explicar as moedas */
  readonly moedasPorOnda: number;
}

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
  /** a ajuda do par: o nome de quem vem, o anel (0 a 1), se está pronta, e os segundos que restam dela */
  ajuda?: { nome: string; carga: number; pronta: boolean; resta: number };
}
