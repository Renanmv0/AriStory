/**
 * A PORTARIA DO CLUBE — o minigame da guarita da Gina (pedido do Renan,
 * 2026-11-20: "a guarita da Gina", inspirado em Papers, Please, na versão
 * fofa).
 *
 * Esta é só a primeira etapa: a guarita foi reformada (`world/guaritaDoClube.ts`),
 * e a PRIMEIRA conversa com a Gina na guarita nova desbloqueia o minigame —
 * ela mostra a reforma e convida a dupla para trabalhar com ela. A primeira
 * versão foi liberada pelo Renan em 2026-11-21. A CHAVE continua permitindo
 * desligar o minigame; `?semPortaria` força a conversa anterior. `?portaria`
 * continua sendo o acesso de teste, num SAVE À PARTE
 * (`aristory.save.v1.portaria`, que nasce como cópia do de verdade).
 *
 * A GUARITA NOVA SÓ APARECE DEPOIS DO MANIA (pedido do Renan, 2026-11-20: "só
 * pra ter uma sequência que faça sentido no jogo"): até a dupla terminar a
 * ÚLTIMA noite da escala do Walter, o clube tem a guarita de antes (`guarita()`
 * em `world/props.ts`). A sexta noite só abre com as três estrelas na quinta,
 * e assim por diante, então tê-la jogado é ter passado por todas.
 */
import type { GameAPI } from '../core/types';
import { ARI, RENAN } from '../characters/cast';
import { CHAVE, TURNOS } from '../minigames/turnosDoMania';
import { CHAVE as CHAVE_DA_PORTARIA, DIAS, diaAberto } from '../minigames/portaria';

/** a última noite da escala do Walter */
const ULTIMA_NOITE = TURNOS[TURNOS.length - 1].numero;

/**
 * A GUARITA NOVA ESTÁ NO CLUBE? Depois da última noite do Mania jogada até o
 * fim. `?guaritaNova` (e o `?portaria`, que testa o desbloqueio) mostra antes
 * da hora; `?semGuaritaNova` força a de antes.
 */
export function guaritaNovaNoClube(g: GameAPI): boolean {
  const busca = typeof location === 'undefined' ? null : new URLSearchParams(location.search);
  if (busca?.has('semGuaritaNova')) return false;
  if (busca?.has('guaritaNova') || busca?.has('portaria')) return true;
  return g.stat(CHAVE.vezes(ULTIMA_NOITE)) > 0;
}

/** Primeira versão liberada pelo Renan em 2026-11-21; ?portaria mantém o save de teste. */
export const PORTARIA_NO_JOGO = true;

/** a flag do save: o minigame da portaria está desbloqueado */
export const PORTARIA_LIBERADA = 'portaria:liberada';

/** o desbloqueio vale nesta página? (a chave, ou `?portaria`; `?semPortaria` desliga) */
export function portariaNestaPagina(): boolean {
  const busca = typeof location === 'undefined' ? null : new URLSearchParams(location.search);
  if (busca?.has('semPortaria')) return false;
  return PORTARIA_NO_JOGO || !!busca?.has('portaria');
}

/** a guarita nova está no clube e a primeira vez nela ainda não aconteceu (e vale nesta página) */
export function guaritaNovaPorVer(g: GameAPI): boolean {
  return portariaNestaPagina() && guaritaNovaNoClube(g) && !g.flag(PORTARIA_LIBERADA);
}

/**
 * A CONVERSA DA GUARITA NOVA: a Gina mostra a reforma, conta que o portão anda
 * movimentado e convida os dois para a portaria. No fim, a flag, a memória e o
 * aviso do minigame novo.
 *
 * As falas são PROVISÓRIAS (o Renan ainda não escreveu as dele).
 */
