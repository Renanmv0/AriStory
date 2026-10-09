import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { Pass } from 'three/addons/postprocessing/Pass.js';

/**
 * ============================================ O PÓS-PROCESSAMENTO DO MOTOR
 *
 * Normalmente o jogo desenha a cena DIRETO no canvas: `renderer.render()`. Com
 * pós-processamento, ele desenha numa textura fora da tela e passa essa
 * imagem por uma fila de filtros (os "passes" do `EffectComposer`) antes de
 * ela chegar no canvas — brilho em volta do que é claro, pixel art, contorno,
 * grão de filme. Cada filtro é um desenho de tela inteira a mais.
 *
 * É COISA DO MOTOR, NÃO DA CENA: a cena não sabe que existe um renderer, então
 * ela só diz O QUE quer (`g.telaComEfeitos({ brilho: {...} })`) e o motor
 * monta a fila. E nenhum efeito atravessa uma troca de cena — o `Game.build()`
 * desliga tudo, como faz com a câmera do ping pong.
 *
 * Hoje só o laboratório (o mundo dentro do computador do Ari) liga isto. O
 * resto do jogo continua no `renderer.render()` puro, que é o caminho barato
 * para o celular do Renan.
 *
 * ============================================== TRÊS COISAS QUE MORDEM
 *
 * 1. **A cor sai errada sem o `OutputPass` no fim.** A cena é desenhada em
 *    espaço LINEAR numa textura de ponto flutuante; quem converte para sRGB (o
 *    que o canvas espera) é o último passe. Sem ele tudo sai escuro e lavado.
 *    (A skill antiga de pós-processamento fala em `GammaCorrectionShader` —
 *    nas versões novas do three é o `OutputPass`.)
 * 2. **O antisserrilhado some.** O `antialias: true` do renderer vale só para
 *    o canvas; desenhando numa textura, as bordas do toon serrilham. Por isso
 *    a textura do composer nasce MULTIAMOSTRADA (`samples: 4`), que é o mesmo
 *    antisserrilhado, só que dentro da textura.
 * 3. **A câmera troca.** O jogo tem a isométrica, a perspectiva das cutscenes e
 *    a câmera livre do drone. Os passes que desenham a cena guardam uma câmera
 *    cada um; `desenhar()` entrega a câmera do quadro a todos, todo quadro.
 */

/** O que a cena pode pedir. Cada chave ligada é um passe a mais na fila. */
export interface EfeitosDeTela {
  /**
   * BRILHO NEON (`UnrealBloomPass`): o que passa do `limiar` de claridade
   * vaza luz em volta. O laboratório pinta o neon com cor ACIMA de 1 (ver
   * `neon()` em `core/shaders.ts`), e é por isso que só ele brilha.
   */
  brilho?: { forca?: number; raio?: number; limiar?: number };
  /** PIXEL ART (`RenderPixelatedPass`): o lado de cada pixel, em pixels de tela */
  pixel?: number;
  /**
   * CONTORNO (`OutlinePass`) em volta destes objetos — inclusive ATRÁS de
   * parede, numa segunda cor. É o "ver através" de jogo de estratégia.
   */
  contorno?: { objetos: readonly THREE.Object3D[]; cor?: number; corEscondida?: number; espessura?: number };
  /** FILME ANTIGO: sépia e vinheta (passe próprio) mais o grão do `FilmPass` */
  filme?: { grao?: number; sepia?: number };
  /** GLITCH (`GlitchPass`): a tela pula e racha de tempos em tempos */
  glitch?: boolean;
  /**
   * RASTRO (`AfterimagePass`): cada quadro mistura um pouco do anterior.
   * 0,85 é um rastro curto; 0,96 deixa cauda de cometa.
   */
  rastro?: number;
  /** HISTÓRIA EM QUADRINHOS (`HalftonePass`): a imagem vira pontinhos de gráfica */
  quadrinho?: { raio?: number };
  /** MONITOR ANTIGO (passe próprio): tela curva, linhas de varredura e a máscara RGB */
  monitor?: boolean;
  /** LENTE (passe próprio): aberração cromática nas bordas e vinheta */
  lente?: number;
}

// ------------------------------------------------------- os passes próprios

const VERTICE_DE_TELA = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * A LENTE: cada canal de cor é lido num ponto um pouco diferente, afastando
 * do centro — é o defeito de lente barata (aberração cromática). Mais a
 * vinheta, que escurece os cantos.
 */
