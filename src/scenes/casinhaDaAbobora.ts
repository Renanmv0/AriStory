import type { SceneDef } from '../core/types';
import { PALETTE as P } from '../palette';
import { ENTRADAS_DA_CLAREIRA, montarAClareira } from '../eventos/halloween/naCasinha';
import { ENTRADAS_DE_DENTRO, montarODentro } from '../eventos/halloween/dentroDaCasinha';
import { CENA_DO_SALAO, ENTRADAS_DO_SALAO, LUZ_DA_FESTA, montarOSalao } from '../eventos/halloween/noSalao';

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

/**
 * A CASINHA POR DENTRO (§7.1, C e D): o corredor e a cozinha da bruxa. Só se
 * chega pela porta da casinha torta, na clareira.
 */
export const casinhaDaAboboraDentro: SceneDef = {
  id: 'casinha-da-abobora-dentro',
  name: 'Casinha da Abóbora',
  subtitle: 'o corredor e a cozinha',
  ambient: {
    sky: P.dentroFundo,
    indoor: true,
    ambientColor: P.dentroAmbiente,
    ambientIntensity: 0.95,
    sunColor: P.dentroLuz,
    sunIntensity: 0.55,
    sunDir: [6, 12, 8],
  },
  spawn: ENTRADAS_DE_DENTRO['da-clareira'],
  entries: { ...ENTRADAS_DE_DENTRO },
  build(w) {
    montarODentro(w);
  },
};

/**
 * O SALÃO DA ABÓBORA (§7.1, E): por dentro da abóbora gigante, a festa
 * surpresa. Só se chega pela porta grande da cozinha da bruxa. A luz da cena
 * é a da festa; antes da surpresa, a cena apaga tudo no primeiro quadro.
 */
export const casinhaDaAboboraSalao: SceneDef = {
  id: CENA_DO_SALAO,
  name: 'Casinha da Abóbora',
  subtitle: 'o salão',
  ambient: LUZ_DA_FESTA,
  spawn: ENTRADAS_DO_SALAO['da-cozinha'],
  entries: { ...ENTRADAS_DO_SALAO },
  build(w) {
    montarOSalao(w);
  },
};
