import type { GameAPI } from '../core/types';
import type { ConteudoDoBau, ConteudoDoComputador } from '../ui/painelDoQuintal';
import { DECORACOES, decoracaoPorId, podeIrPara } from '../world/decoracoes';
import { DECORACOES_DO_QUINTAL } from '../world/decoracoesDoQuintal';
import type { EstiloDeCaminho } from '../world/caminhosDoQuintal';

/**
 * O QUINTAL DECORADO, a parte que não é cena (`docs/QUINTAL.md`): o Papita
 * Delivery (pedir, pagar e pôr no correio), a encomenda (chegar e abrir) e o
 * baú (o que está guardado para o quintal). Quem chama é o quarto (o
 * computador) e a frente da casa (a caixa no portão e as ferramentas).
 *
 * Tudo isto mora na frente da casa, que só existe com a chave do Bebito
 * Mobile ligada: "O quintal entra só quando o carro ficar pronto" (o Renan).
 */

/** o que o app do Papita mostra: o saldo e cada peça com as contas dela */
export function conteudoDoComputador(g: GameAPI): ConteudoDoComputador {
  const lista = g.decoracoes();
  return {
    saldo: g.carteira(),
    itens: DECORACOES_DO_QUINTAL.filter((f) => f.naLoja !== false).map((f) => {
      const minhas = lista.filter((d) => d.id === f.id);
      return {
        id: f.id, nome: f.nome, icone: f.icone, descricao: f.descricao, categoria: f.categoria, reais: f.reais, caminho: !!f.caminho,
        aCaminho: minhas.filter((d) => d.aCaminho).length,
        noBau: minhas.filter((d) => !d.posta && !d.aCaminho).length,
        noQuintal: minhas.filter((d) => d.posta?.cena === 'quintal').length,
      };
    }),
  };
}

/**
 * PEDIR UMA UNIDADE no Papita: paga da carteira e põe no correio (`aCaminho`).
 * Sem dinheiro, não tira nada (o botão já vem apagado, isto é o cinto).
 */
export function pedirNoPapita(g: GameAPI, id: string): ConteudoDoComputador {
  const ficha = DECORACOES_DO_QUINTAL.find((f) => f.id === id && f.naLoja !== false);
  // (caminho se compra uma vez só)
  if (ficha?.caminho && g.decoracoes().some((d) => d.id === id)) return conteudoDoComputador(g);
  if (ficha && g.gastar(ficha.reais)) {
    const lista = g.decoracoes();
    const uid = lista.reduce((m, d) => Math.max(m, d.uid), 0) + 1;
    g.salvarDecoracoes([...lista, { uid, id, posta: null, aCaminho: true }]);
    g.som('caixa');
    g.toast(`${ficha.nome} — R$ ${ficha.reais}. Chega pelo correio!`, '📦');
  } else if (ficha) {
    g.toast('Não tem dinheiro para isso na carteira', '💰');
  }
  return conteudoDoComputador(g);
}

/** quantos itens estão no correio */
export function encomendasACaminho(g: GameAPI): number {
  return g.decoracoes().filter((d) => d.aCaminho).length;
}

/** Abre a encomenda: tudo o que estava no correio vai para o baú. Devolve os nomes. */
export function abrirAEncomenda(g: GameAPI): string[] {
  const lista = g.decoracoes();
  const chegou = lista.filter((d) => d.aCaminho).map((d) => decoracaoPorId(d.id)?.nome ?? d.id);
  g.salvarDecoracoes(lista.map((d) => (d.aCaminho ? { uid: d.uid, id: d.id, posta: d.posta } : d)));
  return chegou;
}

/**
 * O BAÚ DO QUINTAL: o que está guardado E pode ir para o quintal — o do
 * Papita e os enfeites da Josefina (o baú é um só para os dois lugares).
 */
export function conteudoDoBau(g: GameAPI, comRegador = false): ConteudoDoBau {
  const lista = g.decoracoes();
  const guardados = lista.filter((d) => !d.posta && !d.aCaminho);
  const fichas = [...DECORACOES_DO_QUINTAL.filter((f) => !f.caminho), ...DECORACOES].filter((f) => podeIrPara(f, 'quintal'));
  const ativo = caminhoAtivo(g);
  return {
    caminhos: DECORACOES_DO_QUINTAL
      .filter((f) => f.caminho && (f.caminho === 'lajes' || guardados.some((d) => d.id === f.id)))
      .map((f) => ({ id: f.id, nome: f.nome, icone: f.icone, ativo: f.caminho === ativo })),
    hera: !g.flag(FLAG_SEM_HERA),
    comRegador,
    itens: fichas
      .map((f) => ({ id: f.id, nome: f.nome, icone: f.icone, descricao: f.descricao, guardadas: guardados.filter((d) => d.id === f.id).length }))
      .filter((it) => it.guardadas > 0),
    noQuintal: lista.filter((d) => d.posta?.cena === 'quintal').length,
    aCaminho: lista.filter((d) => d.aCaminho).length,
  };
}

// ------------------------------------------------- o caminho, a hera e a árvore

const ESTILOS: readonly EstiloDeCaminho[] = ['lajes', 'pedras', 'tijolinho', 'dormentes', 'portuguesa'];
const flagDoCaminho = (e: EstiloDeCaminho): string => `quintal:caminho:${e}`;
/** a hera foi tirada dos muros */
export const FLAG_SEM_HERA = 'quintal:sem-hera';

/** o jeito do caminho da casa agora (o de lajes, se nunca trocaram) */
export function caminhoAtivo(g: GameAPI): EstiloDeCaminho {
  return ESTILOS.find((e) => g.flag(flagDoCaminho(e))) ?? 'lajes';
}

/** Troca o caminho da casa pelo da ficha `id` (um caminho que seja da dupla). Devolve o estilo, ou `null`. */
export function usarCaminho(g: GameAPI, id: string): EstiloDeCaminho | null {
  const ficha = DECORACOES_DO_QUINTAL.find((f) => f.id === id);
  if (!ficha?.caminho) return null;
  if (ficha.caminho !== 'lajes' && !g.decoracoes().some((d) => d.id === id && !d.aCaminho)) return null;
  for (const e of ESTILOS) g.setFlag(flagDoCaminho(e), e === ficha.caminho);
  return ficha.caminho;
}

/** Tira a hera dos muros, ou põe de volta; devolve se ela ficou. */
export function trocarHera(g: GameAPI): boolean {
  const tinha = !g.flag(FLAG_SEM_HERA);
  g.setFlag(FLAG_SEM_HERA, tinha);
  return !tinha;
}

/**
 * A ÁRVORE DA CASA vira peça do quintal na primeira visita: entra no save já
 * posta no lugar de sempre, e daí em diante é do decorador (guardar, mudar
 * de lugar, pôr de volta).
 */
export function plantarAArvoreDaCasa(g: GameAPI, onde: { x: number; z: number }): void {
  if (g.flag('quintal:arvore-da-casa')) return;
  const lista = g.decoracoes();
  const uid = lista.reduce((m, d) => Math.max(m, d.uid), 0) + 1;
  g.salvarDecoracoes([...lista, { uid, id: 'quintal-arvore-florida', posta: { x: onde.x, z: onde.z, giro: 0, cena: 'quintal' } }]);
  g.setFlag('quintal:arvore-da-casa');
}