const SHADER_LENTE = {
  name: 'Lente',
  uniforms: {
    tDiffuse: { value: null },
    uForca: { value: 0.012 },
  },
  vertexShader: VERTICE_DE_TELA,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uForca;
    varying vec2 vUv;
    void main() {
      vec2 d = vUv - 0.5;
      float r = length(d);
      vec2 desvio = d * uForca * (0.4 + r * 3.0);
      float vermelho = texture2D(tDiffuse, vUv - desvio).r;
      vec4 meio = texture2D(tDiffuse, vUv);
      float azul = texture2D(tDiffuse, vUv + desvio).b;
      float vinheta = smoothstep(0.82, 0.32, r);
      gl_FragColor = vec4(vec3(vermelho, meio.g, azul) * mix(0.5, 1.0, vinheta), 1.0);
    }
  `,
};

/** O FILME ANTIGO: sépia, vinheta e uma luz que treme de leve. */
const SHADER_FILME = {
  name: 'FilmeAntigo',
  uniforms: {
    tDiffuse: { value: null },
    uSepia: { value: 0.85 },
    uTempo: { value: 0 },
  },
  vertexShader: VERTICE_DE_TELA,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uSepia;
    uniform float uTempo;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      vec3 sepia = vec3(l) * vec3(1.08, 0.9, 0.68);
      c = mix(c, sepia, uSepia);
      float r = length(vUv - 0.5);
      c *= mix(0.42, 1.0, smoothstep(0.78, 0.3, r));
      // a lâmpada do projetor: um tremor de 3% e nada mais
      c *= 0.97 + 0.03 * sin(uTempo * 41.0) * sin(uTempo * 7.0);
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

/**
 * O MONITOR DE TUBO: a imagem entorta como vidro curvo, ganha as linhas de
 * varredura (uma a cada dois pixels de tela) e a máscara de fósforo — três
 * colunas, uma de cada cor, que é o que se via encostando o nariz numa TV
 * velha. Fora da curva, preto.
 */
const SHADER_MONITOR = {
  name: 'Monitor',
  uniforms: {
    tDiffuse: { value: null },
    uResolucao: { value: new THREE.Vector2(1, 1) },
    uTempo: { value: 0 },
  },
  vertexShader: VERTICE_DE_TELA,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolucao;
    uniform float uTempo;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      p *= 1.0 + dot(p, p) * 0.06;
      vec2 uv = p * 0.5 + 0.5;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
      vec3 c = texture2D(tDiffuse, uv).rgb;
      float varredura = 0.78 + 0.22 * sin(uv.y * uResolucao.y * 1.5708);
      float coluna = mod(gl_FragCoord.x, 3.0);
      vec3 fosforo = vec3(
        coluna < 1.0 ? 1.0 : 0.72,
        coluna >= 1.0 && coluna < 2.0 ? 1.0 : 0.72,
        coluna >= 2.0 ? 1.0 : 0.72
      );
      c *= varredura * fosforo * 1.25;
      // uma faixa clara rolando devagar, como a da TV mal sintonizada
      c += 0.04 * smoothstep(0.0, 0.04, 0.04 - abs(fract(uv.y - uTempo * 0.12) - 0.5));
      float r = length(p);
      c *= smoothstep(1.45, 0.7, r);
      gl_FragColor = vec4(c, 1.0);
    }
  `,
};

/**
 * O GLITCH DO THREE 0.180 TEM UM DEFEITO: ele guarda o mapa de distorção em
 * `_heightMap`, mas LÊ `heightMap` — no uniforme (`tDisp` fica vazio e o
 * glitch não entorta a imagem) e no `dispose()` (que estoura com
 * "Cannot read properties of undefined (reading 'dispose')"). O estouro
 * travava a troca do filtro e, pior, a troca de CENA, que passa pelo
 * desmonte da fila. Aqui o nome certo é ligado nos dois lugares.
 */
function glitchConsertado(): GlitchPass {
  const passe = new GlitchPass();
  const interno = passe as unknown as {
    _heightMap?: THREE.DataTexture;
    heightMap?: THREE.DataTexture;
    uniforms: Record<string, { value: unknown }>;
  };
  if (!interno.heightMap && interno._heightMap) {
    interno.heightMap = interno._heightMap;
    interno.uniforms.tDisp.value = interno._heightMap;
  }
  return passe;
}

// --------------------------------------------------------------- o motor

/**
 * Monta, guarda e desenha a fila de passes. O `Game` tem um só destes, que
 * nasce na primeira vez que alguma cena pede efeito.
 */
