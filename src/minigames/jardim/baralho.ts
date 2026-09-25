import { estagioDoRegador, type EstiloDeRegador } from '../../world/regador';
import {
  CARTAS, CONSOLOS, NIVEL_MINIMO, cartaPorId, fichaInicial,
  type CartaDoJardim, type EstiloDoJato, type Familia, type FichaDaRodada, type Raridade,
} from './cartas';
import { ARMAS, armaPorId, type ArmaId } from './armas';

/**
 * A MÃO DE CARTAS — quem guarda quais cartas a rodada já tem.
 *
 * O pedido do Renan, e a razão de este arquivo existir: **carta que você já
 * tem não aparece de novo**. O sorteio de três cartas nunca olha o baralho
 * cru; ele olha o baralho MENOS a mão. E a mão é uma lista de ids, na ordem
 * em que foram escolhidas — nada mais.
 *
 * TRÊS DECISÕES, e cada uma fecha uma porta para um bug:
 *
 * 1. **A mão guarda ID, e não a carta nem o efeito.** Tudo o que a carta faz
 *    (a ficha de números, o desenho do regador, o estágio) é DERIVADO da lista
 *    toda vez que alguém pergunta. Não existe número acumulado que possa
 *    escorregar, e a rodada de qualquer momento é reproduzível só com os ids.
 * 2. **Uma rodada, uma mão.** A rodada começa SEMPRE do nível 0 (§7 do plano):
 *    ninguém entra na rodada já forte. Por isso a mão não é salva no
 *    `SaveState` — ela nasce vazia com a rodada e morre com ela.
 * 3. **O sorteio recebe o dado de fora** (`rng`). Mesmo dado, mesma oferta: é
 *    o que deixa o `scripts/cartas.mjs` jogar mil rodadas e provar que
 *    nenhuma carta repetiu, sem depender de sorte.
 */

/**
 * O PESO DE CADA RARIDADE, no nível 1 e no nível 10 (§6 do plano). Entre os
 * dois a conta é uma reta; depois do 10 fica no do 10.
 */
const PESO_NO_NIVEL_1: Record<Raridade, number> = { comum: 70, incomum: 25, raro: 5, lendario: 0 };
const PESO_NO_NIVEL_10: Record<Raridade, number> = { comum: 35, incomum: 35, raro: 22, lendario: 8 };

const RARIDADES: readonly Raridade[] = ['comum', 'incomum', 'raro', 'lendario'];

/** Quantas cartas a tela de escolha mostra. */
export const CARTAS_POR_ESCOLHA = 3;

/** O peso de uma raridade num nível, já com o piso dela aplicado. */
export function pesoDaRaridade(raridade: Raridade, nivel: number): number {
  if (nivel < NIVEL_MINIMO[raridade]) return 0;
  const t = Math.max(0, Math.min(1, (nivel - 1) / 9));
  return PESO_NO_NIVEL_1[raridade] + (PESO_NO_NIVEL_10[raridade] - PESO_NO_NIVEL_1[raridade]) * t;
}

/**
 * A CARTA SERVE PARA ESTA ARMA? A que é só de outra (`soPara`) não; a que não
 * faz sentido nela (`naoServe`) também não. O resto serve para todas.
 */
export function servePara(carta: CartaDoJardim, arma: ArmaId): boolean {
  if (carta.soPara && !carta.soPara.includes(arma)) return false;
  return !carta.naoServe?.includes(arma);
}

/**
 * A carta é DA FERRAMENTA (e não genérica)? É o que a bancada das ferramentas
 * mostra na aba de cada uma (pedido do Renan: "somente as cartas únicas daquele
 * tipo"). Serve nela e NÃO serve em todas as ferramentas construídas: na
 * mangueira são as `soPara: ['mangueira']`; no regador e na pistola, as de
 * tanque e tonel (que a mangueira, de água infinita, não tira) mais as só
 * dela. Uma carta pode ser de mais de uma ferramenta — o Jean-Luc no tonel é
 * do regador E da pistola (regra do Renan: carta que serve para outra
 * ferramenta de munição entra na lista dela também). As genéricas (alcance,
 * força, leque…) servem em todas e ficam só no livro da bancada.
 */
