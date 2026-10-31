import type { GameAPI, ItemDef } from '../../core/types';
import { ehFantasia, fichaDoItem } from '../../world/itens';

/*
 * A ROUPA DE ANTES DA FANTASIA (`docs/HALLOWEEN.md`, etapa 7; decisão do
 * Renan: os dois deitam fantasiados e acordam "de roupa normal", com as
 * fantasias e as coroas guardadas no guarda-roupa).
 *
 * Na boutique, logo antes de a Estella vestir a fantasia, o corpo inteiro de
 * cada um vai para o guarda-roupa (`vestirConjunto`). Aqui a gente anota O
 * QUE ERA — as ids, por pessoa — e, na manhã do fim do evento, veste de
 * volta. Save de antes desta anotação (já tinha ganhado o presente) acorda
 * com tudo o que não é fantasia: é a roupa de sempre de quem não tinha nada.
 */

const CHAVE = 'halloween:roupa-de-antes';
const QUEM = ['ari', 'renan'] as const;

type Anotada = Partial<Record<(typeof QUEM)[number], string[]>>;

/** anota a roupa de agora dos dois (uma vez só: o presente pode ser revisto) */
export function anotarRoupaDeAntes(g: GameAPI): void {
  if (g.retomada(CHAVE)) return;
  const anotada: Anotada = {};
  for (const quem of QUEM) {
    anotada[quem] = g.wearables(quem).filter((p): p is ItemDef => !!p && !ehFantasia(p.id)).map((p) => p.id);
  }
  g.guardarRetomada(CHAVE, anotada);
}

/** veste a roupa de antes nos dois; a fantasia e a coroa vão para o guarda-roupa */
export function vestirARoupaDeAntes(g: GameAPI): void {
  const anotada = (g.retomada(CHAVE) ?? null) as Anotada | null;
  for (const quem of QUEM) {
    const ids = anotada?.[quem];
    const pecas = ids
      ? ids.map((id) => fichaDoItem(id)).filter((p): p is ItemDef => !!p && !ehFantasia(p.id))
      : g.wearables(quem).filter((p): p is ItemDef => !!p && !ehFantasia(p.id));
    g.vestirConjunto(pecas, quem);
  }
}
