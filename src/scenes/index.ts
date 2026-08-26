import type { SceneDef } from '../core/types';
import { casa } from './casa';
import { clube } from './clube';
import { villaLobos } from './villaLobos';

/**
 * Registro de cenas. Para adicionar um cenario novo:
 *   1. crie src/scenes/<nome>.ts exportando um SceneDef
 *   2. importe e registre aqui
 *   3. ligue as duas pontas com w.door() nas duas cenas
 */
export const SCENES: Record<string, SceneDef> = {
  [casa.id]: casa,
  [villaLobos.id]: villaLobos,
  [clube.id]: clube,
};

export const CENA_INICIAL = casa.id;
