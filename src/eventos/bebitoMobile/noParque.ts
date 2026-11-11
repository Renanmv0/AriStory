import type { Interactable } from '../../world/Interactable';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { ARI, RENAN } from '../../characters/cast';
import { BEBITO_MOBILE, BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';
import { fundir } from '../../world/fundir';
import { FASES_DO_PRESENTE, FLAG_DO_CARRO_NO_PARQUE, bebitoMobileNestaPagina } from '../BebitoMobile';
import { sairDeCarro } from './partida';

/**
 * O BEBITO MOBILE NO VILLA LOBOS: quando a dupla chega de carro, ele fica
 * estacionado na rua do ônibus, atrás do ônibus do ponto, de nariz para o
 * mesmo lado. É por ele que se volta para casa: a porta de sempre do portão
 * ("Voltar pra casa") dá lugar a um lembrete — quem veio de carro não volta
 * a pé e deixa o carro na rua.
 *
 * A cena do parque só faz UMA chamada (o molde de camada do Halloween), e
 * empresta a porta dela. Sem a chave do carro, ou com o carro em casa, isto
 * não monta nada.
 */

/** onde ele estaciona, e onde a dupla desce (a entrada `do-carro` da cena) */
export const VAGA_NO_PARQUE = { x: 37.95, z: 0.6 } as const;
export const DESCIDA_NO_PARQUE = { x: 35.2, z: 1.6, facing: 0 } as const;

export function montarBebitoNoParque(w: WorldBuilder, cena: { voltarPraCasa: Interactable }): void {
  const g = w.game;
  if (!bebitoMobileNestaPagina() || !g.flag(FASES_DO_PRESENTE.ganhou) || !g.flag(FLAG_DO_CARRO_NO_PARQUE)) return;
  const A = ARI.name;
  const R = RENAN.name;
  const carro = new BebitoMobile(g.fichaDoBebitoMobile());
  w.add(fundir(w.place(carro.group, VAGA_NO_PARQUE.x, 0, VAGA_NO_PARQUE.z)));
  w.onUpdate((dt) => carro.update(dt));
  w.blockBox(VAGA_NO_PARQUE.x, VAGA_NO_PARQUE.z, BEBITO_MOBILE.largura / 2 - 0.08, BEBITO_MOBILE.comprimento / 2 - 0.1);
  w.interact({
    id: 'parque:bebito-mobile',
    x: VAGA_NO_PARQUE.x - BEBITO_MOBILE.largura / 2 - 0.7, z: VAGA_NO_PARQUE.z, radius: 2.2,
    label: 'Voltar pra casa de carro', icon: '🚙',
    highlight: carro.group,
    priority: 2,
    onInteract: async () => {
      await sairDeCarro(g, 'volta');
    },
  });
  // o portão de sempre vira lembrete: o carro ficou na rua do ônibus
  cena.voltarPraCasa.enabled = false;
  w.interact({
    id: 'parque:de-carro',
    x: cena.voltarPraCasa.x, z: cena.voltarPraCasa.z, radius: 2.2,
    label: 'Voltar pra casa', icon: '🏠',
    onInteract: async () => {
      await g.say(['A pé? A gente veio de Bebito Mobile.'], R);
      await g.say(['Ele ficou lá na rua do ônibus. Vamos buscar.'], A);
    },
  });
}
