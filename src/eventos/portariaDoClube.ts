/**
 * A PORTARIA DO CLUBE — o minigame da guarita da Gina (pedido do Renan,
 * 2026-11-20: "a guarita da Gina", inspirado em Papers, Please, na versão
 * fofa).
 *
 * Esta é só a primeira etapa: a guarita foi reformada (`world/guaritaDoClube.ts`),
 * e a PRIMEIRA conversa com a Gina na guarita nova desbloqueia o minigame —
 * ela mostra a reforma e convida a dupla para trabalhar com ela. Como o
 * minigame ainda não existe, o desbloqueio fica atrás de uma CHAVE (o molde do
 * Bebito Mobile): sem ela, a conversa com a Gina é a de sempre e o save não
 * ganha flag nenhuma — assim a "primeira vez" do Ari não é gasta antes de
 * haver o que jogar. `?portaria` liga na marra, para testar, num SAVE À PARTE
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

/** a chave: `true` quando o Renan mandar ligar o desbloqueio no link principal */
export const PORTARIA_NO_JOGO = false;

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
