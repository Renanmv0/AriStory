import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import type { Pelusa } from '../../entities/bichos/Pelusa';
import { ARI, RENAN } from '../../characters/cast';
import { avancarFase, faseDoHalloween, pelusaNaBoutique } from './fase';
import { anoitecerEmCasa, type NoiteEmCasa } from './casaDeNoite';
import { vestirARoupaDeAntes } from './roupaDeAntes';

/*
 * O FIM DO ESPECIAL DE HALLOWEEN, no quarto do Ari (`docs/HALLOWEEN.md`, a
 * etapa 7).
 *
 * - Do convite até a noite de sono, o Pelusa está na boutique da Estella
 *   (dormindo no pufe, de morceguinho): o quarto fica sem ele.
 * - Na fase `depois` (a dupla volta da festa de madrugada), o quarto está DE
 *   NOITE (`casaDeNoite.ts`) e a cama troca o "Deitar na cama" pelo
 *   "Dormir depois da festa". É ele que acaba o evento: os dois deitam
 *   fantasiados e coroados, conversam, o abajur apaga e a tela vai para o
 *   sono. Por baixo da cortina, a fase vira `fim`, a casa amanhece, os dois
 *   trocam a fantasia pela roupa de antes (a fantasia e a coroa ficam no
 *   guarda-roupa — decisão do Renan) e o Pelusa volta para casa. Eles
 *   acordam com o sol entrando pela janela, conversam, e levantam: daqui em
 *   diante o parque, o clube e a escola são os de sempre.
 *
 * O EVENTO É UMA CAMADA (§8.3): a cena empresta as peças e o jeito de deitar
 * os dois, e a única coisa que muda nela é qual interação da cama vale.
 */

/** o que o quarto empresta para o evento */
export interface PecasDoQuarto {
  pelusa: Pelusa;
  /** o "Fazer carinho no Pelusa" */
  carinho: Interactable;
  /** a cama (a peça, para o destaque do prompt) */
  cama: THREE.Object3D;
  /** o "Deitar na cama" de sempre */
  deitarNaCama: Interactable;
  /** os dois deitam lado a lado, com a câmera em cima (resolve deitados) */
  deitarOsDois(g: GameAPI): Promise<void>;
  /** os dois levantam ao lado da cama, e a câmera volta */
  levantarOsDois(g: GameAPI): void;
  /** acende ou apaga o abajur do criado-mudo */
  ligarAbajur(aceso: boolean): void;
  /** a janela (com o vidro) e a claridade que ela joga no chão */
  janelas: readonly THREE.Object3D[];
  claridades: readonly THREE.Object3D[];
}

/** a memória da manhã seguinte */
export const MEMORIA_DO_FIM = 'o-dia-seguinte';

export function montarHalloweenNoQuarto(w: WorldBuilder, pecas: PecasDoQuarto): void {
  const g0 = w.game;
  const { pelusa, carinho } = pecas;
  const somDoPelusa = pelusa.aoSoar;

  if (pelusaNaBoutique(g0)) {
    pelusa.group.visible = false;
    pelusa.aoSoar = null;
    carinho.enabled = false;
  }
  if (faseDoHalloween(g0) !== 'depois') return;

  const A = ARI.name;
  const R = RENAN.name;
  const conversa = async (g: GameAPI, falas: ReadonlyArray<readonly [string, string]>): Promise<void> => {
    for (const [quem, texto] of falas) await g.say([texto], quem);
  };

  const noite: NoiteEmCasa = anoitecerEmCasa(w, pecas);
  pecas.deitarNaCama.enabled = false;

  const dormir = w.interact({
    id: 'halloween:dormir',
    x: -2.2, z: -0.5, radius: 1.6,
    label: 'Dormir depois da festa', icon: '🌙',
    highlight: pecas.cama,
    onInteract: async (g) => {
      const quer = await g.ask('Dormir? A noite da festa acaba aqui.', ['Dormir', 'Ainda não']);
      if (quer !== 0) {
        await conversa(g, [[A, 'Só mais um pouquinho de festa na cabeça.'], [R, 'Tá. Mas a coroa já tá pesando.']]);
        return;
      }
      dormir.enabled = false;

      // 1. deitam fantasiados e coroados, e conversam baixinho
      await pecas.deitarOsDois(g);
      await conversa(g, [
        [R, 'Que noite.'],
        [A, 'A gente ganhou um concurso de fantasia. Dentro de uma abóbora.'],
        [R, 'Por unanimidade. Treze plaquinhas.'],
        [A, 'E o Walter de múmia servindo cupcake com olhinho.'],
        [R, 'Boa noite, minha rainha.'],
        [A, 'Boa noite, meu rei.'],
      ]);

      // 2. o abajur apaga, e a tela vai para o sono
      pecas.ligarAbajur(false);
      g.som('clique');
      await g.wait(1.0);
      await g.escurecerTela(true, 'sono');

      // 3. POR BAIXO DA CORTINA: o evento acaba e o dia chega
      avancarFase(g, 'fim');
      noite.amanhecer();
      vestirARoupaDeAntes(g);
      // o Pelusa voltou da boutique (sem cena: ele simplesmente está em casa)
      pelusa.group.visible = true;
      pelusa.aoSoar = somDoPelusa;
      carinho.enabled = true;
      await g.wait(1.6);
      await g.escurecerTela(false, 'sono');
      g.som('passarinho');
      await g.wait(0.8);

      // 4. a manhã seguinte
      await conversa(g, [
        [A, 'Bom dia…'],
        [R, 'Já é de manhã?'],
        [A, 'Sonhei que eu era rainha.'],
        [R, 'Não foi sonho. Tá no quadro.'],
        [A, 'E as fantasias?'],
        [R, 'Guardadinhas no armário. As coroas também.'],
      ]);
      pecas.levantarOsDois(g);
      pecas.deitarNaCama.enabled = true;

      g.unlock({
        id: MEMORIA_DO_FIM,
        title: 'O dia seguinte',
        place: 'Quarto do Ari',
        note: 'Voltamos da festa de madrugada, deitamos de coroa e tudo, e acordamos com o sol entrando pela janela. As fantasias e as coroas ficaram no armário; o resto voltou a ser como sempre.',
        icon: '🌅',
      });
      g.toast('Fim do especial de Halloween', '🎃');
    },
  });
}
