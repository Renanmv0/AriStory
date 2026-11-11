import type { SceneDef } from '../core/types';
import { casa } from './casa';
import { casinhaDaAbobora, casinhaDaAboboraDentro, casinhaDaAboboraSalao } from './casinhaDaAbobora';
import { lojinha } from './lojinha';
import { clube } from './clube';
import { escola } from './escola';
import { escolaGinasio } from './escolaGinasio';
import { escolaDescanso, escolaProfessores, escolaSala1, escolaSala2 } from './escolaSalas';
import { estufa } from './estufa';
import { frenteDaCasa } from './frenteDaCasa';
import { viagemDeCarro } from './viagemDeCarro';
import { laboratorio } from './laboratorio';
import { maniaDeChurrasco } from './maniaDeChurrasco';
import { quarto } from './quarto';
import { villaLobos } from './villaLobos';

/**
 * Registro de cenas. Para adicionar um cenario novo:
 *   1. crie src/scenes/<nome>.ts exportando um SceneDef
 *   2. importe e registre aqui
 *   3. ligue as duas pontas com w.door() nas duas cenas
 */
export const SCENES: Record<string, SceneDef> = {
  [casa.id]: casa,
  [quarto.id]: quarto,
  [villaLobos.id]: villaLobos,
  // a frente da casa do Ari (o jardim e a garagem do Bebito Mobile). Só se chega com a
  // chave do carro ligada (`eventos/BebitoMobile.ts`): sem ela, a porta da casa sai no parque
  [frenteDaCasa.id]: frenteDaCasa,
  [clube.id]: clube,
  [estufa.id]: estufa,
  [maniaDeChurrasco.id]: maniaDeChurrasco,
  [lojinha.id]: lojinha,
  // a Escola do Gatito: o saguão e as salas atrás de cada porta. Chega-se de
  // ônibus, depois de conhecer a Luna no Villa Lobos (ver docs/ESCOLA.md)
  [escola.id]: escola,
  [escolaSala1.id]: escolaSala1,
  [escolaSala2.id]: escolaSala2,
  [escolaDescanso.id]: escolaDescanso,
  [escolaProfessores.id]: escolaProfessores,
  [escolaGinasio.id]: escolaGinasio,
  // o mundo dentro do computador do Ari: a área de teste das skills de
  // Three.js. Só se chega pela tela da escrivaninha do quarto
  [laboratorio.id]: laboratorio,
  // o final do especial de Halloween: a clareira atrás do portão laranja do
  // Villa Lobos. Só se chega pelo portão, na noite da festa (docs/HALLOWEEN.md §7.1)
  [casinhaDaAbobora.id]: casinhaDaAbobora,
  [casinhaDaAboboraDentro.id]: casinhaDaAboboraDentro,
  [casinhaDaAboboraSalao.id]: casinhaDaAboboraSalao,
  // a estrada entre a casa do Ari e o Villa Lobos (o Bebito Mobile): só se chega
  // saindo de carro, e o carro só existe com a chave dele (`eventos/BebitoMobile.ts`)
  [viagemDeCarro.id]: viagemDeCarro,
};

export const CENA_INICIAL = casa.id;
