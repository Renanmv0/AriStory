import { PALETTE as P } from '../../palette';
import { Flynn, type FichaDeAtleta } from './Flynn';
import type { AreaDoBicho } from './Bicho';
import type { VozDaFala } from '../../core/types';
import { emblemaDosDogoes } from '../../world/uniformeDosDogoes';

/**
 * O ROCCO — o lobo capitão dos DOGÕES, a escola rival dos Gatitos, e o rival do Flynn (decisões do Renan,
 * 2026-11-19: um lobo inventado, de um time de cachorro de outra escola, vermelho e cinza, MARRENTO MAS GENTE BOA —
 * a rivalidade tem "algumas farpas", mas não é tóxica).
 *
 * É o MESMO ATLETA do Flynn (o corpo, a corrida, os gestos: `Flynn.ts`) com outra FICHA — e a ficha cuida de ele não
 * ser "um Flynn cinza". O que faz ele ser LIDO COMO LOBO, e diferente da raposa, de longe:
 *  - MAIOR (1,45 contra 1,35: o rival grandalhão);
 *  - a JUBA de pelo em volta do pescoço, saindo da gola;
 *  - o FOCINHO mais comprido e largo, as ORELHAS mais curtas e largas, mais em pé;
 *  - o RABO grosso, cinza, BAIXO (pendurado para trás e para baixo, e não o "J" para cima da raposa), com a ponta
 *    escura e abanando pouco;
 *  - o olho amarelo-dourado.
 * E o JEITO marrento: o meio sorriso de boca fechada, subindo de um lado só, com o caninho aparecendo, e a
 * sobrancelha deitada e grossa (segura de si).
 *
 * O UNIFORME dos Dogões: a regata vermelha com "DOGÕES" em arco e o número, "ROCCO" nas costas, o short cinza-chumbo,
 * a faixa de testa vermelha com o emblema (o D e as orelhas de cachorro CAÍDAS — a resposta às orelhinhas em pé dos
 * Gatitos), a braçadeira de capitão, a PLAQUINHA DE CACHORRO na corrente (no lugar do apito do Flynn) e o pin de
 * ossinho. O número 9, a plaquinha e o ossinho são PROVISÓRIOS (meus).
 */
export const FICHA_DO_ROCCO: FichaDeAtleta = {
  peca: 'rocco',
  semente: 20261119,
  escala: 1.45,
  pelo: P.roccoPelo,
  peloClaro: P.roccoPeloClaro,
  peloEscuro: P.roccoPeloEscuro,
  nariz: P.roccoNariz,
  olho: P.roccoOlho,
  pupila: P.roccoPupila,
  orelhaDentro: P.roccoOrelhaDentro,
  bochecha: P.roccoBochecha,
  lingua: P.lunaNariz,
  orelha: { raio: 0.07, alto: 0.13, abre: 0.17, ponta: 0.75 },
  focinho: { comprido: 1.32, largo: 1.12 },
  rabo: {
    gomos: [
      // (o primeiro gomo sai para trás e para BAIXO, em diagonal, e os outros mal dobram: o rabo de lobo pende, não
      // sobe como o da raposa; mais caído que isto, a ponta entrava no chão)
      { comp: 0.06, larg: 0.046, dobra: -2.35 },
      { comp: 0.075, larg: 0.068, dobra: 0.08 },
      { comp: 0.08, larg: 0.08, dobra: 0.1 },
      { comp: 0.078, larg: 0.076, dobra: 0.12 },
      { comp: 0.066, larg: 0.06, dobra: 0.16 },
    ],
    ponta: 'escura',
    abana: 0.35,
  },
  boca: 'de-lado',
  sobrancelha: { giro: Math.PI * 0.05, grossa: 0.0065 },
  juba: true,
  pingente: 'plaquinha',
  pin: 'osso',
  time: {
    principal: P.dogoesVermelho,
    escuro: P.dogoesCinza,
    detalhe: P.dogoesCinzaClaro,
    branco: P.dogoesBranco,
    creme: P.dogoesSola,
    tenisFaixa: P.dogoesVermelho,
    cordao: P.dogoesCorrente,
    nome: 'DOGÕES',
    costas: 'ROCCO',
    numero: '9',
    passoDoNome: 0.19,
    corDoNome: P.dogoesBranco,
    bandana: 'faixa-dos-dogoes',
    emblema: (r) => emblemaDosDogoes(r),
  },
};

export class Rocco extends Flynn {
  /** a voz dele na caixa de fala: o nome e o cinza de lobo (`vozes.ts`) */
  static override readonly voz: VozDaFala = { nome: 'Rocco', cor: P.falaRocco };

  constructor(area: AreaDoBicho) {
    super(area, FICHA_DO_ROCCO);
  }
}
