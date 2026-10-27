import * as THREE from 'three';
import { toon } from './materials';

/**
 * ==================================================== OS MATERIAIS DE SHADER
 *
 * O `materials.ts` é o kit de material do jogo (`toon()`, `flat()`); este é o
 * kit dos materiais que fazem o que o toon sozinho não faz — balançar com o
 * vento, desmanchar, brilhar como holograma, ondular como água. Nasceu no
 * laboratório (o mundo dentro do computador do Ari), mas foi escrito para
 * servir ao resto do jogo: o vento, por exemplo, é o mesmo que um dia pode
 * balançar as árvores do Villa Lobos.
 *
 * DUAS FAMÍLIAS, e a diferença importa:
 *
 *  - **TOON ESTENDIDO** (`onBeforeCompile`): pega o `MeshToonMaterial` de
 *    sempre e costura um trecho de GLSL dentro dele. O degrau de luz, a
 *    sombra recebida e a névoa continuam vindo do three — só o pedaço novo é
 *    nosso. É o caminho para tudo que ainda tem que parecer DO JOGO (a grama,
 *    o chão, o cubo que desmancha). O vento, a grade e o dissolver são assim.
 *  - **SHADER PRÓPRIO** (`ShaderMaterial`): o desenho inteiro é nosso, sem luz
 *    do three. Serve para o que não é matéria — holograma, água de pixel,
 *    portal. Mais livre, mas não recebe sombra nem luz da cena.
 *
 * O RELÓGIO: shader animado tem `uTempo`, e quem avança é a cena, no
 * `w.onUpdate`, pelo `dt` — nunca `performance.now()`. É o que faz o menu
 * pausar o vento junto com o resto do mundo.
 *
 * ESPAÇO DE COR: o `THREE.Color` guarda a cor da paleta já convertida para
 * LINEAR, que é o espaço em que a luz se soma. Shader próprio que escreve
 * `gl_FragColor` termina com `#include <colorspace_fragment>` — é a linha que
 * devolve a cor para sRGB quando o desenho vai direto para o canvas (e não
 * faz nada quando vai para a textura do pós-processamento, que é linear).
 * Sem ela o holograma sai escuro sem efeito de tela e certo com efeito.
 *
 * COR: entra como `number` da paleta, igual ao `toon()`. O que é NEON entra
 * multiplicado acima de 1 (`neon()`), e é só isso que o brilho da tela
 * (`telaComEfeitos({ brilho })`) faz vazar: o limiar dele fica perto de 1, e
 * nenhuma superfície iluminada normal chega lá.
 */

// =================================================================== neon

const neons = new Map<string, THREE.MeshBasicMaterial>();

/**
 * NEON: cor chapada (sem luz) ACIMA DE 1. Sem efeito de tela ela é só uma cor
 * forte; com o brilho ligado, ela é o que acende. `forca` 2,6 deixa o miolo
 * quase branco e a borda na cor — é o tubo de neon.
 */
export function neon(cor: number, forca = 2.6, opacidade = 1): THREE.MeshBasicMaterial {
  const chave = `${cor}|${forca}|${opacidade}`;
  const hit = neons.get(chave);
  if (hit) return hit;
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(cor).multiplyScalar(forca),
    transparent: opacidade < 1,
    opacity: opacidade,
    side: THREE.DoubleSide,
  });
  neons.set(chave, mat);
  return mat;
}

// ================================================================== ruído

/**
 * Ruído de valor em 3D, todo em GLSL — sem textura nenhuma. Nomes com `lab`
 * para não esbarrar nas funções que o three já declara no `common`.
 */
const RUIDO_GLSL = /* glsl */ `
  float labHash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float labRuido(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(labHash(i), labHash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(labHash(i + vec3(0.0, 1.0, 0.0)), labHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(labHash(i + vec3(0.0, 0.0, 1.0)), labHash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(labHash(i + vec3(0.0, 1.0, 1.0)), labHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z);
  }
  float labNuvem(vec3 x) {
    return labRuido(x) * 0.65 + labRuido(x * 2.3 + 7.1) * 0.35;
  }
`;

// ================================================================== vento

/**
 * O VENTO: toda folha de grama (ou qualquer malha) dobra para o lado do vento,
 * mais quanto mais alta for a parte dela. É `onBeforeCompile` no toon: o
 * `project_vertex` do three é trocado por um que, depois de pôr o vértice no
 * MUNDO, empurra ele no plano do chão.
 *
 * Por que no mundo, e não no espaço da peça: com `InstancedMesh` cada folha
 * está girada para um lado (o sorteio que faz a grama não parecer plantada
 * em fila). Empurrar no espaço local mandaria cada folha para um lado; o vento
 * de verdade empurra todas para o MESMO lado.
 *
 * A fase de cada folha sai da posição da RAIZ dela no mundo — é o que faz a
 * onda de vento atravessar o gramado em vez de todas balançarem juntas.
 *
 * O peso é `(altura relativa)²`: a raiz fica plantada, a ponta voa. É a curva
 * de uma haste presa no chão.
 *
 * A SOMBRA que a folha PROJETA não balança (o material de profundidade da
 * sombra é outro); por isso a grama de vento não projeta sombra — recebe só.
 */
export class Vento {
  /** compartilhados com o shader: mudar o `.value` aqui muda a grama inteira */
  readonly uniforms = {
    uTempo: { value: 0 },
    uForca: { value: 0.12 },
    uRajada: { value: 0 },
    uDirecao: { value: new THREE.Vector2(0.86, 0.5) },
    uAltura: { value: 0.6 },
  };
  private alvoDaRajada = 0;
  private readonly materiais = new Map<string, THREE.MeshToonMaterial>();

  constructor(opts: { forca?: number; altura?: number; direcao?: [number, number] } = {}) {
    if (opts.forca !== undefined) this.uniforms.uForca.value = opts.forca;
    if (opts.altura !== undefined) this.uniforms.uAltura.value = opts.altura;
    if (opts.direcao) this.uniforms.uDirecao.value.set(...opts.direcao).normalize();
  }

