import * as THREE from 'three';
import type { Clicavel } from './types';

/**
 * ===================================== CLICAR, PASSAR O MOUSE E ARRASTAR
 *
 * Até o laboratório, o jogo inteiro era teclado e joystick: o mouse só servia
 * para a raquete do ping pong, e a raquete lê o ponteiro em coordenada de tela
 * (`Input.pointer()`), sem perguntar O QUE está debaixo dele.
 *
 * Isto aqui pergunta. É o `Raycaster` da skill de interação: um raio sai da
 * câmera passando pelo ponteiro e o three devolve o que ele atravessa, do mais
 * perto para o mais longe. Com câmera ortográfica (a isométrica) o raio sai
 * PARALELO ao eixo da câmera, e não de um ponto — o `setFromCamera` já sabe
 * disso, e é por isso que o mesmo código serve para a isométrica e para a
 * perspectiva das cutscenes.
 *
 * QUEM PODE SER CLICADO é a cena que diz (`w.clicavel(obj, {...})`), e o raio
 * só testa a lista — nunca o mundo inteiro. Testar o mundo inteiro (6.900
 * objetos no Villa Lobos) a cada movimento do mouse seria jogar CPU fora.
 *
 * O QUE ESTE ARQUIVO NÃO FAZ: ler evento de DOM. Quem lê é o `Input`, como
 * sempre; ele só repassa para cá (`evento()`) e pergunta se o toque era num
 * clicável — se era, o dedo NÃO vira joystick. É isso que deixa tocar num
 * cristal no celular sem a dupla sair andando.
 *
 * TRÊS GESTOS:
 *  - **passar** (só mouse — dedo não paira): a peça avisa (`aoPassar`), o
 *    cursor vira mãozinha e a DICA aparece em cima dela. A dica é DOM, e o
 *    lugar dela na tela sai da posição 3D da peça projetada pela câmera
 *    (`Vector3.project`) — a conversão mundo→tela, refeita todo quadro,
 *    porque a câmera anda e gira;
 *  - **clicar**: apertar e soltar em cima da peça sem arrastar (até 10 px);
 *  - **arrastar**: a peça segue o ponteiro num plano horizontal — o raio é
 *    cruzado com um `THREE.Plane` (`ray.intersectPlane`), e não com a peça,
 *    para ela não fugir do dedo quando o raio escorrega pela borda dela.
 */

export interface EventoDeApontar {
  tipo: 'desce' | 'move' | 'sobe' | 'sai';
  /** ponteiro em -1..1, `y` para cima (a mesma conta do `Input.pointer()`) */
  x: number;
  y: number;
  /** posição em pixels de tela, para medir se foi clique ou arrasto */
  px: number;
  py: number;
  toque: boolean;
}

/** quanto o dedo pode escorregar e ainda ser um toque, e não um arrasto */
const FOLGA_DO_CLIQUE = 10;

export class Apontador {
  private readonly raio = new THREE.Raycaster();
  private readonly ndc = new THREE.Vector2();
  private readonly plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly cruzamento = new THREE.Vector3();
  private readonly dicaMundo = new THREE.Vector3();

  private camera: THREE.Camera | null = null;
  private clicaveis: readonly Clicavel[] = [];
  private bloqueado = true;

  /** o mouse está em cima do canvas (dedo não conta: dedo não paira) */
  private pairando = false;
  /** o ponteiro andou desde o último quadro: só aí vale refazer o raio */
  private mexeu = false;
  private sobre: Clicavel | null = null;
  private apertado: { alvo: Clicavel; px: number; py: number; ponto: THREE.Vector3 } | null = null;
  private arrastando: Clicavel | null = null;

  constructor(
    private readonly superficie: HTMLElement,
    /** o clique de verdade; o `Game` passa a si mesmo como `GameAPI` */
    private readonly clicar: (alvo: Clicavel, ponto: THREE.Vector3) => void,
    /** a dica em pixels de tela; `null` esconde */
    private readonly dica: (texto: string | null, x: number, y: number) => void,
  ) {}

  /** a peça debaixo do mouse agora (gancho de teste) */
  get emCima(): Clicavel | null {
    return this.sobre;
  }

  /**
   * Um evento do `Input`. Devolve `true` quando ele era de um clicável — e aí
   * o `Input` não começa o joystick com esse dedo.
   */
  evento(e: EventoDeApontar): boolean {
    this.ndc.set(e.x, e.y);
    if (e.tipo === 'sai') {
      this.pairando = false;
      this.trocarSobre(null);
      return false;
    }
    if (!e.toque) this.pairando = true;
    this.mexeu = true;

    if (e.tipo === 'move') {
      if (this.arrastando) this.arrastar();
      return false;
    }

    if (e.tipo === 'desce') {
      if (this.bloqueado || !this.camera) return false;
      const acerto = this.atirar();
      if (!acerto) return false;
      if (acerto.alvo.def.arrastar) {
        this.arrastando = acerto.alvo;
        acerto.alvo.def.arrastar.aoPegar?.();
        this.superficie.style.cursor = 'grabbing';
        this.arrastar();
      } else {
        this.apertado = { alvo: acerto.alvo, px: e.px, py: e.py, ponto: acerto.ponto };
      }
      return true;
    }

    // ------------------------------------------------------------ solta
    if (this.arrastando) {
      const solto = this.arrastando;
      this.arrastando = null;
      solto.def.arrastar?.aoSoltar?.();
      this.superficie.style.cursor = this.sobre ? 'pointer' : '';
      return true;
    }
    const apertado = this.apertado;
    this.apertado = null;
    if (!apertado || this.bloqueado) return false;
    if (Math.hypot(e.px - apertado.px, e.py - apertado.py) > FOLGA_DO_CLIQUE) return false;
    // soltou em cima da MESMA peça em que apertou: é clique
    const agora = this.atirar();
    if (!agora || agora.alvo !== apertado.alvo) return false;
    this.clicar(agora.alvo, agora.ponto);
    return true;
  }