export function soDestaArma(carta: CartaDoJardim, arma: ArmaId): boolean {
  if (carta.repetivel || !servePara(carta, arma)) return false;
  return ARMAS.some((o) => o.pronta && !servePara(carta, o.id));
}

export class MaoDeCartas {
  /** os ids, na ordem em que foram escolhidos */
  private readonly pegas: string[] = [];

  /**
   * A ARMA DA RODADA (`armas.ts`). Ela decide duas coisas: quais cartas podem
   * sair (`soPara` e `naoServe`, em `cartas.ts`) e os números de partida da
   * ficha (`base`), antes de qualquer carta.
   */
  constructor(readonly arma: ArmaId = 'regador') {}

  /** Quantas cartas de consolo já saíram. Elas não entram na mão. */
  consolos = 0;

  /** As cartas da mão, na ordem em que foram pegas. */
  get cartas(): readonly CartaDoJardim[] {
    return this.pegas.map((id) => cartaPorId(id)!);
  }

  get ids(): readonly string[] {
    return this.pegas;
  }

  tem(id: string): boolean {
    return this.pegas.includes(id);
  }

  quantasDaFamilia(familia: Familia): number {
    return this.cartas.filter((c) => c.familia === familia).length;
  }

  /**
   * PODE ESTA CARTA APARECER AGORA?
   *
   * É o filtro inteiro num lugar só, e a pergunta que o teste faz a cada
   * oferta: não está na mão, a série anterior já está, nenhuma carta que
   * briga com ela está, e o nível já chegou no piso dela.
   */
  podeSair(carta: CartaDoJardim, nivel: number): boolean {
    if (carta.repetivel) return true;
    if (!servePara(carta, this.arma)) return false;
    if (this.tem(carta.id)) return false;
    if (carta.requer?.some((id) => !this.tem(id))) return false;
    if (carta.exclui?.some((id) => this.tem(id))) return false;
    const piso = carta.nivelMinimo ?? NIVEL_MINIMO[carta.raridade];
    return nivel >= piso;
  }

  /** Todas as cartas do baralho que podem sair neste nível. */
  disponiveis(nivel: number): CartaDoJardim[] {
    return CARTAS.filter((c) => this.podeSair(c, nivel));
  }