export async function conversaDaGuaritaNova(g: GameAPI): Promise<void> {
  const G = 'Gina';
  const A = ARI.name;
  const R = RENAN.name;
  const conversa = async (falas: Array<readonly [string, string]>): Promise<void> => {
    for (const [quem, texto] of falas) await g.say([texto], quem);
  };
  await conversa([
    [G, 'Repararam? Guarita nova! Reformaram tudinho: tem janela dos dois lados, relógio, câmera, até catavento.'],
    [A, 'Tá linda, Gina. E bem maior.'],
    [G, 'Maior, né? Cabe mais gente aqui dentro. E bem na hora: o portão anda tão movimentado que eu sozinha não dou conta de carimbar todo mundo.'],
    [G, 'Que tal vocês me ajudarem na portaria? Eu ensino tudo: carteirinha, lista de sócios, carimbo e apito.'],
    [R, 'A gente de porteiro? Eu topo.'],
    [A, 'Só se eu puder usar o apito.'],
    [G, 'Combinado! Quando quiserem trabalhar, é só chegar na guarita.'],
  ]);
  g.som('apito');
  g.setFlag(PORTARIA_LIBERADA);
  g.unlock({
    id: 'guarita-nova',
    title: 'A guarita nova',
    place: 'Clube',
    note: 'A Gina ganhou uma guarita nova, maior e cheia de coisinha — relógio, câmera, catavento de girafa — e convidou a gente pra trabalhar com ela na portaria.',
    icon: '🦒',
  });
  g.toast('Minigame desbloqueado: a Portaria do Clube!', '🦒');
}

/**
 * O DIA DA PORTARIA QUE A CENA VAI JOGAR. A conversa com a Gina escolhe e
 * guarda aqui antes do `goTo('portaria')` (a cena não recebe parâmetro);
 * `?dia=n` força nos testes. Sem pedido: o primeiro dia aberto que ainda não
 * foi jogado, ou o último aberto.
 */
let diaPedido: number | null = null;
export function pedirODiaDaPortaria(n: number): void {
  diaPedido = n;
}
export function diaDaPortariaPedido(g: GameAPI, busca: URLSearchParams): number {
  const daUrl = Number(busca.get('dia'));
  if (daUrl >= 1 && daUrl <= DIAS.length) return daUrl;
  if (diaPedido !== null) {
    const n = diaPedido;
    diaPedido = null;
    return n;
  }
  let ultimo = 1;
  for (const d of DIAS) {
    if (!diaAberto(g, d.numero)) break;
    ultimo = d.numero;
    if (g.stat(CHAVE_DA_PORTARIA.vezes(d.numero)) === 0) return d.numero;
  }
  return ultimo;
}

/** a Portaria já foi desbloqueada nesta página (a chave e a flag do save) */
export function portariaLiberada(g: GameAPI): boolean {
  return portariaNestaPagina() && g.flag(PORTARIA_LIBERADA);
}

/**
 * O CONVITE DA GINA, depois do desbloqueio: escolher o dia e ir trabalhar
 * (`'foi'`), ficar só na conversa de sempre (`'conversar'`) ou deixar para
 * depois (`'depois'`). Os dias abrem um a um, terminando o anterior; o que já
 * foi jogado mostra as melhores estrelas.
 */
export async function convidarParaAPortaria(g: GameAPI): Promise<'foi' | 'conversar' | 'depois'> {
  const abertos = DIAS.filter((d) => diaAberto(g, d.numero));
  const rotulos = abertos.map((d) => {
    const estrelas = g.stat(CHAVE_DA_PORTARIA.estrelas(d.numero));
    const marca = estrelas > 0 ? ` ${'⭐'.repeat(estrelas)}` : ' · novo';
    return `🛎️ Dia ${d.numero}: ${d.nome}${marca}`;
  });
  const escolha = await g.ask('Bora trabalhar na portaria? A fila já tá se formando!', [...rotulos, '💬 Só conversar', 'Agora não'], 'Gina');
  if (escolha < abertos.length) {
    pedirODiaDaPortaria(abertos[escolha].numero);
    g.som('apito');
    g.goTo('portaria');
    return 'foi';
  }
  return escolha === abertos.length ? 'conversar' : 'depois';
}
