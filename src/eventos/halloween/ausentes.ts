import * as THREE from 'three';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { fundir } from '../../world/fundir';
import { plaquinhaDeRecado, type Recado } from '../../world/halloween/pecas';
import { quemFoiSeArrumar } from './fase';
import { fantasiarQuemEstaAqui } from './fantasiados';

/*
 * QUEM FOI SE ARRUMAR (`docs/HALLOWEEN.md`, §4.1): na fase `convite` os
 * personagens não estão no parque, no clube nem na escola — e no posto de
 * cada um fica uma plaquinha de recado, que dá para ler.
 *
 * É CAMADA (§8.3): o personagem continua sendo montado pela cena do jeito de
 * sempre, com o mesmo código. Esta chamada, no fim da cena, só o ESCONDE
 * (e cala) e desliga as conversas dele, a cada quadro — depois de tudo o que
 * a cena liga e desliga sozinha. Sem o `?halloween`, ou fora do `convite`,
 * ela não faz nada.
 */

/** um bicho de posto: o corpo e o barulho dele */
export interface Ausente {
  group: THREE.Object3D;
  aoSoar?: (() => void) | null;
}

export interface RecadoNoPosto {
  /** o recado (ou os recados, numa plaquinha só) */
  recados: readonly Recado[];
  /** quem "fala" o recado quando a dupla lê */
  autor: string;
  x: number;
  z: number;
  giro: number;
  /** `cavalete` no chão (o padrão), ou `pendurada`/`parede` numa altura `y` */
  modo?: 'cavalete' | 'pendurada' | 'parede';
  y?: number;
  /** onde fica o "Ler o recado", se não for na frente da plaquinha */
  lerEm?: { x: number; z: number };
  /** sem colisor (a plaquinha pregada numa parede ou num balcão) */
  semColisor?: boolean;
}

export interface QuemSaiu {
  bichos?: ReadonlyArray<Ausente | null | undefined>;
  /**
   * os bichos pela etiqueta (`userData.peca`: `gatito`, `flynn`, `luna`…),
   * para quem a cena monta dentro de uma função e não guarda
   */
  etiquetas?: readonly string[];
  /** os `id` das interações que dependem de quem saiu; `prefixo*` pega todas que começam assim */
  interacoes?: readonly string[];
  recados?: readonly RecadoNoPosto[];
}

/** O que a cena precisa saber: hoje é dia de se arrumar? */
export { quemFoiSeArrumar };

export function ausentarNaCena(w: WorldBuilder, quem: QuemSaiu): boolean {
  // na festa, quem está aqui está fantasiado (a mesma chamada do fim da cena)
  fantasiarQuemEstaAqui(w);
  if (!quemFoiSeArrumar(w.game)) return false;
  const bichos = (quem.bichos ?? []).filter((b): b is Ausente => !!b);
  const ids = quem.interacoes ?? [];
  const desliga = (id: string | undefined): boolean =>
    !!id && ids.some((i) => (i.endsWith('*') ? id.startsWith(i.slice(0, -1)) : id === i));
  const etiquetas = quem.etiquetas ?? [];
  const esconder = (): void => {
    if (etiquetas.length) {
      for (const o of w.root.children) {
        const b = o.userData?.bicho as Ausente | undefined;
        if (b && etiquetas.includes(o.userData.peca)) {
          o.visible = false;
          b.aoSoar = null;
        }
      }
    }
    for (const b of bichos) {
      b.group.visible = false;
      if ('aoSoar' in b) b.aoSoar = null;
    }
    for (const it of w.interactables) if (desliga(it.id)) it.enabled = false;
  };
  esconder();
  // a cena liga e desliga as conversas sozinha (o Cookie anda, a Luna aparece):
  // isto roda DEPOIS de tudo dela, todo quadro
  w.onUpdate(esconder);

  for (const r of quem.recados ?? []) {
    const placa = fundir(plaquinhaDeRecado(r.recados, { modo: r.modo ?? 'cavalete' }));
    placa.position.set(r.x, r.y ?? 0, r.z);
    placa.rotation.y = r.giro;
    w.add(placa);
    if (!r.semColisor && (r.modo ?? 'cavalete') === 'cavalete') w.blockCircle(r.x, r.z, 0.35);
    const ler = r.lerEm ?? { x: r.x + Math.sin(r.giro) * 0.7, z: r.z + Math.cos(r.giro) * 0.7 };
    w.interact({
      id: `halloween:recado-${r.autor}`,
      x: ler.x, z: ler.z, radius: 1.5,
      label: 'Ler o recado', icon: '📝',
      highlight: placa,
      priority: 3,
      onInteract: async (g) => {
        for (const rec of r.recados) await g.say([rec.texto.replace(/\n/g, ' ')], rec.quem ?? r.autor);
      },
    });
  }
  return true;
}
