import type { GameAPI } from '../../core/types';
import { ARI, RENAN } from '../../characters/cast';
import { pedirViagem, type Sentido } from './rota';

/**
 * SAIR DE CARRO: a pergunta que toda viagem faz — "quem dirige dessa vez?" —
 * e a partida para a estrada (`scenes/viagemDeCarro.ts`). Quem dirige senta
 * no lugar do motorista, seja quem for que o jogador controla; a semente da
 * rota é o número da viagem, então cada uma sai diferente.
 *
 * Devolve `false` se eles desistiram na pergunta.
 */
export async function sairDeCarro(g: GameAPI, sentido: Sentido): Promise<boolean> {
  const vai = await g.ask(
    sentido === 'ida' ? 'Ir de carro pro Villa Lobos?' : 'Voltar pra casa de carro?',
    ['Vamos!', 'Agora não'],
  );
  if (vai !== 0) return false;
  const quem = await g.ask('Quem dirige dessa vez?', [ARI.name, RENAN.name]);
  const motorista = quem === 0 ? ARI : RENAN;
  const carona = quem === 0 ? RENAN : ARI;
  await g.say(['Eu dirijo!'], motorista.name);
  await g.say([quem === 0 ? 'Então eu escolho a música.' : 'Então eu vou olhando a paisagem.'], carona.name);
  pedirViagem({ sentido, motorista: motorista.id, semente: g.bump('bebito:viagens') });
  g.som('portaDoBebito');
  g.goTo('viagem-de-carro');
  return true;
}
