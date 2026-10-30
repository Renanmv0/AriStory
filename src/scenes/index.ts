import type { SceneDef } from '../core/types';
import { casa } from './casa';
import { casinhaDaAbobora, casinhaDaAboboraDentro, casinhaDaAboboraSalao } from './casinhaDaAbobora';
import { lojinha } from './lojinha';
import { clube } from './clube';
import { escola } from './escola';
import { escolaGinasio } from './escolaGinasio';
import { escolaDescanso, escolaProfessores, escolaSala1, escolaSala2 } from './escolaSalas';
import { estufa } from './estufa';
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
};

export const CENA_INICIAL = casa.id;