  /**
   * O material de vento desta cor (um por cor, guardado). `mapa` e
   * `corPorVertice` são os do `toon()`; `recorte` liga o `alphaTest` (papel
   * recortado num quadradinho com o desenho em canvas).
   *
   * Peça PENDURADA (bandeirola, fantasminha) usa um `Vento` de `altura`
   * NEGATIVA: o peso cresce para baixo da raiz, e a ponta de baixo é que voa.
   */
  material(cor: number, opts: { mapa?: THREE.Texture; corPorVertice?: boolean; recorte?: boolean } = {}): THREE.MeshToonMaterial {
    const chave = `${cor}|${opts.mapa?.uuid ?? ''}|${opts.corPorVertice ? 1 : 0}|${opts.recorte ? 1 : 0}`;
    const hit = this.materiais.get(chave);
    if (hit) return hit;
    const mat = toon(cor, { doubleSide: true, mapa: opts.mapa, corPorVertice: opts.corPorVertice }).clone();
    if (opts.recorte) mat.alphaTest = 0.5;
    const u = this.uniforms;
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
          uniform float uTempo;
          uniform float uForca;
          uniform float uRajada;
          uniform vec2 uDirecao;
          uniform float uAltura;`,
        )
        .replace(
          '#include <project_vertex>',
          `vec4 mvPosition = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vec4 raiz = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #else
            vec4 raiz = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          #endif
          vec4 noMundo = modelMatrix * mvPosition;
          float peso = clamp(position.y / uAltura, 0.0, 1.0);
          peso *= peso;
          float fase = uTempo * 1.7 + raiz.x * 0.45 + raiz.z * 0.31;
          float balanco = sin(fase) * 0.55 + sin(fase * 2.13 + 1.3) * 0.25 + uRajada;
          noMundo.xz += uDirecao * balanco * uForca * peso;
          noMundo.y -= abs(balanco) * uForca * peso * 0.3;
          mvPosition = viewMatrix * noMundo;
          gl_Position = projectionMatrix * mvPosition;`,
        );
    };
    mat.customProgramCacheKey = () => 'lab-vento';
    this.materiais.set(chave, mat);
    return mat;
  }

  /** Uma rajada: o vento sobe até `forca` e volta a acalmar sozinho. */
  soprar(forca = 1.6): void {
    this.alvoDaRajada = forca;
  }

  /** A força da rajada agora (0 = calmo). Serve à cena e ao teste. */
  get rajada(): number {
    return this.uniforms.uRajada.value;
  }

  tique(dt: number): void {
    this.uniforms.uTempo.value += dt;
    const u = this.uniforms.uRajada;
    // sobe rápido, desce devagar: rajada de verdade
    const k = this.alvoDaRajada > u.value ? 6 : 0.9;
    u.value += (this.alvoDaRajada - u.value) * Math.min(1, dt * k);
    this.alvoDaRajada = Math.max(0, this.alvoDaRajada - dt * 0.9);
  }
}

// =========================================================== o chão em grade

/**
 * O CHÃO DO LABORATÓRIO: toon escuro, com a grade de neon desenhada pelo
 * shader (e não por 1.000 linhas de malha). Três camadas, somadas na luz
 * EMISSIVA do toon — é por isso que a sombra da dupla continua caindo nele:
 *
 *  - a grade fina, de metro em metro;
 *  - a grade grossa, a cada `celula` — o contorno de cada estação;
 *  - a ONDA: anéis que saem do centro e correm para fora, como um sinal.
 *
 * As linhas usam `fwidth` (derivada na tela) para ter sempre ~1 pixel de
 * largura, de perto ou de longe — sem isso a grade de 1 m vira chiado quando a
 * câmera abre, e some quando ela fecha.
 */
export interface GradeDoChao {
  material: THREE.MeshToonMaterial;
  uniforms: { uTempo: { value: number } };
}

export function gradeDigital(opts: {
  cor: number;
  linha: number;
  onda: number;
  celula: number;
  /** de onde as ondas saem, no mundo */
  centro?: [number, number];
}): GradeDoChao {
  const mat = toon(opts.cor).clone();
  const uniforms = {
    uTempo: { value: 0 },
    uCorLinha: { value: new THREE.Color(opts.linha) },
    uCorOnda: { value: new THREE.Color(opts.onda) },
    uCelula: { value: opts.celula },
    uCentro: { value: new THREE.Vector2(...(opts.centro ?? [0, 0])) },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vMundoLab;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vMundoLab = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vMundoLab;
        uniform float uTempo;
        uniform vec3 uCorLinha;
        uniform vec3 uCorOnda;
        uniform float uCelula;
        uniform vec2 uCentro;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        vec2 p = vMundoLab.xz;
        vec2 fw = max(fwidth(p), vec2(1e-4));
        vec2 fina = abs(fract(p - 0.5) - 0.5) / fw;
        float linhaFina = 1.0 - min(min(fina.x, fina.y), 1.0);
        vec2 q = (p - uCentro) / uCelula + 0.5;
        vec2 grossa = abs(fract(q - 0.5) - 0.5) * uCelula / fw;
        float linhaGrossa = 1.0 - min(min(grossa.x, grossa.y) / 1.8, 1.0);
        float d = length(p - uCentro);
        float faixa = fract(d * 0.075 - uTempo * 0.22);
        float onda = smoothstep(0.0, 0.025, faixa) * (1.0 - smoothstep(0.025, 0.085, faixa));
        onda *= exp(-d * 0.035);
        totalEmissiveRadiance += uCorLinha * (linhaFina * 0.22 + linhaGrossa * 0.95);
        totalEmissiveRadiance += uCorOnda * onda * (0.1 + linhaFina * 1.1);`,
      );
  };
  mat.customProgramCacheKey = () => 'lab-grade';
  return { material: mat, uniforms };
}

// ============================================================= dissolver

/**
 * O CUBO QUE DESMANCHA: toon com um corte por RUÍDO. Cada ponto da peça tem um
 * valor de ruído fixo (sai da posição dele NA PEÇA, então o desenho do corte
 * não escorrega quando ela gira); quando o `uProgresso` passa desse valor, o
 * pixel é descartado (`discard`). Logo antes do corte, a borda acende — é a
 * brasa do papel queimando.
 *
 * Um material POR PEÇA, e não guardado: o progresso é de cada uma.
 */
export interface Dissolvente {
  material: THREE.MeshToonMaterial;
  /** 0 = inteiro, 1 = sumiu */
  uniforms: { uProgresso: { value: number }; uTempo: { value: number } };
}

export function dissolver(cor: number, corDaBorda: number, escala = 2.6): Dissolvente {
  const mat = toon(cor).clone();
  const uniforms = {
    uProgresso: { value: 0 },
    uTempo: { value: 0 },
    uCorBorda: { value: new THREE.Color(corDaBorda).multiplyScalar(3.2) },
    uEscala: { value: escala },
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vPosPeca;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPosPeca = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vPosPeca;
        uniform float uProgresso;
        uniform float uTempo;
        uniform vec3 uCorBorda;
        uniform float uEscala;
        ${RUIDO_GLSL}`,
      )
      .replace(
        '#include <alphatest_fragment>',
        `#include <alphatest_fragment>
        float valorDoRuido = labNuvem(vPosPeca * uEscala + vec3(0.0, uTempo * 0.15, 0.0));
        float corte = uProgresso * 1.2 - 0.1;
        if (valorDoRuido < corte) discard;
        float brasa = (1.0 - smoothstep(0.0, 0.07, valorDoRuido - corte)) * step(0.001, uProgresso);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += uCorBorda * brasa;`,
      );
  };
  mat.customProgramCacheKey = () => 'lab-dissolver';
  return { material: mat, uniforms };
}

// ============================================================== holograma

/**
 * HOLOGRAMA: luz sem matéria. O contorno acende mais que o miolo (fresnel —
 * onde a superfície fica de perfil para a câmera), linhas de varredura sobem
 * pela peça, e de vez em quando uma fatia dela pula para o lado, como sinal
 * ruim. Soma por cima do que está atrás (`AdditiveBlending`) e não grava
 * profundidade: holograma não tapa nada, só acende.
 */
export interface Holograma {
  material: THREE.ShaderMaterial;
  uniforms: { uTempo: { value: number } };
}

export function holograma(cor: number): Holograma {
  const uniforms = {
    uTempo: { value: 0 },
    uCor: { value: new THREE.Color(cor) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTempo;
      varying vec3 vNormalMundo;
      varying vec3 vMundo;
      float labSorte(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
      void main() {
        vec3 p = position;
        // a fatia que pula: sorteada por faixa de altura e por instante
        float faixa = floor(p.y * 9.0);
        float instante = floor(uTempo * 7.0);
        float pula = step(0.93, labSorte(faixa * 3.1 + instante));
        p.x += pula * 0.06 * sin(instante);
        vec4 mundo = modelMatrix * vec4(p, 1.0);
        vMundo = mundo.xyz;
        vNormalMundo = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * mundo;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTempo;
      uniform vec3 uCor;
      varying vec3 vNormalMundo;
      varying vec3 vMundo;
      void main() {
        vec3 vista = normalize(cameraPosition - vMundo);
        float fresnel = pow(1.0 - abs(dot(vista, normalize(vNormalMundo))), 2.2);
        float varredura = step(0.55, fract(vMundo.y * 14.0 - uTempo * 1.6));
        float tremor = 0.86 + 0.14 * sin(uTempo * 23.0) * sin(uTempo * 5.3);
        float luz = (0.08 + fresnel * 1.45 + varredura * 0.12) * tremor;
        gl_FragColor = vec4(uCor * luz, clamp(luz, 0.0, 1.0));
        #include <colorspace_fragment>
      }
    `,
  });
  return { material, uniforms };
}

// ============================================================ água de pixel

/**
 * O LAGO DE PIXELS: água desenhada inteira no shader, em degraus de cor como o
 * toon (três tons, e não um degradê — é água de desenho). Três coisas mexem:
 *
 *  - os veios de luz do fundo (a cáustica), três senos cruzados que andam;
 *  - a espuma da borda, onde a água encosta na pedra;
 *  - as ONDAS de pedrinha: até quatro de uma vez, cada uma um anel que abre a
 *    partir de onde caiu e some aos poucos. A cena joga uma pedrinha com
 *    `pedrinha(x, z)` e o shader faz o resto — a lista de ondas é um
 *    `uniform vec4[4]` (x, z, quando caiu, força).
 */
