import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { claridade, flat } from '../../core/materials';
import type { WorldBuilder } from '../../world/WorldBuilder';

/*
 * A CASA DO ARI DE MADRUGADA, depois da festa (`docs/HALLOWEEN.md`, a etapa 7;
 * decisão do Renan: "de noite").
 *
 * Na fase `depois` a dupla chega em casa já passada a meia-noite: a sala e o
 * quarto ficam na penumbra azul, a janela escura, o luar entrando por ela no
 * lugar da claridade morna do dia, e só o abajur aceso (ele já nasce aceso).
 * Nenhuma luz nova: é o mesmo sol e o mesmo céu da cena, com outras cores, pelo
 * `g.luzDoCeu` — e o vidro e a claridade trocam de material numa malha que já
 * é só deles (`fundir` separa por material).
 *
 * O EVENTO É UMA CAMADA (§8.3): a cena só empresta a janela e a claridade, e
 * nada do que ela monta muda. `amanhecer()` devolve tudo como era — é o que
 * a manhã do fim do evento chama, por baixo da cortina do sono.
 */

/** o que a cena empresta: as janelas (com o vidro dentro) e as claridades do chão */
export interface JanelasDaCasa {
  janelas: readonly THREE.Object3D[];
  claridades: readonly THREE.Object3D[];
}

export interface NoiteEmCasa {
  /** volta o dia: o céu da cena, o vidro claro e a claridade morna */
  amanhecer(): void;
  /** a casa está de noite agora? */
  deNoite(): boolean;
}

/** o vidro de sempre da `windowFrame` (o material é cacheado: dá para achar pela identidade) */
const vidroDoDia = (): THREE.Material => flat(P.glass, 0.55);

export function anoitecerEmCasa(w: WorldBuilder, { janelas, claridades }: JanelasDaCasa): NoiteEmCasa {
  const g0 = w.game;
  const trocas: Array<{ malha: THREE.Mesh; dia: THREE.Material }> = [];
  for (const janela of janelas) {
    janela.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material === vidroDoDia()) {
        trocas.push({ malha: m, dia: m.material });
        m.material = flat(P.vidroDeNoite, 0.9);
      }
    });
  }
  for (const c of claridades) {
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const dia = m.material as THREE.MeshBasicMaterial;
      trocas.push({ malha: m, dia });
      // o luar é mais fraco que o sol: a mesma mancha, azul e a dois terços
      m.material = claridade(P.luarNaJanela, +(dia.opacity * 0.65).toFixed(3));
    });
  }

  let noite = true;
  // o céu de noite entra no primeiro quadro (no `build` a cena ainda não pôs o dela)
  let posto = false;
  w.onUpdate(() => {
    if (posto || !noite) return;
    posto = true;
    g0.luzDoCeu({
      sky: P.noiteEmCasaCeu,
      ambientColor: P.noiteEmCasaAmbiente,
      ambientIntensity: 0.62,
      sunColor: P.noiteEmCasaLuar,
      sunIntensity: 0.32,
    });
  });

  return {
    deNoite: () => noite,
    amanhecer: () => {
      if (!noite) return;
      noite = false;
      for (const { malha, dia } of trocas) malha.material = dia;
      g0.luzDoCeu(null);
    },
  };
}
