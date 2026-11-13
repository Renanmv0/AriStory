import type { GameAPI } from '../../core/types';
import { ARI, RENAN } from '../../characters/cast';
import { destinoDaRota, pedirViagem, type DestinoDeCarro, type Sentido } from './rota';
import { guardarPedido } from './pedidoSalvo';

/** O mesmo menu em casa e nos estacionamentos: só oferece os outros lugares. */
export async function escolherDestinoDeCarro(g: GameAPI, origem: DestinoDeCarro): Promise<boolean> {
  const opcoes: Record<DestinoDeCarro, Array<{ nome: string; sentido: Sentido }>> = {
    casa: [{ nome: 'Parque Villa Lobos', sentido: 'ida' }, { nome: 'Clube', sentido: 'casa-clube' }],
    parque: [{ nome: 'Casa do Ari', sentido: 'volta' }, { nome: 'Clube', sentido: 'parque-clube' }],
    clube: [{ nome: 'Casa do Ari', sentido: 'clube-casa' }, { nome: 'Parque Villa Lobos', sentido: 'clube-parque' }],
  };
  const destinos = opcoes[origem];
  const escolha = await g.ask('Pra onde vamos de Bebito?', [...destinos.map(d => d.nome), 'Agora não']);
  return destinos[escolha] ? sairDeCarro(g, destinos[escolha].sentido, true) : false;
}

/**
 * SAIR DE CARRO: a pergunta que toda viagem faz — "quem dirige dessa vez?" —
 * e a partida para a estrada (`scenes/viagemDeCarro.ts`). Quem dirige senta
 * no lugar do motorista, seja quem for que o jogador controla; a semente da
 * rota é o número da viagem, então cada uma sai diferente.
 *
 * Devolve `false` se eles desistiram na pergunta.
 */
export async function sairDeCarro(g: GameAPI, sentido: Sentido, jaDecidiu = false): Promise<boolean> {
  // (de dentro do carro, quem escolheu "Viajar" no menu já decidiu: a primeira pergunta é pulada)
  if (!jaDecidiu) {
    const vai = await g.ask(
      destinoDaRota(sentido) === 'clube' ? 'Ir de carro pro clube?' : destinoDaRota(sentido) === 'parque' ? 'Ir de carro pro Villa Lobos?' : 'Voltar pra casa de carro?',
      ['Vamos!', 'Agora não'],
    );
    if (vai !== 0) return false;
  }
  const quem = await g.ask('Quem dirige dessa vez?', [ARI.name, RENAN.name]);
  const motorista = quem === 0 ? ARI : RENAN;
  const carona = quem === 0 ? RENAN : ARI;
  await g.say(['Eu dirijo!'], motorista.name);
  await g.say([quem === 0 ? 'Então eu escolho a música.' : 'Então eu vou olhando a paisagem.'], carona.name);
  const pedido = { sentido, motorista: motorista.id, semente: g.bump('bebito:viagens') };
  guardarPedido(g, pedido); pedirViagem(pedido);
  g.som('portaDoBebito');
  g.goTo('viagem-de-carro');
  return true;
}
