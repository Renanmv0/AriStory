import type { GameAPI } from '../core/types';
import type { ConteudoDoBau, ConteudoDoComputador } from '../ui/painelDoQuintal';
import { DECORACOES, decoracaoPorId, podeIrPara } from '../world/decoracoes';
import { DECORACOES_DO_QUINTAL } from '../world/decoracoesDoQuintal';

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
    itens: DECORACOES_DO_QUINTAL.map((f) => {
      const minhas = lista.filter((d) => d.id === f.id);
      return {
        id: f.id, nome: f.nome, icone: f.icone, descricao: f.descricao, categoria: f.categoria, reais: f.reais,
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
  const ficha = DECORACOES_DO_QUINTAL.find((f) => f.id === id);
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
export function conteudoDoBau(g: GameAPI): ConteudoDoBau {
  const lista = g.decoracoes();
  const guardados = lista.filter((d) => !d.posta && !d.aCaminho);
  const fichas = [...DECORACOES_DO_QUINTAL, ...DECORACOES].filter((f) => podeIrPara(f, 'quintal'));
  return {
    itens: fichas
      .map((f) => ({ id: f.id, nome: f.nome, icone: f.icone, descricao: f.descricao, guardadas: guardados.filter((d) => d.id === f.id).length }))
      .filter((it) => it.guardadas > 0),
    noQuintal: lista.filter((d) => d.posta?.cena === 'quintal').length,
    aCaminho: lista.filter((d) => d.aCaminho).length,
  };
}