  /**
   * AS TRÊS CARTAS DA TELA DE ESCOLHA.
   *
   * Para cada vaga: sorteia a RARIDADE pelo peso do nível (só entre as
   * raridades que ainda têm carta disponível), e dentro dela sorteia a carta
   * PREFERINDO UMA FAMÍLIA QUE AINDA NÃO ESTÁ NA MESA. É isso que põe as três
   * famílias lado a lado sempre que o baralho deixa — três cartas de +% ao
   * regador não é escolha, é clique.
   *
   * Nenhuma carta sai duas vezes na mesma mão de três, e nenhuma carta da mão
   * sai de novo. O que faltar para completar três vem dos CONSOLOS.
   */
  oferta(nivel: number, rng: () => number, acima = false): CartaDoJardim[] {
    /*
     * A SORTE DE PRINCIPIANTE (`acima`): cada vaga sobe uma raridade. O piso
     * de nível não segura a subida — é a graça da carta: no nível 2 ela é o
     * único jeito de ver uma lendária. O peso continua o do nível, então quem
     * sobe é a raridade sorteada, e não o sorteio inteiro.
     */
    const livres = this.disponiveis(acima ? Math.max(nivel, NIVEL_MINIMO.lendario) : nivel);
    const mesa: CartaDoJardim[] = [];

    while (mesa.length < CARTAS_POR_ESCOLHA && livres.length > 0) {
      const pesos = RARIDADES.map((r) =>
        livres.some((c) => c.raridade === r) ? pesoDaRaridade(r, nivel) : 0,
      );
      const total = pesos.reduce((a, b) => a + b, 0);
      /*
       * TOTAL ZERO: sobrou só carta de raridade que o nível ainda não libera
       * (ou nada). Não se inventa peso para ela — o buraco vai para o consolo.
       */
      if (total <= 0) break;
      let dado = rng() * total;
      // a ultima raridade com peso e o que sobra se o arredondamento deixar o
      // dado passar do fim da regua
      let raridade: Raridade = RARIDADES[pesos.map((p) => p > 0).lastIndexOf(true)];
      for (let i = 0; i < RARIDADES.length; i++) {
        dado -= pesos[i];
        if (pesos[i] > 0 && dado < 0) {
          raridade = RARIDADES[i];
          break;
        }
      }

      if (acima) {
        const i = RARIDADES.indexOf(raridade);
        const subida = RARIDADES.slice(i + 1).find((r) => livres.some((c) => c.raridade === r));
        if (subida) raridade = subida;
      }

      const daRaridade = livres.filter((c) => c.raridade === raridade);
      const familiasNaMesa = new Set(mesa.map((c) => c.familia));
      const novas = daRaridade.filter((c) => !familiasNaMesa.has(c.familia));
      const grupo = novas.length > 0 ? novas : daRaridade;
      /*
       * DENTRO DO GRUPO, POR FAMÍLIA E DEPOIS POR CARTA. Sortear a carta direto
       * faria a família com mais cartas ganhar quase sempre: o regador tem 21
       * comuns e o jardim tem 6, então num sorteio plano
       * o jardim quase nunca aparecia na primeira vaga.
       */
      const familias = [...new Set(grupo.map((c) => c.familia))];
      const familia = familias[Math.floor(rng() * familias.length)];
      const daFamilia = grupo.filter((c) => c.familia === familia);
      const escolhida = daFamilia[Math.floor(rng() * daFamilia.length)];

      mesa.push(escolhida);
      livres.splice(livres.indexOf(escolhida), 1);
    }

    // o baralho acabou: completa com consolo, sem repetir consolo na mesma mesa
    for (const consolo of CONSOLOS) {
      if (mesa.length >= CARTAS_POR_ESCOLHA) break;
      mesa.push(consolo);
    }
    return mesa;
  }

  /**
   * ESCOLHE UMA CARTA. Devolve `false` e não mexe em nada se ela não podia
   * ser escolhida — a tela só mostra carta válida, mas a regra de "não
   * repete" não pode depender do desenho.
   */
  pegar(id: string, nivel = Infinity): boolean {
    const carta = cartaPorId(id);
    if (!carta || !this.podeSair(carta, nivel)) return false;
    if (carta.repetivel) {
      this.consolos += 1;
      return true;
    }
    this.pegas.push(id);
    return true;
  }

  /** A ficha de números e regras de agora, derivada do zero. */
  ficha(): FichaDaRodada {
    const f = fichaInicial();
    armaPorId(this.arma)?.base(f);
    for (const c of this.cartas) c.aplicar(f);
    return f;
  }

  /** O JATO DE AGORA: o que a animação de ataque desenha (`jato.ts`). */
  estiloDoJato(): EstiloDoJato {
    return this.ficha().jato;
  }

  /**
   * O REGADOR DE AGORA, pronto para `regadorDeJardim(...)`. O estágio sai de
   * quantas cartas de REGADOR a mão tem (0-2, 3-5, 6+), e não de uma carta.
   */
  estiloDoRegador(): EstiloDeRegador {
    const { estilo } = this.ficha();
    return {
      estagio: estagioDoRegador(this.quantasDaFamilia('regador')),
      bico: estilo.bico ?? 0,
      crivo: estilo.crivo ?? 0,
      tanque: estilo.tanque ?? 0,
      ponteira: estilo.ponteira ?? false,
      caboDeMadeira: estilo.caboDeMadeira ?? false,
      segundoBico: estilo.segundoBico ?? false,
      mangueira: estilo.mangueira ?? false,
      respiro: estilo.respiro ?? false,
      nuvem: estilo.nuvem ?? false,
      crivoDeFlor: estilo.crivoDeFlor ?? 0,
      alcaAcolchoada: estilo.alcaAcolchoada ?? false,
      arma: this.arma,
    };
  }
}