  /**
   * Todo quadro: a câmera do quadro, a lista da cena e se pode clicar. Refaz o
   * "passar por cima" (só quando o mouse mexeu ou a câmera anda) e põe a dica
   * no lugar.
   */
  atualizar(camera: THREE.Camera, clicaveis: readonly Clicavel[], bloqueado: boolean): void {
    const trocouCamera = camera !== this.camera;
    this.camera = camera;
    this.clicaveis = clicaveis;
    if (bloqueado !== this.bloqueado) {
      this.bloqueado = bloqueado;
      if (bloqueado) this.soltarTudo();
    }
    if (bloqueado) return;

    // a câmera isométrica segue a dupla: a peça debaixo de um mouse PARADO muda
    // quando eles andam, então o raio é refeito também com a câmera em movimento
    if (this.pairando && !this.arrastando && (this.mexeu || trocouCamera || this.cameraAndou(camera))) {
      const acerto = this.atirar();
      this.trocarSobre(acerto?.alvo ?? null);
    }
    this.mexeu = false;
    this.posicionarDica(camera);
  }

  private ultimaPose = new THREE.Matrix4();
  private cameraAndou(camera: THREE.Camera): boolean {
    if (camera.matrixWorld.equals(this.ultimaPose)) return false;
    this.ultimaPose.copy(camera.matrixWorld);
    return true;
  }

  /** O raio, só contra a lista. Devolve a peça dona do que foi acertado. */
  private atirar(): { alvo: Clicavel; ponto: THREE.Vector3 } | null {
    if (!this.camera) return null;
    const vivos = this.clicaveis.filter((c) => c.ligado && visivelDeVerdade(c.obj));
    if (!vivos.length) return null;
    this.raio.setFromCamera(this.ndc, this.camera);
    const acertos = this.raio.intersectObjects(vivos.map((c) => c.obj), true);
    for (const a of acertos) {
      if (!visivelDeVerdade(a.object)) continue;
      // sobe pelos pais até achar quem foi registrado (o raio acerta a malha
      // de dentro; quem a cena registrou costuma ser o grupo da peça)
      let o: THREE.Object3D | null = a.object;
      while (o) {
        const dono = vivos.find((c) => c.obj === o);
        if (dono) return { alvo: dono, ponto: a.point.clone() };
        o = o.parent;
      }
    }
    return null;
  }

  private arrastar(): void {
    const alvo = this.arrastando;
    const arrastar = alvo?.def.arrastar;
    if (!alvo || !arrastar || !this.camera) return;
    this.raio.setFromCamera(this.ndc, this.camera);
    this.plano.constant = -(arrastar.altura ?? 0);
    if (this.raio.ray.intersectPlane(this.plano, this.cruzamento)) arrastar.aoArrastar(this.cruzamento.clone());
  }

  private trocarSobre(novo: Clicavel | null): void {
    if (novo === this.sobre) return;
    this.sobre?.def.aoPassar?.(false);
    this.sobre = novo;
    novo?.def.aoPassar?.(true);
    if (!this.arrastando) this.superficie.style.cursor = novo ? (novo.def.arrastar ? 'grab' : 'pointer') : '';
    if (!novo) this.dica(null, 0, 0);
  }

  /** a dica acompanha a peça na tela: mundo → tela, todo quadro */
  private posicionarDica(camera: THREE.Camera): void {
    const alvo = this.arrastando ?? this.sobre;
    if (!alvo?.def.dica) return;
    alvo.obj.getWorldPosition(this.dicaMundo);
    this.dicaMundo.y += alvo.def.alturaDaDica ?? 1.1;
    this.dicaMundo.project(camera);
    const r = this.superficie.getBoundingClientRect();
    this.dica(
      alvo.def.dica,
      r.left + ((this.dicaMundo.x + 1) / 2) * r.width,
      r.top + ((1 - this.dicaMundo.y) / 2) * r.height,
    );
  }

  /** abriu um diálogo, um painel ou trocou de cena: ninguém fica apertado nem pairando */
  soltarTudo(): void {
    if (this.arrastando) this.arrastando.def.arrastar?.aoSoltar?.();
    this.arrastando = null;
    this.apertado = null;
    this.trocarSobre(null);
    this.superficie.style.cursor = '';
    this.dica(null, 0, 0);
  }
}

/** visível ele E todos os pais: o raio do three não olha `visible` */
function visivelDeVerdade(o: THREE.Object3D): boolean {
  let n: THREE.Object3D | null = o;
  while (n) {
    if (!n.visible) return false;
    n = n.parent;
  }
  return true;
}
