import * as THREE from 'three';
import { CharacterRig } from './CharacterRig';
import type { CharacterSpec } from './spec';
import type { Loadout } from '../core/types';

/**
 * O boneco do painel do guarda-roupa.
 *
 * Ele NAO e o personagem do mundo — e um `CharacterRig` proprio, montado do
 * mesmo `CharacterSpec`, numa cena so dele. Foi a escolha deliberada contra as
 * duas alternativas:
 *
 * - reparentar o rig do jogo para uma cena de retrato enquanto o painel esta
 *   aberto tira o corpo do lugar por baixo do parceiro, do beijo e das maos
 *   dadas, que leem posicao todo quadro;
 * - desenhar a cena do jogo com uma segunda camera traria o quarto inteiro
 *   junto, e o que se quer ver e a roupa.
 *
 * Montar um rig e barato — e geometria procedural, o jogo ja monta dois no
 * comeco —, entao a copia sai mais simples e nao pode quebrar nada do mundo.
 *
 * E ele tem CANVAS PROPRIO, dentro do painel. A primeira versao recortava um
 * retangulo do canvas do jogo com tesoura, e o boneco saiu fantasma: o canvas
 * do jogo fica ATRAS do HTML, entao a folha translucida do painel passava por
 * cima dele. Um filho nao fura o fundo do pai — a saida e o boneco ser um
 * elemento do painel, e nao um pedaco do fundo.
 */
export class Previa {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cena = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  private readonly pedestal = new THREE.Group();
  private rig: CharacterRig | null = null;
  private spec: CharacterSpec | null = null;
  /** quanto o boneco ja girou, em radianos */
  private giro = 0;
  /** para onde ele esta girando; o giro e suave, como no rig do jogo */
  private alvo = 0;

  constructor(canvas: HTMLCanvasElement) {
    // `alpha` para o painel aparecer por tras do boneco; sem antialias o
    // contorno das capsulas fica serrilhado num quadro parado, que e
    // justamente o que se olha aqui
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.cena.add(this.pedestal);

    // Luz propria: a do mundo acompanha a cena e mudaria a cor da roupa
    // conforme o cenario. No painel a peca tem que aparecer com a COR dela.
    const ceu = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.5);
    this.cena.add(ceu);
    const sol = new THREE.DirectionalLight(0xfff4e0, 1.5);
    sol.position.set(3, 5, 4);
    this.cena.add(sol);
    const contra = new THREE.DirectionalLight(0xbfd8ff, 0.5);
    contra.position.set(-3, 2, -3);
    this.cena.add(contra);
  }

  /**
   * Troca o corpo do boneco, se for preciso.
   *
   * O painel mostra quem esta sendo controlado, e o `T` troca isso a qualquer
   * momento — por isso a comparacao por id em vez de montar uma vez so.
   */
  mostrar(spec: CharacterSpec): void {
    if (this.spec?.id === spec.id) return;
    if (this.rig) {
      this.pedestal.remove(this.rig.group);
      this.rig.dispose();
    }
    this.spec = spec;
    this.rig = new CharacterRig(spec);
    this.pedestal.add(this.rig.group);

    // Enquadra pela altura da pessoa — o Renan e 6 cm mais alto que o Ari.
    //
    // A distancia nao e gosto: com fov de 30 graus, a altura visivel a uma
    // distancia d e `2·d·tan(15°)` = 0,536·d. Para caber 1,72 de gente com
    // folga em cima e embaixo sao precisos ~2,1 de altura visivel, ou seja
    // d ≈ 3,9. A primeira versao usava 1,62 x a altura e cortava os pes.
    const alto = spec.height;
    this.rig.group.position.y = -alto * 0.5;
    this.camera.position.set(0, alto * 0.04, alto * 2.28);
    this.camera.lookAt(0, 0, 0);
  }

  vestir(loadout: Loadout): void {
    this.rig?.vestirRoupa(loadout);
  }

  /** Gira o boneco. Positivo vai para a direita. */
  girar(delta: number): void {
    this.alvo += delta;
  }

  update(dt: number): void {
    if (!this.rig) return;
    this.giro += (this.alvo - this.giro) * Math.min(1, dt * 9);
    this.pedestal.rotation.y = this.giro;
    // o rig anima parado: respira e balanca de leve, que e o que faz o boneco
    // parecer vivo em vez de manequim
    this.rig.update(dt, 0);
  }

  /** Desenha o boneco, acompanhando o tamanho que o CSS deu ao canvas. */
  desenhar(): void {
    if (!this.rig) return;
    const canvas = this.renderer.domElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w < 2 || h < 2) return;
    // `false` para o renderer NAO escrever width/height no style: quem manda no
    // tamanho aqui e o CSS do painel
    if (canvas.width !== w || canvas.height !== h) this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.cena, this.camera);
  }

  dispose(): void {
    this.rig?.dispose();
    this.rig = null;
    this.spec = null;
    this.renderer.dispose();
  }
}