export class PosProcessamento {
  private composer: EffectComposer | null = null;
  /** os passes que desenham a CENA, que precisam da câmera de cada quadro */
  private desenhaCena: Array<RenderPass | RenderPixelatedPass> = [];
  private contorno: OutlinePass | null = null;
  private filme: ShaderPass | null = null;
  private monitor: ShaderPass | null = null;
  private tempo = 0;
  /** o que está ligado agora; serve aos testes e ao `ativo` */
  private atual: EfeitosDeTela | null = null;
  private nomes: string[] = [];

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    private readonly cena: THREE.Scene,
  ) {}

  get ativo(): boolean {
    return this.composer !== null;
  }

  /**
   * Os nomes dos passes da fila, em ordem — o teste confere por aqui. Anotados
   * à mão, e não lidos de `constructor.name`: o build minifica o nome das
   * classes, e no `dist/` todo passe se chamaria `e`.
   */
  get passes(): readonly string[] {
    return this.nomes;
  }

  get efeitos(): EfeitosDeTela | null {
    return this.atual;
  }

  /**
   * Troca a fila inteira. É barato o bastante para fazer a cada botão
   * apertado, e não a cada quadro: refazer a fila cria texturas na GPU.
   */
  configurar(efeitos: EfeitosDeTela | null, camera: THREE.Camera): void {
    this.desmontar();
    this.atual = efeitos;
    if (!efeitos) return;

    const tamanho = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const alvo = new THREE.WebGLRenderTarget(tamanho.x, tamanho.y, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    const composer = new EffectComposer(this.renderer, alvo);
    composer.setPixelRatio(this.renderer.getPixelRatio());
    composer.setSize(window.innerWidth, window.innerHeight);
    const largura = window.innerWidth;
    const altura = window.innerHeight;
    const por = (nome: string, passe: Pass): void => {
      composer.addPass(passe);
      this.nomes.push(nome);
    };

    // 1. a cena — em pixel art quem desenha é o próprio passe de pixel
    if (efeitos.pixel) {
      const p = new RenderPixelatedPass(efeitos.pixel, this.cena, camera, {
        normalEdgeStrength: 0.35,
        depthEdgeStrength: 0.45,
      });
      por('pixel', p);
      this.desenhaCena.push(p);
    } else {
      const p = new RenderPass(this.cena, camera);
      por('cena', p);
      this.desenhaCena.push(p);
    }

    // 2. o contorno vem antes do brilho, para o brilho pegar a linha também
    if (efeitos.contorno) {
      const c = efeitos.contorno;
      const passe = new OutlinePass(new THREE.Vector2(largura, altura), this.cena, camera, [...c.objetos]);
      passe.edgeStrength = 4;
      passe.edgeGlow = 0.4;
      passe.edgeThickness = c.espessura ?? 1.6;
      passe.visibleEdgeColor.setHex(c.cor ?? 0xffffff);
      passe.hiddenEdgeColor.setHex(c.corEscondida ?? 0x56d8ff);
      por('contorno', passe);
      this.contorno = passe;
    }

    if (efeitos.rastro !== undefined) por('rastro', new AfterimagePass(efeitos.rastro));

    if (efeitos.brilho) {
      const b = efeitos.brilho;
      por('brilho', new UnrealBloomPass(new THREE.Vector2(largura, altura), b.forca ?? 0.9, b.raio ?? 0.5, b.limiar ?? 0.92));
    }

    if (efeitos.filme) {
      const passe = new ShaderPass(SHADER_FILME);
      passe.uniforms.uSepia.value = efeitos.filme.sepia ?? 0.85;
      por('sepia', passe);
      this.filme = passe;
      por('grao', new FilmPass(efeitos.filme.grao ?? 0.55, false));
    }

    if (efeitos.quadrinho) {
      por('quadrinho', new HalftonePass({
        shape: 1,
        radius: efeitos.quadrinho.raio ?? 5,
        scatter: 0,
        blending: 0.6,
        blendingMode: 1,
        greyscale: false,
      }));
    }

    if (efeitos.lente !== undefined) {
      const passe = new ShaderPass(SHADER_LENTE);
      passe.uniforms.uForca.value = efeitos.lente;
      por('lente', passe);
    }

    if (efeitos.glitch) por('glitch', glitchConsertado());

    if (efeitos.monitor) {
      const passe = new ShaderPass(SHADER_MONITOR);
      por('monitor', passe);
      this.monitor = passe;
    }

    // 3. sempre por último: linear → sRGB (ver o topo do arquivo)
    por('saida', new OutputPass());
    this.composer = composer;
    this.medirMonitor();
  }

  /** Desenha um quadro com a fila. `camera` é a do quadro (iso, cutscene, drone). */
  desenhar(camera: THREE.Camera, dt: number): void {
    if (!this.composer) return;
    this.tempo += dt;
    for (const p of this.desenhaCena) p.camera = camera;
    if (this.contorno) this.contorno.renderCamera = camera;
    if (this.filme) this.filme.uniforms.uTempo.value = this.tempo;
    if (this.monitor) this.monitor.uniforms.uTempo.value = this.tempo;
    this.composer.render(dt);
  }

  setSize(largura: number, altura: number): void {
    if (!this.composer) return;
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(largura, altura);
    this.medirMonitor();
  }

  private medirMonitor(): void {
    if (!this.monitor) return;
    this.renderer.getDrawingBufferSize(this.monitor.uniforms.uResolucao.value as THREE.Vector2);
  }

  /** Solta a fila e as texturas dela. Sem fila, o `Game` volta ao `render()` puro. */
  private desmontar(): void {
    if (!this.composer) return;
    for (const p of this.composer.passes) {
      // um passe que falha ao se soltar não pode travar a troca de filtro nem
      // a de cena (o `Game.build()` passa por aqui) — ver `glitchConsertado`
      try {
        (p as Pass & { dispose?: () => void }).dispose?.();
      } catch {
        // a textura dele fica para o coletor; a fila segue sendo desmontada
      }
    }
    this.composer.renderTarget1.dispose();
    this.composer.renderTarget2.dispose();
    this.composer = null;
    this.nomes = [];
    this.desenhaCena = [];
    this.contorno = null;
    this.filme = null;
    this.monitor = null;
  }

  dispose(): void {
    this.desmontar();
    this.atual = null;
  }
}
