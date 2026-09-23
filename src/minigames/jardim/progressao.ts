import { PRAGAS, type FichaDePraga } from '../../world/bichosDoJardim';

/**
 * A PROGRESSÃO DA RODADA DO JARDIM — experiência, nível e ondas.
 *
 * Três pedidos do Renan moram aqui, e nenhum deles precisa de cena para
 * existir (por isso é lógica pura, testada por `scripts/cartas.mjs`):
 *
 * 1. **Os bichos mais fracos aparecem primeiro.** Cada onda estreia um bicho, na
 *    ordem do tier, e ele entra SOZINHO nos primeiros segundos dela.
 * 2. **Quem dá mais trabalho paga mais experiência.** A experiência são as
 *    GOTAS que o bicho espantado solta, e o número está na ficha da praga
 *    (`FichaDePraga.gotas`), ao lado do `encharque` — quem desenha o bicho diz
 *    quanto ele vale.
 * 3. **Subir de nível fica cada vez mais caro.** Os primeiros saem quase de
 *    graça; do quinto em diante, cada carta custa uma onda inteira.
 *
 * O plano, com as tabelas, está em `docs/MINIGAME-JARDIM.md` §3 e §7.
 */

// ======================================================= a curva de nível

/**
 * QUANTAS GOTAS CUSTA CHEGAR NO NÍVEL `alvo`, saindo do anterior.
 *
 * 5, 7, 10, 13, 17, 21, 26, 31, 37, 43… O primeiro nível custa 5, e dali em
 * diante o DEGRAU cresce um a cada dois níveis (+2, +3, +3, +4, +4, +5…). O
 * começo é barato de propósito — roguelite que demora a dar a primeira carta é
 * roguelite que o jogador abandona na primeira rodada — e o fim vai ficando
 * caro devagar, para as escolhas passarem a doer do meio para o fim.
 *
 * É escrito como degrau, e não como potência (`4 + n^1,6` era a primeira
 * versão), porque a potência ARREDONDADA fazia o degrau encolher no meio da
 * curva (22 → 26 → 32): subir de nível ficava mais barato de repente, e o
 * pedido era exatamente o contrário.
 */
export function custoDoNivel(alvo: number): number {
  if (alvo <= 0) return 0;
  let custo = 5;
  for (let k = 2; k <= alvo; k++) custo += 1 + Math.ceil(k / 2);
  return custo;
}

/** O total de gotas acumuladas para ESTAR no nível `nivel`. */
export function gotasParaONivel(nivel: number): number {
  let total = 0;
  for (let n = 1; n <= nivel; n++) total += custoDoNivel(n);
  return total;
}

/**
 * ONDE ESTÁ QUEM JUNTOU `gotas`: o nível, e quanto do próximo já andou.
 * É o que a barra de experiência do HUD desenha.
 */
export function nivelDasGotas(gotas: number): {
  nivel: number; noNivel: number; custo: number;
} {
  let nivel = 0;
  let resto = gotas;
  while (resto >= custoDoNivel(nivel + 1)) {
    resto -= custoDoNivel(nivel + 1);
    nivel += 1;
  }
  return { nivel, noNivel: resto, custo: custoDoNivel(nivel + 1) };
}

// ==================================================== quanto cada um solta

export function fichaDaPraga(id: string): FichaDePraga {
  const f = PRAGAS.find((p) => p.id === id);
  if (!f) throw new Error(`praga desconhecida: ${id}`);
  return f;
}

/** As gotas que a praga solta ao ser espantada. */
export function gotasDaPraga(id: string): number {
  return fichaDaPraga(id).gotas;
}

/** A ordem dos tiers, do mais fraco ao mais forte. */
export const ORDEM_DOS_TIERS = ['fraco', 'medio', 'tanque', 'chefe'] as const;

// ================================================================ as ondas

/**
 * UMA ONDA, como a tabela do §3 do plano.
 *
 * `estreia` é o bicho NOVO desta onda — ele entra sozinho nos primeiros
 * `SOLO` segundos, e depois entra para o sorteio de todas as ondas seguintes.
 * `anunciados` são os que não vêm no sorteio: o tanque e o chefe entram numa
 * hora marcada, e a porta deles chacoalha antes (bicho grande que aparece sem
 * aviso não é difícil, é injusto).
 */
export interface OndaDoJardim {
  readonly estreia: string | null;
  /** quantos entram de cada vez, e a cada quantos segundos */
  readonly quantos: number;
  readonly aCada: number;
  /** quantos bichos do sorteio a onda tem, sem contar os anunciados */
  readonly total: number;
  /** `quando` é a fração da onda (0 = começo, 1 = depois do último) */
  readonly anunciados?: ReadonlyArray<{ praga: string; quando: number }>;
}

/** As cinco primeiras: uma estreia por onda, a rampa do §3 do plano. */
const ESTREIAS: readonly OndaDoJardim[] = [
  { estreia: 'lagartejo', quantos: 1, aCada: 4, total: 12 },
  { estreia: 'gafanhopo', quantos: 2, aCada: 4, total: 20 },
  { estreia: 'coelhatu', quantos: 2, aCada: 3, total: 28 },
  {
    estreia: 'tucanguru', quantos: 3, aCada: 3, total: 36,
    anunciados: [{ praga: 'preguipolvo', quando: 0.6 }],
  },
  {
    estreia: null, quantos: 3, aCada: 2.5, total: 45,
    anunciados: [
      { praga: 'preguipolvo', quando: 0.4 },
      { praga: 'mae-lagartejo', quando: 1 },
    ],
  },
];

