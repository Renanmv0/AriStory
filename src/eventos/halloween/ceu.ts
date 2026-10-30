import { PALETTE as P } from '../../palette';
import { NOITE, type MomentoDoCeu } from '../../world/noite';

/**
 * O CÉU DA NOITE DA FESTA (`docs/HALLOWEEN.md`, §2.4.1 A): a noite da
 * clareira com o luar vindo do lado da câmera (de trás, tudo ficaria de
 * frente na sombra). O parque e a clareira da Casinha da Abóbora usam o mesmo.
 */
export const NOITE_DA_FESTA: MomentoDoCeu = { ...NOITE, dirSol: [13, 20, 11], sol: P.luarDaFesta, forcaSol: 0.52, forcaAmbiente: 0.72 };
