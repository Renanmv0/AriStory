import type { GameAPI } from '../../core/types';
import { CHAVE_DO_PREMIO, premiosPendentes } from '../../minigames/portaria/premios';
import { PREMIOS_DA_PORTARIA } from '../../world/itens';

/** Tudo fica salvo antes da apresentação: recarregar não perde ou duplica uma peça. */
export function concederPremiosDaGina(g: Pick<GameAPI, 'stat' | 'flag' | 'setFlag' | 'ganharPeca' | 'unlock'>): number[] {
  const dias = premiosPendentes(g);
  for (const n of dias) {
    for (const peca of PREMIOS_DA_PORTARIA[n]) g.ganharPeca(peca);
    g.setFlag(CHAVE_DO_PREMIO(n));
    if (n === 6) g.unlock({ id: 'uniforme-da-portaria', title: 'O uniforme da Gina', place: 'Clube',
      note: 'Três estrelas no sábado da portaria. A Gina presenteou os dois com o uniforme completo, com girafinha, estrelinhas e um coração nas costas.', icon: '👔' });
  }
  return dias;
}