export class AguaDePixel {
  readonly material: THREE.ShaderMaterial;
  private readonly ondas = [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, -99, 0));
  private proxima = 0;
  private readonly uniforms: {
    uTempo: { value: number };
    uCentro: { value: THREE.Vector2 };
    uRaio: { value: number };
    uOndas: { value: THREE.Vector4[] };
    uFundo: { value: THREE.Color };
    uRaso: { value: THREE.Color };
    uBrilho: { value: THREE.Color };
  };

  constructor(opts: { centro: [number, number]; raio: number; fundo: number; raso: number; brilho: number }) {
    this.uniforms = {
      uTempo: { value: 0 },
      uCentro: { value: new THREE.Vector2(...opts.centro) },
      uRaio: { value: opts.raio },
      uOndas: { value: this.ondas },
      uFundo: { value: new THREE.Color(opts.fundo) },
      uRaso: { value: new THREE.Color(opts.raso) },
      uBrilho: { value: new THREE.Color(opts.brilho) },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vChao;
        void main() {
          vec4 mundo = modelMatrix * vec4(position, 1.0);
          vChao = mundo.xz;
          gl_Position = projectionMatrix * viewMatrix * mundo;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTempo;
        uniform vec2 uCentro;
        uniform float uRaio;
        uniform vec4 uOndas[4];
        uniform vec3 uFundo;
        uniform vec3 uRaso;
        uniform vec3 uBrilho;
        varying vec2 vChao;
        void main() {
          vec2 p = vChao - uCentro;
          float d = length(p);
          // mais raso perto da borda
          float raso = smoothstep(uRaio * 0.35, uRaio, d);
          vec3 cor = mix(uFundo, uRaso, floor(raso * 2.0 + 0.5) / 2.0);
          // os veios de luz do fundo
          float t = uTempo;
          float veio = sin(p.x * 2.3 + t * 1.1) + sin(p.y * 1.9 - t * 0.9) + sin((p.x + p.y) * 1.4 + t * 1.4);
          float caustica = 1.0 - smoothstep(0.0, 0.32, abs(veio));
          // as pedrinhas
          float anel = 0.0;
          for (int i = 0; i < 4; i++) {
            vec4 o = uOndas[i];
            float idade = t - o.z;
            if (idade < 0.0 || idade > 4.0) continue;
            float r = idade * 1.7;
            float faixa = abs(distance(vChao, o.xy) - r);
            anel += (1.0 - smoothstep(0.0, 0.11, faixa)) * exp(-idade * 0.8) * o.w;
            float r2 = max(0.0, idade - 0.45) * 1.7;
            float faixa2 = abs(distance(vChao, o.xy) - r2);
            anel += (1.0 - smoothstep(0.0, 0.08, faixa2)) * exp(-idade * 1.1) * o.w * 0.6 * step(0.45, idade);
          }
          float espuma = smoothstep(uRaio - 0.32, uRaio - 0.06, d);
          float luz = caustica * 0.55 + anel + espuma;
          // em degraus, como o toon: nada de degradê de foto
          luz = floor(clamp(luz, 0.0, 1.0) * 3.0 + 0.25) / 3.0;
          cor = mix(cor, uBrilho, luz * 0.85);
          gl_FragColor = vec4(cor, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
  }

  /** Uma pedrinha caiu em (x, z): mais uma onda, no lugar da mais velha. */
  pedrinha(x: number, z: number, forca = 1): void {
    this.ondas[this.proxima].set(x, z, this.uniforms.uTempo.value, forca);
    this.proxima = (this.proxima + 1) % this.ondas.length;
  }

  tique(dt: number): void {
    this.uniforms.uTempo.value += dt;
  }
}

// ========================================================== a água do lago

/**
 * O CONTORNO DE UM LAGO: um raio médio e umas ondas em volta dele.
 *
 * Cada onda é `[k, amplitude, fase]` — `k` voltas inteiras de seno em volta do
 * lago, então o contorno fecha sem emenda. A margem e a largura da faixa de
 * areia são feitas do mesmo jeito, e a MESMA conta roda nos dois lados: aqui no
 * TypeScript (a cena pergunta "isto está dentro d'água?") e no shader (que
 * pinta). Um contorno só, escrito uma vez.
 */
export interface FormaDoLago {
  centro: readonly [number, number];
  raio: number;
  margem: ReadonlyArray<readonly [number, number, number]>;
  areia: { base: number; ondas: ReadonlyArray<readonly [number, number, number]> };
}

/** as cores da água, da margem e do que vive nela (todas da paleta) */
export interface CoresDoLago {
  raso: number;
  meio: number;
  fundo: number;
  maisFundo: number;
  crista: number;
  espuma: number;
  areia: number;
  areiaMolhada: number;
  peixe: number;
  moeda: number;
}

/** quantas marolas o shader desenha de uma vez (a mais velha dá lugar) */
const MAROLAS = 12;
/**
 * quantos bichos deixam rastro na água de uma vez (patos, garça, pedrinha —
 * e as duas vagas de cima são de quem só aparece num evento: o Nessie de
 * plástico do Halloween)
 */
const RASTROS = 14;
/** quantas sombras de peixe nadam debaixo d'água */
const PEIXES = 6;
/** quantas coisas paradas furam a água (pilar, pedra, junco, tronco) */
const ESTACAS = 20;

function somaDeOndas(nome: string, base: string, ondas: ReadonlyArray<readonly [number, number, number]>): string {
  const termos = ondas.map(([k, amp, f]) => `${amp.toFixed(4)} * sin(${k.toFixed(1)} * a + ${f.toFixed(4)})`);
  return `float ${nome}(float a) { return ${base} + ${termos.join(' + ')}; }`;
}

/**
 * ============================================ A ÁGUA DO LAGO DO VILLA LOBOS
 *
 * Toon ESTENDIDO, e não shader próprio: a água continua recebendo a sombra do
 * junco e da árvore, apagando com a noite e ficando laranja no nascer do sol —
 * tudo isso vem do three; só a pintura da superfície é nossa. Um desenho só
 * para a água E a areia, numa malha só, e é por isso que a margem pode ser
 * torta: o contorno é uma conta no shader, e não a borda de um polígono.
 *
 * DE DENTRO PARA FORA:
 *
 *  - **as faixas de fundo**: raso turquesa na beira, azul no meio e azul fundo
 *    no centro, em DEGRAUS como o toon — com a borda de cada degrau mexida por
 *    ruído, que é o que tira a cara de alvo de tiro;
 *  - **o veio de luz** do raso (a cáustica), fraquinho, só na faixa clara;
 *  - **as marolinhas do vento**: traços claros cruzados ao vento, andando na
 *    direção dele — mais e mais longos quando vem uma rajada (o mesmo `Vento`
 *    que balança o junco);
 *  - **as sombras dos peixes**, escuras e macias, nadando por baixo;
 *  - **o rastro dos patos**: o V aberto atrás de quem nada, tracejado pelas
 *    cristas, e o anelzinho de espuma em volta do corpo;
 *  - **as marolas**: os anéis que abrem de onde algo tocou a água (a
 *    pedrinha quicando, o peixe pulando, a garça bicando, o dedo no mouse);
 *  - **a espuma** em volta de tudo que fura a superfície (pilar do deque,
 *    pedra, junco), indo e voltando;
 *  - **a beira**: a água avança e recua na areia, deixa uma faixa molhada, e
 *    uma segunda linha de espuma vem chegando atrás;
 *  - **a areia**: grão miúdo, e a borda com a grama torta e lisa.
 *
 * O BRILHO DO SOL entra pela LUZ, e não pela cor: o `RE_Direct` do toon é
 * embrulhado por um que, para cada luz direta, soma uma faísca onde a água
 * cintila. Assim a faísca vem na cor da luz (branca de dia, laranja no nascer,
 * azulada e fraca à noite) e SOME NA SOMBRA — o three já multiplicou a sombra
 * na cor da luz antes de chamar o `RE_Direct`. E quanto mais a superfície
 * espelha a luz para a câmera, mais faísca: na isométrica isso dá o lago
 * inteiro cintilando por igual; virada contra o sol (ou na tomada do nascer
 * do sol), mais faísca e mais forte no caminho da luz.
 *
 * A BORDA DE FORA (areia com grama) é um `alphaTest` com `alphaToCoverage`: o
 * multisample do renderer suaviza o recorte, e a água continua opaca e na
 * fila dos decalques de chão (ela é um, e quem dá o lugar dela na fila é o
 * `w.disc` da cena).
 */
export class AguaDoLago {
  readonly material: THREE.MeshToonMaterial;
  readonly forma: FormaDoLago;
  /** o tamanho da malha: até onde a areia pode chegar, com folga */
  readonly raioDaMalha: number;
  private readonly marolas = Array.from({ length: MAROLAS }, () => new THREE.Vector4(0, 0, -99, 0));
  private proxima = 0;
  private readonly rastros = Array.from({ length: RASTROS }, () => new THREE.Vector4(0, 0, 0, 0));
  private readonly peixes = Array.from({ length: PEIXES }, () => new THREE.Vector4(0, 0, 0, 0));
  private readonly estacas = Array.from({ length: ESTACAS }, () => new THREE.Vector4(0, 0, 0, 0));
  readonly uniforms: {
    uTempo: { value: number };
    uVento: { value: THREE.Vector2 };
    uRajada: { value: number };
    uMarolas: { value: THREE.Vector4[] };
    uRastros: { value: THREE.Vector4[] };
    uPeixes: { value: THREE.Vector4[] };
    uEstacas: { value: THREE.Vector4[] };
    /** (x, z, raio): onde o fundo é cheio de moeda */
    uMoedas: { value: THREE.Vector3 };
    /** (x, z, quando caiu): a moedinha que acabou de afundar */
    uMoedaNova: { value: THREE.Vector3 };
  };

  /** as cores da água no shader (uniformes): `trocarCores` mexe nelas */
  private readonly coresDoShader: Record<string, { value: THREE.Color | THREE.Vector2 }>;

  constructor(forma: FormaDoLago, cores: CoresDoLago) {
    this.forma = forma;
    const picoDaMargem = forma.raio + forma.margem.reduce((s, [, amp]) => s + Math.abs(amp), 0);
    const picoDaAreia = forma.areia.base + forma.areia.ondas.reduce((s, [, amp]) => s + Math.abs(amp), 0);
    this.raioDaMalha = picoDaMargem + picoDaAreia + 0.3;
    this.uniforms = {
      uTempo: { value: 0 },
      uVento: { value: new THREE.Vector2(0.86, 0.5).normalize() },
      uRajada: { value: 0 },
      uMarolas: { value: this.marolas },
      uRastros: { value: this.rastros },
      uPeixes: { value: this.peixes },
      uEstacas: { value: this.estacas },
      uMoedas: { value: new THREE.Vector3(0, 0, 0) },
      uMoedaNova: { value: new THREE.Vector3(0, 0, -99) },
    };
    const cor = (c: number): THREE.Color => new THREE.Color(c);
    const fixos = {
      uCentro: { value: new THREE.Vector2(forma.centro[0], forma.centro[1]) },
      uRaso: { value: cor(cores.raso) },
      uMeio: { value: cor(cores.meio) },
      uFundo: { value: cor(cores.fundo) },
      uMaisFundo: { value: cor(cores.maisFundo) },
      uCrista: { value: cor(cores.crista) },
      uEspuma: { value: cor(cores.espuma) },
      uAreia: { value: cor(cores.areia) },
      uAreiaMolhada: { value: cor(cores.areiaMolhada) },
      uPeixe: { value: cor(cores.peixe) },
      uMoeda: { value: cor(cores.moeda) },
    };
    this.coresDoShader = fixos;

    const mat = toon(cores.meio, { decal: true }).clone();
    mat.alphaTest = 0.5;
    mat.alphaToCoverage = true;
    const u = this.uniforms;
    const margem = somaDeOndas('raioDaMargem', forma.raio.toFixed(4), forma.margem);
    const areia = somaDeOndas('larguraDaAreia', forma.areia.base.toFixed(4), forma.areia.ondas);
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u, fixos);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vChaoDoLago;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          vChaoDoLago = (modelMatrix * vec4(transformed, 1.0)).xz;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec2 vChaoDoLago;
          uniform float uTempo;
          uniform vec2 uVento;
          uniform float uRajada;
          uniform vec4 uMarolas[${MAROLAS}];
          uniform vec4 uRastros[${RASTROS}];
          uniform vec4 uPeixes[${PEIXES}];
          uniform vec4 uEstacas[${ESTACAS}];
          uniform vec3 uMoedas;
          uniform vec3 uMoedaNova;
          uniform vec2 uCentro;
          uniform vec3 uRaso;
          uniform vec3 uMeio;
          uniform vec3 uFundo;
          uniform vec3 uMaisFundo;
          uniform vec3 uCrista;
          uniform vec3 uEspuma;
          uniform vec3 uAreia;
          uniform vec3 uAreiaMolhada;
          uniform vec3 uPeixe;
          uniform vec3 uMoeda;
          ${RUIDO_GLSL}
          ${margem}
          ${areia}
          float lagoSorte(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
          /*
           * a faixa macia de um traço: 1 no centro, 0 a partir de \`largura\`,
           * com um pixel de borda. O tamanho do pixel (\`px\`, em metros) vem
           * de fora, medido uma vez no topo: derivada dentro de laço com
           * \`continue\` é indefinida (cada pixel do quadradinho de 2×2 pode
           * ter tomado um caminho)
           */
          float lagoTraco(float d, float largura, float px) {
            return 1.0 - smoothstep(largura - px, largura + px, abs(d));
          }
          /* a faísca de um azulejo: um ponto com cruzinha, que acende e apaga no seu tempo */
          float lagoFaisca(vec2 p, float escala, float tempo, float semente, float pxNoMundo) {
            vec2 c = p * escala;
            vec2 id = floor(c);
            vec2 f = fract(c) - 0.5;
            float h = lagoSorte(id + semente);
            // só um azulejo em cinco tem faísca, e ela acende rápido e apaga:
            // água cintila, não chuvisca
            if (lagoSorte(id + semente + 7.7) < 0.78) return 0.0;
            vec2 onde = (vec2(lagoSorte(id + semente + 1.7), lagoSorte(id + semente + 3.1)) - 0.5) * 0.55;
            float vida = pow(max(0.0, sin(tempo * (0.9 + h * 1.6) + h * 6.2831)), 12.0);
            vec2 q = (f - onde) / max(vida, 0.001);
            float px = pxNoMundo * escala / max(vida, 0.001);
            float miolo = 1.0 - smoothstep(0.07, 0.07 + px * 1.5, length(q));
            float cruz = (1.0 - smoothstep(0.012, 0.012 + px, min(abs(q.x), abs(q.y)))) * (1.0 - smoothstep(0.08, 0.26, length(q)));
            return max(miolo, cruz * 0.8) * step(0.0001, vida);
          }`,
        )
        .replace(
          '#include <lights_toon_pars_fragment>',
          `#include <lights_toon_pars_fragment>
          vec3 lagoBrilho = vec3(0.0);
          float lagoFaiscas = 0.0;
          vec3 lagoNormal = vec3(0.0, 0.0, 1.0);
          void RE_Direct_Lago( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
            RE_Direct_Toon( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            vec3 meio = normalize( directLight.direction + geometryViewDir );
            float espelha = max( dot( lagoNormal, meio ), 0.0 );
            // só a faísca, mais forte onde a água espelha a luz para a câmera: um
            // reflexo contínuo aqui virava mancha branca de nuvem na água
            // quando a câmera olha contra o sol
            lagoBrilho += directLight.color * lagoFaiscas * ( 0.4 + 1.5 * pow( espelha, 24.0 ) );
          }
          #undef RE_Direct
          #define RE_Direct RE_Direct_Lago`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          {
            float t = uTempo;
            vec2 mundo = vChaoDoLago;
            // quanto mede um pixel, em metros (uma vez, aqui em cima: ver \`lagoTraco\`)
            float px = max(length(fwidth(mundo)) * 0.7071, 1e-4);
            vec2 p = mundo - uCentro;
            float d = length(p);
            float ang = atan(p.y, p.x);
            float margem = raioDaMargem(ang);
            float areia = larguraDaAreia(ang);
            float mancha = labNuvem(vec3(mundo * 0.33, 1.3));
            // a beira vai e vem: a água sobe 12 cm na areia e volta
            float vaiVem = 0.5 + 0.5 * sin(t * 1.05 + ang * 3.0 + mancha * 5.0);
            float dentro = margem - d + vaiVem * 0.12;

            // ------------------------------------------------- a areia
            float grao = lagoSorte(floor(mundo * 26.0));
            vec3 cor = uAreia * (0.95 + grao * 0.07) * (0.97 + mancha * 0.06);
            // a faixa molhada: até onde a água chegou, e escurece perto dela
            float molhada = smoothstep(-0.42, -0.02, margem - d + 0.12);
            cor = mix(cor, uAreiaMolhada * (0.96 + grao * 0.05), molhada);

            // ------------------------------------------------- a água
            // as derivadas ficam TODAS aqui em cima, fora de \`if\`: dentro de
            // um desvio que cada pixel toma de um jeito, elas não valem nada
            float aaBeira = max(fwidth(dentro), 1e-4);
            float agua = smoothstep(-aaBeira, aaBeira, dentro);
            float fundura = dentro + (mancha - 0.5) * 1.1;
            float aaF = max(fwidth(fundura), 1e-4);
            float foraLiso = d - (margem + areia);
            float aaFora = max(fwidth(foraLiso), 1e-4);
            vec2 vento = normalize(uVento);

            /*
             * SÓ ONDE TEM ÁGUA (ou quase: a beira molhada): o pixel de areia e
             * o de grama não pagam pela água. O lago e a areia são manchas
             * grandes e inteiras, então o desvio é o mesmo para a vizinhança
             * toda e não custa nada à placa de vídeo — e o renderizador por
             * software do teste (e o celular fraco) agradecem.
             */
            if (dentro > -0.3) {
              vec3 corDaAgua = uRaso;
              corDaAgua = mix(corDaAgua, uMeio, smoothstep(0.8 - aaF, 0.8 + aaF, fundura));
              corDaAgua = mix(corDaAgua, uFundo, smoothstep(2.5 - aaF, 2.5 + aaF, fundura));
              corDaAgua = mix(corDaAgua, uMaisFundo, smoothstep(4.6 - aaF, 4.6 + aaF, fundura));

              // o veio de luz do raso
              // (só no raso: no fundo ela vale zero, e não precisa ser conta)
              if (fundura < 1.5) {
                float veio = abs(sin(p.x * 2.1 + t * 0.7 + sin(p.y * 1.6 - t * 0.5) * 1.3) + sin(p.y * 2.3 - t * 0.6 + sin(p.x * 1.4 + t * 0.4) * 1.2));
                float caustica = (1.0 - smoothstep(0.0, 0.22, veio)) * (1.0 - smoothstep(0.3, 1.5, fundura));
                corDaAgua = mix(corDaAgua, uCrista, caustica * 0.3);
              }

              // as moedas do fundo, perto do deque ("o fundo do lago é cheio de moeda")
              if (uMoedas.z > 0.0) {
                float perto = 1.0 - smoothstep(uMoedas.z * 0.6, uMoedas.z, distance(mundo, uMoedas.xy));
                if (perto > 0.0) {
                  vec2 c = mundo * 4.6;
                  vec2 id = floor(c);
                  float tem = step(0.9, lagoSorte(id + 9.3));
                  vec2 onde = (vec2(lagoSorte(id + 2.2), lagoSorte(id + 5.9)) - 0.5) * 0.6;
                  vec2 q = fract(c) - 0.5 - onde;
                  q.x *= 1.0 + lagoSorte(id + 4.4) * 0.8;
                  float moeda = lagoTraco(length(q), 0.12, px * 4.6) * tem * perto;
                  corDaAgua = mix(corDaAgua, uMoeda, moeda * 0.75);
                }
              }
              // a moedinha que acabou de cair: afunda encolhendo
              float idadeDaMoeda = t - uMoedaNova.z;
              if (idadeDaMoeda > 0.0 && idadeDaMoeda < 2.6) {
                float some = 1.0 - idadeDaMoeda / 2.6;
                float moeda = lagoTraco(distance(mundo, uMoedaNova.xy), 0.05 * some + 0.02, px);
                corDaAgua = mix(corDaAgua, uMoeda, moeda * (0.5 + 0.5 * some));
              }

              // as sombras dos peixes
              for (int i = 0; i < ${PEIXES}; i++) {
                vec4 peixe = uPeixes[i];
                if (peixe.w <= 0.0) continue;
                vec2 rel = mundo - peixe.xy;
                if (abs(rel.x) > peixe.w * 2.2 || abs(rel.y) > peixe.w * 2.2) continue;
                vec2 frente = vec2(sin(peixe.z), cos(peixe.z));
                float u = dot(rel, frente) / peixe.w;
                float v = dot(rel, vec2(frente.y, -frente.x)) / peixe.w;
                // o corpo ondula: a cauda mexe mais que a cabeça
                v += sin(u * 3.2 - t * 7.5) * 0.09 * (0.6 - u);
                float corpo = length(vec2(u * 0.75, v / 0.36)) - 0.75;
                float cauda = max(abs(v) - (-u - 0.85) * 0.75, max(u + 0.85, -u - 1.45));
                float forma = min(corpo, cauda * 1.4);
                float sombra = 1.0 - smoothstep(-0.12, 0.14, forma);
                corDaAgua = mix(corDaAgua, uPeixe, sombra * 0.42 * smoothstep(0.3, 1.1, fundura));
              }

              // as marolinhas do vento
              vec2 deLado = vec2(-vento.y, vento.x);
              float ao = dot(p, vento);
              float ac = dot(p, deLado);
              if (dentro > 0.4) {
                float torto = labRuido(vec3(ac * 0.55, ao * 0.22, t * 0.12));
                float onda = fract(ao * 1.45 - t * (0.42 + uRajada * 0.35) + torto * 2.2);
                float crista = smoothstep(0.0, 0.05, onda) * (1.0 - smoothstep(0.05, 0.13, onda));
                float tracos = smoothstep(0.62 - uRajada * 0.14, 0.8 - uRajada * 0.1, labRuido(vec3(ac * 2.1, ao * 0.45, t * 0.3 + 3.0)));
                float marolinha = crista * tracos * smoothstep(0.4, 1.5, dentro);
                corDaAgua = mix(corDaAgua, uCrista, marolinha * (0.32 + uRajada * 0.22));
              }

              // as marolas (anéis abrindo)
              float anel = 0.0;
              float cava = 0.0;
              for (int i = 0; i < ${MAROLAS}; i++) {
                vec4 m = uMarolas[i];
                float idade = t - m.z;
                if (m.w <= 0.0 || idade < 0.0 || idade > 3.6) continue;
                float raio = idade * (0.85 + m.w * 0.35);
                float r = distance(mundo, m.xy);
                if (r > raio + 0.5) continue;
                float some = exp(-idade * 1.05) * min(m.w, 1.6);
                float largura = 0.035 + idade * 0.018;
                anel += lagoTraco(r - raio, largura, px) * some;
                anel += lagoTraco(r - (raio - 0.32), largura * 0.8, px) * some * 0.55 * step(0.32, raio);
                cava += lagoTraco(r - (raio - largura * 3.0), largura * 1.4, px) * some * 0.5;
              }

              // o rastro de quem nada: o V e o anel de espuma em volta do corpo
              float rastro = 0.0;
              float contato = 0.0;
              for (int i = 0; i < ${RASTROS}; i++) {
                vec4 b = uRastros[i];
                if (b.w <= 0.0) continue;
                float tam = floor(b.w) / 10.0;
                float vel = fract(b.w);
                vec2 rel = mundo - b.xy;
                if (abs(rel.x) > 3.4 || abs(rel.y) > 3.4) continue;
                vec2 frente = vec2(sin(b.z), cos(b.z));
                float atras = -dot(rel, frente);
                float lado = abs(dot(rel, vec2(frente.y, -frente.x)));
                float r = length(rel);
                contato += lagoTraco(r - 0.26 * tam, 0.025 + 0.01 * tam, px) * (0.55 + 0.25 * sin(t * 3.0 + float(i)));
                if (vel > 0.02 && atras > 0.0) {
                  // o V é curto e fino, e some aos poucos: rastro de pato é
                  // delicado (comprido e forte, virava esteira de lancha)
                  float comprimento = (0.5 + vel * 1.3) * tam;
                  float braco = lagoTraco(lado - atras * 0.36 - 0.1 * tam, 0.016 + atras * 0.01, px);
                  float tracejado = smoothstep(0.05, 0.6, sin(atras * 15.0 / max(tam, 0.4) - t * 8.0));
                  float some = pow(max(0.0, 1.0 - atras / comprimento), 1.5);
                  rastro += braco * tracejado * some * vel;
                }
              }

              // a espuma em volta do que fura a água
              float colar = 0.0;
              for (int i = 0; i < ${ESTACAS}; i++) {
                vec4 e = uEstacas[i];
                if (e.z <= 0.0) continue;
                vec2 rel = mundo - e.xy;
                if (abs(rel.x) > e.z + 0.5 || abs(rel.y) > e.z + 0.5) continue;
                float r = length(rel) - e.z;
                float pulso = 0.5 + 0.5 * sin(t * 1.6 + e.w * 6.28);
                colar += lagoTraco(r - 0.03 - pulso * 0.05, 0.022, px) * 0.9;
                colar += lagoTraco(r - 0.16 - pulso * 0.1, 0.014, px) * 0.45 * (1.0 - pulso * 0.6);
              }

              // a espuma da beira: a linha onde a água encosta, picotada, e a
              // segunda linha chegando atrás dela
              float beira = 0.0;
              float segunda = 0.0;
              if (dentro < 0.6) {
                float picote = smoothstep(0.32, 0.55, labRuido(vec3(ang * 11.0, d * 0.5, t * 0.25)));
                beira = lagoTraco(dentro - 0.04, 0.035, px) * (0.55 + 0.45 * picote);
                float chegando = 0.18 + (1.0 - vaiVem) * 0.32;
                segunda = lagoTraco(dentro - chegando, 0.022, px) * picote * 0.6;
              }

              float claro = clamp(anel + rastro * 0.55 + contato + colar + beira + segunda, 0.0, 1.0);
              corDaAgua = mix(corDaAgua, corDaAgua * 0.82, clamp(cava, 0.0, 0.6));
              corDaAgua = mix(corDaAgua, uEspuma, claro * 0.92);

              cor = mix(cor, corDaAgua, agua);

              // ------------------------------------------- a faísca do sol
              // (lida na luz, no RE_Direct_Lago: aqui só a máscara e a normal)
              float fundoBastante = smoothstep(0.5, 1.6, dentro);
              if (fundoBastante > 0.0) {
                float faisca = lagoFaisca(mundo + vento * t * 0.25, 2.2, t, 0.0, px) + lagoFaisca(mundo - vento * t * 0.18, 3.6, t * 1.3, 17.0, px) * 0.6;
                lagoFaiscas = faisca * fundoBastante * (0.75 + uRajada * 0.4) * (1.0 - claro);
              }
              // a normal da superfície, mexida pelas mesmas ondas, em espaço de
              // vista — só onde tem faísca, que é o único lugar em que ela conta
              if (lagoFaiscas > 0.0) {
                float e1 = labRuido(vec3(mundo * 1.7 + vento * t * 0.6, t * 0.4));
                float e2 = labRuido(vec3(mundo.yx * 1.7 - vento * t * 0.5, t * 0.4 + 5.0));
                vec3 normalNoMundo = normalize(vec3((e1 - 0.5) * 0.5, 1.0, (e2 - 0.5) * 0.5));
                lagoNormal = normalize((viewMatrix * vec4(normalNoMundo, 0.0)).xyz) * agua;
              }
            }

            // ---------------------------------------- a borda com a grama
            // o ruído da borda só perto dela; a medida do pixel é a da borda lisa
            float fora = foraLiso;
            if (foraLiso > -0.4) fora += (labRuido(vec3(mundo * 1.9, 7.0)) - 0.5) * 0.2;
            diffuseColor.rgb = cor;
            diffuseColor.a = clamp(0.5 - fora / aaFora * 0.5, 0.0, 1.0);
          }`,
        )
        .replace(
          '#include <lights_fragment_end>',
          `#include <lights_fragment_end>
          totalEmissiveRadiance += lagoBrilho;`,
        );
    };
    mat.customProgramCacheKey = () => 'agua-do-lago';
    this.material = mat;
  }

  // ------------------------------------------------------- o contorno no TS

  /** o raio da margem (até onde vai a água) no ângulo `a`, a partir do centro */
  raioDaMargem(a: number): number {
    return this.forma.raio + this.forma.margem.reduce((s, [k, amp, f]) => s + amp * Math.sin(k * a + f), 0);
  }

  /** a largura da faixa de areia no ângulo `a` */
  larguraDaAreia(a: number): number {
    const ar = this.forma.areia;
    return ar.base + ar.ondas.reduce((s, [k, amp, f]) => s + amp * Math.sin(k * a + f), 0);
  }

  /** o ângulo do ponto (x, z) em volta do centro, do jeito que o shader conta */
  angulo(x: number, z: number): number {
    return Math.atan2(z - this.forma.centro[1], x - this.forma.centro[0]);
  }

  /** um ponto da beira no ângulo `a`, recuado `recuo` para dentro d'água */
  naBeira(a: number, recuo = 0): { x: number; z: number } {
    const r = this.raioDaMargem(a) - recuo;
    return { x: this.forma.centro[0] + Math.cos(a) * r, z: this.forma.centro[1] + Math.sin(a) * r };
  }

  /** quanto o ponto está para dentro d'água (negativo: na areia ou na grama) */
  fundura(x: number, z: number): number {
    const d = Math.hypot(x - this.forma.centro[0], z - this.forma.centro[1]);
    return this.raioDaMargem(this.angulo(x, z)) - d;
  }

  // ---------------------------------------------------------- o que mexe

  /**
   * Repinta a água (um evento: o lago de gelatina de uva do Halloween). As
   * cores são uniformes do shader: trocar não recompila nada, e a cena
   * seguinte nasce com as cores de sempre.
   */
  trocarCores(cores: Partial<CoresDoLago>): void {
    const u = this.coresDoShader as Record<string, { value: unknown }>;
    const nomes: Record<keyof CoresDoLago, string> = {
      raso: 'uRaso', meio: 'uMeio', fundo: 'uFundo', maisFundo: 'uMaisFundo', crista: 'uCrista', espuma: 'uEspuma',
      areia: 'uAreia', areiaMolhada: 'uAreiaMolhada', peixe: 'uPeixe', moeda: 'uMoeda',
    };
    for (const [chave, hex] of Object.entries(cores) as Array<[keyof CoresDoLago, number]>) {
      const alvo = u[nomes[chave]]?.value;
      if (alvo instanceof THREE.Color) alvo.set(hex);
    }
  }

  /** algo tocou a água em (x, z): um anel que abre */
  marola(x: number, z: number, forca = 1): void {
    this.marolas[this.proxima].set(x, z, this.uniforms.uTempo.value, forca);
    this.proxima = (this.proxima + 1) % MAROLAS;
  }

  /**
   * Quem está nadando na vaga `i` agora. `tamanho` é a escala do bicho (o
   * patinho é metade do pato) e `velocidade` vai de 0 (boiando parado: só o
   * anel em volta) a 1 (o V inteiro). Tamanho 0 apaga a vaga.
   */
  rastro(i: number, x: number, z: number, rumo: number, velocidade: number, tamanho = 1): void {
    const v = this.rastros[i];
    if (!v) return;
    if (tamanho <= 0) {
      v.w = 0;
      return;
    }
    v.set(x, z, rumo, Math.round(Math.max(0.1, tamanho) * 10) + Math.min(0.99, Math.max(0, velocidade)));
  }

  /** a sombra do peixe da vaga `i`; tamanho 0 apaga */
  peixe(i: number, x: number, z: number, rumo: number, tamanho: number): void {
    this.peixes[i]?.set(x, z, rumo, tamanho);
  }

  /** as coisas paradas que furam a água: [x, z, raio]; o resto das vagas apaga */
  furos(lista: ReadonlyArray<readonly [number, number, number]>): void {
    this.estacas.forEach((v, i) => {
      const e = lista[i];
      if (e) v.set(e[0], e[1], e[2], (i * 0.37) % 1);
      else v.set(0, 0, 0, 0);
    });
  }

  /** onde o fundo é cheio de moeda */
  moedas(x: number, z: number, raio: number): void {
    this.uniforms.uMoedas.value.set(x, z, raio);
  }

  /** uma moedinha caiu agora em (x, z) */
  moedaCaiu(x: number, z: number): void {
    this.uniforms.uMoedaNova.value.set(x, z, this.uniforms.uTempo.value);
    this.marola(x, z, 0.7);
  }

  /** o vento que mexe as marolinhas (o mesmo do junco) */
  soprar(direcao: THREE.Vector2, rajada: number): void {
    this.uniforms.uVento.value.copy(direcao);
    this.uniforms.uRajada.value = rajada;
  }

  get tempo(): number {
    return this.uniforms.uTempo.value;
  }

  /** o relógio (o `dt` da cena: pausa com o mundo) */
  tique(dt: number): void {
    this.uniforms.uTempo.value += dt;
  }
}

// ================================================================== portal

/**
 * O PORTAL DE SAÍDA: um redemoinho em coordenada POLAR — o ângulo gira com o
 * tempo e entorta com o raio, e é isso que faz a espiral. Cor do ciano para o
 * rosa conforme o braço da espiral, miolo branco. Acima de 1 no miolo, para o
 * brilho da tela pegar.
 */
export interface Portal {
  material: THREE.ShaderMaterial;
  uniforms: { uTempo: { value: number }; uForca: { value: number } };
}

export function portal(corA: number, corB: number): Portal {
  const uniforms = {
    uTempo: { value: 0 },
    uForca: { value: 1 },
    uCorA: { value: new THREE.Color(corA) },
    uCorB: { value: new THREE.Color(corB) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTempo;
      uniform float uForca;
      uniform vec3 uCorA;
      uniform vec3 uCorB;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;
        float a = atan(p.y, p.x);
        float espiral = sin(a * 3.0 + r * 9.0 - uTempo * 3.2);
        float bracos = smoothstep(0.1, 0.9, espiral * 0.5 + 0.5);
        vec3 cor = mix(uCorA, uCorB, bracos);
        float miolo = 1.0 - smoothstep(0.0, 0.45, r);
        cor = mix(cor, vec3(1.0), miolo * 0.55);
        float borda = smoothstep(1.0, 0.82, r);
        float luz = (0.5 + bracos * 0.45 + miolo * 0.8) * uForca;
        gl_FragColor = vec4(cor * luz, borda * clamp(0.55 + bracos * 0.45 + miolo, 0.0, 1.0));
        #include <colorspace_fragment>
      }
    `,
  });
  return { material, uniforms };
}

// ============================================================ chama de gás

/**
 * A CHAMA DE GÁS do fogareiro de montanha (`world/cozinhaDeAcampamento.ts`):
 * luz sem matéria, como o holograma — soma por cima do que está atrás e não
 * grava profundidade. O degradê é o de chama de gás de verdade: AZUL fundo na
 * base, azul-claro no meio e a ponta quase branca, sumindo.
 *
 * O TREMOR é todo no vertex: a geometria tem a base em `y = 0` e a ponta em
 * `y = 1` (a malha escala para o tamanho certo), então `position.y` é a
 * altura relativa. A ponta balança para os lados com ruído (a base fica
 * presa no queimador, por `h²`) e a altura pulsa — e a fase de cada língua
 * sai da posição dela no MUNDO, então as linguinhas da coroa (um
 * `InstancedMesh`) tremem cada uma no seu tempo, como o vento da grama.
 *
 * `uForca` (0 a 1, um pouco mais no estouro de quando acende) é a válvula: a
 * chama encolhe, afina e apaga junto. Um material por fogareiro: o relógio e
 * a válvula são dele.
 */
export class ChamaDeGas {
  readonly uniforms = {
    uTempo: { value: 0 },
    uForca: { value: 0 },
    uBase: { value: new THREE.Color() },
    uMeio: { value: new THREE.Color() },
    uPonta: { value: new THREE.Color() },
  };
  readonly material: THREE.ShaderMaterial;

  constructor(base: number, meio: number, ponta: number) {
    this.uniforms.uBase.value.setHex(base);
    this.uniforms.uMeio.value.setHex(meio);
    this.uniforms.uPonta.value.setHex(ponta);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        uniform float uTempo;
        uniform float uForca;
        varying float vAltura;
        varying float vBorda;
        ${RUIDO_GLSL}
        void main() {
          vec3 p = position;
          float h = clamp(p.y, 0.0, 1.0);
          mat4 modelo = modelMatrix;
          #ifdef USE_INSTANCING
            modelo = modelMatrix * instanceMatrix;
          #endif
          vec3 raiz = (modelo * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          float semente = dot(raiz, vec3(131.0, 77.0, 53.0));
          // a altura pulsa (cada língua no seu tempo), e a válvula manda nela
          float sobe = 0.8 + 0.4 * labRuido(vec3(semente, uTempo * 7.5, 0.3));
          p.y *= sobe * uForca;
          // a ponta dança, a base fica presa no queimador
          float t = uTempo * 5.2 + semente;
          float solta = h * h;
          p.x += (labRuido(vec3(t, h * 2.6, 1.7)) - 0.5) * 0.55 * solta;
          p.z += (labRuido(vec3(t, h * 2.6, 6.1)) - 0.5) * 0.55 * solta;
          // pouco gás, chama fininha
          p.xz *= mix(0.55, 1.0, clamp(uForca, 0.0, 1.0));
          vAltura = h;
          vec3 n = normalize(normalMatrix * normal);
          vBorda = abs(n.z);
          gl_Position = projectionMatrix * viewMatrix * modelo * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uForca;
        uniform vec3 uBase;
        uniform vec3 uMeio;
        uniform vec3 uPonta;
        varying float vAltura;
        varying float vBorda;
        void main() {
          vec3 cor = mix(uBase, uMeio, smoothstep(0.0, 0.5, vAltura));
          cor = mix(cor, uPonta, smoothstep(0.55, 1.0, vAltura));
          // a ponta some, e a borda do cone (de perfil) é macia
          float a = (1.0 - smoothstep(0.3, 1.0, vAltura)) * smoothstep(0.02, 0.5, vBorda);
          a *= clamp(uForca * 1.2, 0.0, 1.0);
          // somada (aditiva) e com as línguas se cruzando, cor cheia estourava
          // em branco: a chama de gás é AZUL, só a pontinha clareia
          gl_FragColor = vec4(cor * 0.85, a * 0.8);
          #include <colorspace_fragment>
        }
      `,
    });
  }

  /** o relógio do tremor (o `dt` da cena: pausa junto com o mundo) */
  avancar(dt: number): void {
    this.uniforms.uTempo.value += dt;
  }

  set forca(v: number) {
    this.uniforms.uForca.value = v;
  }

  get forca(): number {
    return this.uniforms.uForca.value;
  }
}

// ============================================================ gelo do rinque

export interface OpcoesDoGelo {
  /** a cor do gelo (multiplica a pista) */
  cor: number;
  /** o desenho do rinque inteiro (`geloDaPista`): é o `map` do material */
  pista: THREE.Texture;
  /** o azulejo miúdo dos arranhões e da geada, e o tamanho dele em metros */
  detalhe: THREE.Texture;
  ladoDoDetalhe: number;
  /** o POR DENTRO (dado: vermelho escurece para o fundo, verde clareia) */
  porDentro: THREE.Texture;
  ladoPorDentro: number;
  /** o azul do gelo fundo, o que a trinca e a nuvem de baixo puxam */
  corDoFundo: number;
  /** onde fica o rinque e o tamanho dele (para os riscos da dupla) */
  centro: readonly [number, number];
  tamanho: readonly [number, number];
}

/** quantos pixels de risco por metro de rinque (a tela dos riscos) */
const RISCOS_POR_METRO = 512 / 13.2;

/**
 * O GELO DO RINQUE: toon estendido (o degrau de luz, a sombra e a névoa
 * continuam do three) em cima da pista pintada (`world/texturasDeGelo.ts`),
 * com quatro coisas que só o shader faz:
 *
 *  - o DETALHE em coordenada de mundo, azulejo de 2 m multiplicado por cima
 *    do desenho do rinque (que é um canvas só, de 1024 px para 13 m: sozinho
 *    ele borra de perto);
 *  - a FUNDURA: o desenho de dentro (trinca, estrela de batida, bolha presa,
 *    a nuvem azul do gelo grosso) é lido DESLOCADO pela direção da câmera —
 *    o ponto que está 12 cm debaixo da superfície, no raio que sai do olho.
 *    Com a câmera parada isso é só um desenho; quando ela gira (Q/R), as
 *    trincas andam por baixo dos riscos de patim, e é isso que faz o olho
 *    ler gelo transparente e não piso pintado. Duas camadas, em escala e
 *    fundura diferentes, para não repetir;
 *  - o CINTILAR: faíscas que acendem e apagam cada uma no seu tempo, na cor
 *    do sol e só onde o sol bate (a sombra recebida apaga) — a mesma faísca
 *    da água do lago, mais miúda e mais rara;
 *  - os RISCOS DA DUPLA: uma tela própria (canvas de dado) do tamanho do
 *    rinque, onde a cena risca por onde a dupla passa de patins
 *    (`riscar`). Ela sobe para a placa de vídeo no máximo quatro vezes por
 *    segundo, e só quando mudou.
 *
 * O relógio é o `tique(dt)` da cena (pausa com o mundo).
 */
export class GeloDoRinque {
  readonly material: THREE.MeshToonMaterial;
  readonly uniforms: { uTempo: { value: number } };
  private readonly tela: HTMLCanvasElement;
  private readonly pincel: CanvasRenderingContext2D | null;
  private readonly riscos: THREE.CanvasTexture;
  private readonly centro: readonly [number, number];
  private readonly tamanho: readonly [number, number];
  private sujo = false;
  private desdeAUltima = 0;

  constructor(o: OpcoesDoGelo) {
    this.centro = o.centro;
    this.tamanho = o.tamanho;
    this.tela = document.createElement('canvas');
    this.tela.width = Math.round(o.tamanho[0] * RISCOS_POR_METRO);
    this.tela.height = Math.round(o.tamanho[1] * RISCOS_POR_METRO);
    this.pincel = this.tela.getContext('2d');
    if (this.pincel) {
      this.pincel.fillStyle = '#000000';
      this.pincel.fillRect(0, 0, this.tela.width, this.tela.height);
      this.pincel.lineCap = 'round';
    }
    this.riscos = new THREE.CanvasTexture(this.tela);
    this.uniforms = { uTempo: { value: 0 } };
    const u = this.uniforms;
    const fixos = {
      uDetalhe: { value: o.detalhe },
      uLadoDoDetalhe: { value: o.ladoDoDetalhe },
      uPorDentro: { value: o.porDentro },
      uLadoPorDentro: { value: o.ladoPorDentro },
      uCorDoFundo: { value: new THREE.Color(o.corDoFundo) },
      uRiscos: { value: this.riscos },
      uCentro: { value: new THREE.Vector2(o.centro[0], o.centro[1]) },
      uTamanho: { value: new THREE.Vector2(o.tamanho[0], o.tamanho[1]) },
    };

    const mat = toon(o.cor, { decal: true, mapa: o.pista }).clone();
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u, fixos);
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vChaoDoGelo;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          vChaoDoGelo = (modelMatrix * vec4(transformed, 1.0)).xz;`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec2 vChaoDoGelo;
          uniform float uTempo;
          uniform sampler2D uDetalhe;
          uniform float uLadoDoDetalhe;
          uniform sampler2D uPorDentro;
          uniform float uLadoPorDentro;
          uniform vec3 uCorDoFundo;
          uniform sampler2D uRiscos;
          uniform vec2 uCentro;
          uniform vec2 uTamanho;
          float geloSorte(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
          /* a faísca de um azulejo: um ponto com cruzinha, que acende e apaga no seu tempo */
          float geloFaisca(vec2 p, float escala, float tempo, float semente, float pxNoMundo) {
            vec2 c = p * escala;
            vec2 id = floor(c);
            vec2 f = fract(c) - 0.5;
            float h = geloSorte(id + semente);
            // um azulejo em doze: gelo cintila, não chuvisca
            if (geloSorte(id + semente + 7.7) < 0.92) return 0.0;
            vec2 onde = (vec2(geloSorte(id + semente + 1.7), geloSorte(id + semente + 3.1)) - 0.5) * 0.6;
            float vida = pow(max(0.0, sin(tempo * (0.7 + h * 1.4) + h * 6.2831)), 16.0);
            vec2 q = (f - onde) / max(vida, 0.001);
            float px = pxNoMundo * escala / max(vida, 0.001);
            float miolo = 1.0 - smoothstep(0.06, 0.06 + px * 1.5, length(q));
            float cruz = (1.0 - smoothstep(0.01, 0.01 + px, min(abs(q.x), abs(q.y)))) * (1.0 - smoothstep(0.07, 0.24, length(q)));
            return max(miolo, cruz * 0.8) * step(0.0001, vida);
          }`,
        )
        .replace(
          '#include <lights_toon_pars_fragment>',
          `#include <lights_toon_pars_fragment>
          vec3 geloBrilho = vec3(0.0);
          float geloFaiscas = 0.0;
          void RE_Direct_Gelo( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
            RE_Direct_Toon( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
            // na cor da luz, e só onde ela chega: a sombra recebida já vem descontada
            geloBrilho += directLight.color * geloFaiscas * 0.75;
          }
          #undef RE_Direct
          #define RE_Direct RE_Direct_Gelo`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          {
            vec2 mundo = vChaoDoGelo;
            // o tamanho do pixel, em metros (fora de desvio: derivada)
            float px = max(length(fwidth(mundo)) * 0.7071, 1e-4);

            // o detalhe miúdo, por cima do desenho do rinque
            diffuseColor.rgb *= texture2D(uDetalhe, mundo / uLadoDoDetalhe).rgb;

            // A FUNDURA: o raio da câmera continua por baixo da superfície
            vec3 frente = -vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
            vec2 porMetro = frente.xz / max(0.25, -frente.y);
            // vermelho: a nuvem funda; verde: bolha e brilho de trinca; azul: a trinca
            vec3 raso = texture2D(uPorDentro, (mundo + porMetro * 0.12) / uLadoPorDentro).rgb;
            // a camada de baixo só traz a nuvem e as bolhas, noutra escala (sem repetir trinca)
            vec3 fundo = texture2D(uPorDentro, (vec2(mundo.y, -mundo.x) + porMetro * 0.3) / (uLadoPorDentro * 1.7) + 0.37).rgb;
            float escuro = max(raso.r, fundo.r * 0.7) * 0.7 + raso.b * 0.45;
            float claro = raso.g * 0.55 + fundo.g * fundo.g * 0.18;
            diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * uCorDoFundo, min(1.0, escuro));
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), claro);

            // os riscos que a dupla deixou patinando
            vec2 naPista = vec2((mundo.x - uCentro.x) / uTamanho.x + 0.5, 0.5 - (mundo.y - uCentro.y) / uTamanho.y);
            float risco = texture2D(uRiscos, naPista).r;
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), risco * 0.85);

            geloFaiscas = geloFaisca(mundo, 2.6, uTempo, 0.0, px) + 0.6 * geloFaisca(mundo, 4.3, uTempo * 1.2, 4.2, px);
          }`,
        )
        .replace(
          '#include <lights_fragment_end>',
          `#include <lights_fragment_end>
          totalEmissiveRadiance += geloBrilho;`,
        );
    };
    mat.customProgramCacheKey = () => 'gelo-do-rinque';
    this.material = mat;
  }

  /**
   * Um risco de patim de (x0, z0) até (x1, z1), em metros do mundo. `forca`
   * de 0 a 1 é o quanto ele fica branco (quem corre risca mais fundo).
   */
  riscar(x0: number, z0: number, x1: number, z1: number, forca: number): void {
    const p = this.pincel;
    if (!p) return;
    const W = this.tela.width;
    const H = this.tela.height;
    const sx = W / this.tamanho[0];
    const sz = H / this.tamanho[1];
    p.strokeStyle = `rgba(255,255,255,${Math.min(1, Math.max(0, forca))})`;
    p.lineWidth = 1.2;
    p.beginPath();
    p.moveTo((x0 - this.centro[0]) * sx + W / 2, (z0 - this.centro[1]) * sz + H / 2);
    p.lineTo((x1 - this.centro[0]) * sx + W / 2, (z1 - this.centro[1]) * sz + H / 2);
    p.stroke();
    this.sujo = true;
  }

  /** o relógio (o `dt` da cena) e a subida dos riscos novos, no máximo 4 por segundo */
  tique(dt: number): void {
    this.uniforms.uTempo.value += dt;
    this.desdeAUltima += dt;
    if (this.sujo && this.desdeAUltima > 0.25) {
      this.riscos.needsUpdate = true;
      this.sujo = false;
      this.desdeAUltima = 0;
    }
  }
}

// ================================================================== cristalino

const cristalinos = new Map<string, THREE.MeshToonMaterial>();

/**
 * O GELO DE CRISTAL das peças da praça do Mano (as lascas, o poste, os
 * pingentes): o toon de cor POR VÉRTICE (a peça pinta o degradê dela — fundo
 * azul embaixo, quase branco na ponta), translúcido, e com a BORDA ACESA: a
 * faceta que vira de lado para a câmera clareia (o fresnel de uma pedra
 * lapidada), e a que olha de frente fica com a cor dela. Com as facetas
 * chatas (geometria sem índice), cada face acende de um jeito — é isso que
 * faz ler gelo lapidado, e não plástico azul.
 *
 * Cacheado como o `toon()`. A geometria PRECISA do atributo `color` (sem ele
 * o three lê preto).
 */
export function cristalino(opacidade = 0.84, borda = 0.6): THREE.MeshToonMaterial {
  const chave = `${opacidade}|${borda}`;
  const pronto = cristalinos.get(chave);
  if (pronto) return pronto;
  const mat = toon(0xffffff, { corPorVertice: true, opacity: opacidade, glow: 0.1 }).clone();
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uBorda = { value: borda };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uBorda;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          vec3 olhar = isOrthographic ? vec3(0.0, 0.0, 1.0) : normalize(vViewPosition);
          float lado = 1.0 - abs(dot(normalize(normal), olhar));
          totalEmissiveRadiance += vec3(0.8, 0.94, 1.0) * pow(lado, 2.2) * uBorda;
        }`,
      );
  };
  mat.customProgramCacheKey = () => `cristalino:${borda}`;
  cristalinos.set(chave, mat);
  return mat;
}
