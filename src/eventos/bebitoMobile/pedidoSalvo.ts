import type { GameAPI } from '../../core/types';
import { SENTIDOS, type PedidoDeViagem } from './rota';
/** Reabrir a estrada mantém o destino e o motorista; o percurso reinicia. */
export function guardarPedido(g: GameAPI, p: PedidoDeViagem): void {
  for (const sentido of SENTIDOS) g.setFlag(`bebito:rota-${sentido}`, sentido === p.sentido);
  g.setFlag('bebito:viagem-renan-dirige', p.motorista === 'renan');
  g.bump('bebito:viagem-semente', p.semente - g.stat('bebito:viagem-semente'));
  g.setFlag('bebito:viagem-em-andamento');
}
export function pedidoSalvo(g: GameAPI): PedidoDeViagem | null {
  if (!g.flag('bebito:viagem-em-andamento')) return null;
  return { sentido: SENTIDOS.find(s => g.flag(`bebito:rota-${s}`)) ?? 'ida',
    motorista: g.flag('bebito:viagem-renan-dirige') ? 'renan' : 'ari', semente: g.stat('bebito:viagem-semente') || 1 };
}
