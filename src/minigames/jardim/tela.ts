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
    consolo: carta.repetivel === true,
  };
}

/** O que acompanha as três cartas na tela: o nível e o que já está na mão. */
export interface ContextoDaEscolha {
  /** o nível que ACABOU de ser alcançado */
  readonly nivel: number;
  /** as cartas já pegas, na ordem — a tela mostra como fileira de fichinhas */
  readonly mao: readonly Pick<CartaNaTela, 'id' | 'nome' | 'icone' | 'raridade'>[];
}
