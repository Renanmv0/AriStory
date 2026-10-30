import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { ENTRADAS_DA_CLAREIRA, montarAClareira } from '../eventos/halloween/naCasinha';

/**
 * A CASINHA DA ABÓBORA (o final do especial de Halloween, `docs/HALLOWEEN.md`
 * §7.1): a clareira atrás do portão laranja do Villa Lobos, de noite. Só se
 * chega pelo portão, e o portão só existe na noite da festa (`?halloween`).
 * Tudo mora em `eventos/halloween/naCasinha.ts`; as peças, em
 * `world/halloween/casinhaDaAbobora.ts`.
 */
export const casinhaDaAbobora: SceneDef = {
  id: 'casinha-da-abobora',
  name: 'Casinha da Abóbora',
  subtitle: 'atrás da roda gigante',
  // a câmera fica a 60 do alvo: a névoa do céu só pode começar bem depois disso (o padrão)
  ambient: { sky: P.ceuNoiteAlto, fog: P.ceuNoiteBaixo },
  spawn: ENTRADAS_DA_CLAREIRA['do-parque'],
  entries: { ...ENTRADAS_DA_CLAREIRA },
  build(w) {
    montarAClareira(w);
  },
};
