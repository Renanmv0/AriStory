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

  /** O material de vento desta cor (um por cor, guardado). */
  material(cor: number): THREE.MeshToonMaterial {
    const chave = `${cor}`;
    const hit = this.materiais.get(chave);
    if (hit) return hit;
    const mat = toon(cor, { doubleSide: true }).clone();
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
