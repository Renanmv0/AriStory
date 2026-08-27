/**
 * Ficha de um personagem. Tudo aqui e declarativo de proposito: para mudar o
 * visual de alguem voce edita numeros e cores, nunca geometria.
 * O construtor procedural vive em CharacterRig.ts.
 */

export type HairStyle =
  | 'curto'
  | 'cacheado'
  /** cachos curtos e definidos, colados nas laterais, com topete na frente */
  | 'cachos-curtos'
  | 'ondulado'
  | 'raspado'
  | 'coque'
  | 'franja';

export type Accessory =
  | 'oculos'
  | 'bone'
  | 'barba'
  | 'relogio'
  | 'mochila'
  | 'corrente'
  | 'fone'
  /** presilha de estrela no cabelo */
  | 'presilha'
  /** laco de fita no decote */
  | 'laco'
  /** cinto com correntinha de estrela */
  | 'cinto';

export type BodyBuild = 'magro' | 'medio' | 'forte';

export interface CharacterSpec {
  id: string;
  /** nome mostrado nos dialogos */
  name: string;
  /** altura total em unidades de mundo. 1.75 = adulto no estilo do jogo */
  height: number;
  build: BodyBuild;
  skin: number;
  blush: number;
  eyes: number;
  hair: {
    color: number;
    style: HairStyle;
    /** volume do cabelo, 0.6 = colado, 1.3 = bem armado (padrao 1) */
    volume?: number;
    /** cor das pontas/mechas mais claras (padrao: sem mechas) */
    tips?: number;
  };
  shirt: number;
  /** detalhe da camiseta: gola, listra, estampa */
  shirtAccent?: number;
  pants: number;
  shoes: number;
  /** cor do calção de banho; sem isso o traje de banho usa a cor da calça */
  swim?: number;
  /** jaqueta/moletom aberto por cima da camiseta, com capuz */
  jacket?: number;
  accessories?: Accessory[];
  /** cor do acessorio principal (armacao do oculos, aba do bone) */
  accessoryColor?: number;
}

export const BUILD_WIDTH: Record<BodyBuild, number> = {
  magro: 0.86,
  medio: 1,
  forte: 1.16,
};
