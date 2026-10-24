import type { VozDaFala } from '../core/types';
import { ARI, RENAN } from './cast';
import { Mano } from '../entities/bichos/Mano';
import { Cookie } from '../entities/bichos/Cookie';
import { Gina } from '../entities/bichos/Gina';
import { Capy } from '../entities/bichos/Capy';
import { Noel } from '../entities/bichos/Noel';
import { Walter } from '../entities/bichos/Walter';
import { Josefina } from '../entities/bichos/Josefina';
import { Estella } from '../entities/bichos/Estella';
import { JeanLuc } from '../entities/bichos/JeanLuc';
import { Gatito } from '../entities/bichos/Gatito';
import { Flynn } from '../entities/bichos/Flynn';
import { Pelusa } from '../entities/bichos/Pelusa';
import { FICHA_DA_LUNA, FICHA_DA_SOL, FICHA_DA_ESTRELLA } from '../entities/bichos/CoelhaDaTorcida';

/**
 * TODAS AS VOZES DO JOGO, numa lista só: quem fala e a cor da caixa de fala
 * dele (sugestão do Ari — cada personagem com a sua cor, e SÓ na fala).
 *
 * A cor mora no código de cada personagem (a ficha do Ari e do Renan, o
 * `static voz` de cada bicho, a ficha de cada coelhinha); aqui só se junta. A
 * fala acha a voz pelo NOME que a cena passa para `g.say` — o mesmo nome que
 * aparece na etiqueta. Personagem novo que fala: declare a `voz` dele e
 * ponha aqui. Nome que não está na lista fala no rosa de sempre.
 */
export const VOZES: ReadonlyArray<VozDaFala> = [
  { nome: ARI.name, cor: ARI.corDaFala },
  { nome: RENAN.name, cor: RENAN.corDaFala },
  Mano.voz,
  Cookie.voz,
  Gina.voz,
  Capy.voz,
  Noel.voz,
  Walter.voz,
  Josefina.voz,
  Estella.voz,
  JeanLuc.voz,
  Gatito.voz,
  Flynn.voz,
  Pelusa.voz,
  FICHA_DA_LUNA.voz,
  FICHA_DA_SOL.voz,
  FICHA_DA_ESTRELLA.voz,
];
