import type { SceneDef } from '../core/types';
import { casa } from './casa';
import { clube } from './clube';
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
  [maniaDeChurrasco.id]: maniaDeChurrasco,
};

export const CENA_INICIAL = casa.id;