/**
 * DA SEXTA À VIGÉSIMA — o limite da rodada, pedido do Renan: vencer é
 * aguentar vinte ondas. Ninguém mais estreia; o que sobe é o ritmo, devagar
 * (uma leva maior a cada quatro ondas, o intervalo encurtando um tico por
 * onda), e os grandões. Todo onda tem um Preguipolvo anunciado, a partir da
 * 12ª dois, e a Mãe-Lagartejo volta nas ondas redondas: 10, 15 e 20 — a
 * última com tudo junto, que é o fim da rodada.
 */
function depoisDasEstreias(n: number): OndaDoJardim {
  const alem = n - 5;
  const anunciados: Array<{ praga: string; quando: number }> = [{ praga: 'preguipolvo', quando: 0.35 }];
  if (n >= 12) anunciados.push({ praga: 'preguipolvo', quando: 0.7 });
  if (n % 5 === 0) anunciados.push({ praga: 'mae-lagartejo', quando: 1 });
  if (n === 20) anunciados.push({ praga: 'mae-lagartejo', quando: 0.5 });
  return {
    estreia: null,
    quantos: Math.min(5, 3 + Math.floor(alem / 4)),
    aCada: Math.max(1.8, 2.5 - alem * 0.05),
    total: 45 + alem * 3,
    anunciados,
  };
}

/** Quantas ondas a rodada tem: a vigésima é a vitória. */
export const TOTAL_DE_ONDAS = 20;

export const ONDAS: readonly OndaDoJardim[] = [
  ...ESTREIAS,
  ...Array.from({ length: TOTAL_DE_ONDAS - ESTREIAS.length }, (_, i) => depoisDasEstreias(ESTREIAS.length + 1 + i)),
];

/** Os segundos em que só o bicho da estreia entra, e por uma porta só. */
export const SOLO = 10;

/**
 * O PESO DE CADA TIER NO SORTEIO. O fraco continua sendo a maioria até o fim:
 * o que sobe de uma onda para a outra é o RITMO (quantos, a cada quanto), e não
 * a troca de lagartejo por coelhatu. Enxame de fraco com um médio no meio é a
 * cara do gênero; enxame de médio é parede.
 */
const PESO_DO_TIER: Record<FichaDePraga['tier'], number> = {
  fraco: 3, medio: 1.4, tanque: 0, chefe: 0,
};

/** Uma entrada marcada no relógio da onda. */
export interface EntradaDePraga {
  /** segundos desde o começo da onda */
  t: number;
  praga: string;
  /** 0, 1 ou 2 — qual das três brechas */
  porta: number;
  /** tanque e chefe: a porta chacoalha e a Josefina avisa antes */
  anunciada: boolean;
}

/**
 * O ROTEIRO DE UMA ONDA: quem entra, quando e por qual porta.
 *
 * `numero` começa em 1. O `rng` vem de fora, pelo mesmo motivo do baralho:
 * mesmo dado, mesma onda, e o teste consegue repetir.
 */
export function planoDaOnda(numero: number, rng: () => number): EntradaDePraga[] {
  const onda = ONDAS[numero - 1];
  if (!onda) throw new Error(`a rodada tem ${ONDAS.length} ondas, e nao ${numero}`);

  // quem já estreou (até esta onda, inclusive) e pode vir no sorteio
  const estreados = ONDAS.slice(0, numero)
    .map((o) => o.estreia)
    .filter((id): id is string => id !== null);
  const pesos = estreados.map((id) => PESO_DO_TIER[fichaDaPraga(id).tier]);
  const pesoTotal = pesos.reduce((a, b) => a + b, 0);
  const sortear = (): string => {
    let dado = rng() * pesoTotal;
    for (let i = 0; i < estreados.length; i++) {
      dado -= pesos[i];
      if (dado < 0) return estreados[i];
    }
    return estreados[estreados.length - 1];
  };

  // a porta da estreia é uma só, sorteada uma vez
  const portaDaEstreia = Math.floor(rng() * 3);

  const plano: EntradaDePraga[] = [];
  let t = 0;
  let saiu = 0;
  while (saiu < onda.total) {
    const solo = onda.estreia !== null && t < SOLO;
    /*
     * NO SOLO ENTRA UM DE CADA VEZ, mesmo que a onda tenha ritmo de três: o
     * jogador precisa de um momento LIMPO para descobrir o que o bicho novo
     * faz (que o Gafanhopo pula por cima do jato), e esse momento não existe
     * com três entrando juntos.
     */
    const nesta = solo ? 1 : Math.min(onda.quantos, onda.total - saiu);
    // portas diferentes dentro da mesma leva, sempre que der
    const portas = [0, 1, 2].sort(() => rng() - 0.5);
    for (let i = 0; i < nesta; i++) {
      plano.push({
        t,
        praga: solo ? onda.estreia! : sortear(),
        porta: solo ? portaDaEstreia : portas[i % 3],
        anunciada: false,
      });
    }
    saiu += nesta;
    t += onda.aCada;
  }

  const duracao = t;
  for (const { praga, quando } of onda.anunciados ?? []) {
    plano.push({
      t: Math.round(duracao * quando * 10) / 10,
      praga,
      porta: Math.floor(rng() * 3),
      anunciada: true,
    });
  }
  return plano.sort((a, b) => a.t - b.t);
}

/** As gotas que um roteiro de onda solta se ninguém escapar. */
export function gotasDoPlano(plano: readonly EntradaDePraga[]): number {
  return plano.reduce((soma, e) => soma + gotasDaPraga(e.praga), 0);
}
