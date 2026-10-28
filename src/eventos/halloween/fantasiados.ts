import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Bicho } from '../../entities/bichos/Bicho';
import type { Mano } from '../../entities/bichos/Mano';
import type { Cookie } from '../../entities/bichos/Cookie';
import type { JeanLuc } from '../../entities/bichos/JeanLuc';
import type { PatoDoLago } from '../../entities/bichos/PatoDoLago';
import {
  fantasiarCookieDeFantasma, fantasiarJeanLucDaOpera, fantasiarManoDeVampiro, fantasiarPatoDeDiabinho,
} from '../../world/halloween/fantasiasDoParque';
import {
  fantasiarCapyDeTubarao, fantasiarGinaDeNoiva, fantasiarJosefinaDeDragao, fantasiarNoelCientista, fantasiarWalterDeMumia,
} from '../../world/halloween/fantasiasDoClube';
import { eventoLiberado, faseDoHalloween } from './fase';

/*
 * QUEM ESTÁ FANTASIADO (`docs/HALLOWEEN.md`, §3): na festa (e no depois
 * dela), cada personagem veste a fantasia dele ONDE ESTIVER — achado pela
 * etiqueta do bicho (`userData.peca`), em qualquer cena. É uma chamada só,
 * no fim da cena (o parque, o clube, o Mania, a estufa, a escola), e ela
 * não sabe nem precisa saber de onde cada um é.
 */

/** cada etiqueta de bicho e a fantasia dele */
const FANTASIAS: Record<string, (b: Bicho) => unknown> = {
  mano: (b) => fantasiarManoDeVampiro(b as Mano),
  cookie: (b) => fantasiarCookieDeFantasma(b as Cookie),
  'jean-luc': (b) => fantasiarJeanLucDaOpera(b as JeanLuc),
  'pato-do-lago': (b) => fantasiarPatoDeDiabinho(b as PatoDoLago, false),
  patinho: (b) => fantasiarPatoDeDiabinho(b as PatoDoLago, true),
  girafa: fantasiarGinaDeNoiva,
  capy: fantasiarCapyDeTubarao,
  noel: fantasiarNoelCientista,
  josefina: fantasiarJosefinaDeDragao,
  'garcom-canino': fantasiarWalterDeMumia,
};

/** a festa está acontecendo (é de noite e todo mundo está fantasiado) */
export function naFesta(w: WorldBuilder): boolean {
  const fase = faseDoHalloween(w.game);
  return eventoLiberado() && (fase === 'festa' || fase === 'depois');
}

/** Veste quem está nesta cena. Devolve quantos vestiu (para o teste). */
export function fantasiarQuemEstaAqui(w: WorldBuilder): number {
  if (!naFesta(w)) return 0;
  const achados: Array<[Bicho, (b: Bicho) => unknown]> = [];
  w.root.traverse((o) => {
    const vestir = FANTASIAS[o.userData?.peca as string];
    const bicho = o.userData?.bicho as Bicho | undefined;
    if (vestir && bicho && bicho.group === o && !o.userData.fantasiado) achados.push([bicho, vestir]);
  });
  for (const [bicho, vestir] of achados) {
    vestir(bicho);
    bicho.group.userData.fantasiado = true;
  }
  return achados.length;
}
