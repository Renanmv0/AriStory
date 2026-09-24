import { PRAGAS, type FichaDePraga } from '../../world/bichosDoJardim';

/**
 * AS PRAGAS NO LIVRO — a aba de pragas do livro da bancada (pedido do Renan).
 *
 * Cada praga fica CINZA no livro até a primeira vez que aparece numa rodada;
 * a partir daí, o retrato, o nome e uma descrição curta. Quem marca é a
 * rodada, no nascimento do bicho (`jardim.viu-<id>`, uma flag do save).
 *
 * As descrições dizem o JEITO de cada uma — o truque tirado do desenho, que é
 * a única coisa que o jogador precisa saber dela (a tabela "O jeito de cada
 * bicho", em `rodada.ts`).
 */

export const flagDaPraga = (id: string): string => `jardim.viu-${id}`;

export const NOME_DO_TIER: Record<FichaDePraga['tier'], string> = {
  fraco: 'fraca', medio: 'média', tanque: 'grandona', chefe: 'chefe',
};

export const DESCRICAO_DA_PRAGA: Record<string, string> = {
  lagartejo: 'A mais comum: anda até o canteiro mais perto e come. Dois jatos e ela desiste.',
  gafanhopo: 'Pula de tempo em tempo — e, no ar, a água não pega.',
  libelagarto: 'Voa uns dois segundos, alto e mais rápido que os outros.',
  formigurico: 'Vem em fila de três. Um jato só espanta cada uma.',
  coelhatu: 'Meio molhado, vira bolinha e rola um tiquinho.',
  tucanguru: 'Antes do portão, pula para o portão do lado.',
  tamandubelha: 'Aspira as gotas do chão — e devolve tudo quando foge.',
  mosquipotamo: 'Vai beber no tonel: enquanto ela bebe, ninguém enche o regador ali.',
  preguipolvo: 'Lento e pesado: demora para chegar, mas morde forte.',
  rinocaracol: 'Meio molhado, se fecha na concha uns três segundos.',
  javaponja: 'Incha com a água, fica lenta e deixa poça por onde passa.',
  'mae-lagartejo': 'A chefe da primeira leva. Solta filhotes pelo caminho.',
  escorpicamelo: 'A chefe da segunda leva. Bebe o tonel e, com meia vida, murcha e corre.',
};

/** as pragas na ordem do livro: a do catálogo, que já é a do tier */
export function pragasDoLivro(): readonly FichaDePraga[] {
  return PRAGAS;
}
