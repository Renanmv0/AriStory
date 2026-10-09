import * as THREE from 'three';
import { toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import { PALETTE as P } from '../../palette';
import { css, desenhoExtra, desenharDeOutroLugar, etiqueta, pedestal, semSombra } from './comum';

/**
 * ===================================== ESTAÇÃO DE TEXTURAS
 *
 * Textura é uma imagem colada numa superfície. O jogo não aceita imagem de
 * arquivo nenhuma, então as quatro daqui nascem de outro jeito:
 *
 *  - o TELÃO é um `<canvas>` redesenhado doze vezes por segundo
 *    (`CanvasTexture` + `needsUpdate`): o letreiro, o plasma e o relógio são
 *    desenho 2D comum, que a textura leva para o 3D;
 *  - a TV AO VIVO mostra o que uma SEGUNDA câmera vê, desenhado numa textura
 *    fora da tela (`WebGLRenderTarget`) — o mesmo truque do espelho da
 *    boutique;
 *  - os QUADROS DE PIXEL são 16 × 16 bytes escritos à mão (`DataTexture`),
 *    mostrados lado a lado com os dois filtros: `Nearest` (cada pixel um
 *    quadradinho, a pixel art) e `Linear` (borrado, o filtro de foto);
 *  - a BOLA ESPELHADA, no meio da praça, fotografa a cena para os seis lados
 *    (`CubeCamera`) e usa as seis fotos como reflexo — cada facetinha reflete
 *    uma direção, e é por isso que ela parece globo de discoteca.
 */

// ================================================================== telão

const CORACAO_TELAO = [
  '..XX...XX..',
  '.XXXX.XXXX.',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
  '.XXXXXXXXX.',
  '..XXXXXXX..',
  '...XXXXX...',
  '....XXX....',
  '.....X.....',
];

export type ProgramaDoTelao = 'letreiro' | 'plasma' | 'relogio';

export interface Telao {
  grupo: THREE.Group;
  readonly programa: ProgramaDoTelao;
  trocarPrograma(): ProgramaDoTelao;
  tique(dt: number): void;
  descartar(): void;
}

export function telao(): Telao {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'telao';
  const LARG = 3.4;
  const ALT = LARG * (9 / 16);
  const Y = 1.0 + ALT / 2;

  // a estrutura: dois pés, a moldura e a tela
  for (const lado of [-1, 1] as const) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.14, Y, 0.14), toon(P.labPedestal));
    pe.position.set(lado * (LARG / 2 - 0.3), Y / 2, -0.12);
    grupo.add(pe);
  }
  const moldura = new THREE.Mesh(new THREE.BoxGeometry(LARG + 0.22, ALT + 0.22, 0.16), toon(P.labChaoBorda));
  moldura.position.set(0, Y, -0.06);
  grupo.add(moldura);
  const aro = new THREE.Mesh(new THREE.BoxGeometry(LARG + 0.3, 0.04, 0.04), neon(P.labRosa, 2));
  aro.position.set(0, Y + ALT / 2 + 0.13, 0);
  grupo.add(semSombra(aro));

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 288;
  const ctx = canvas.getContext('2d');
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  // a tela acende: um pouco acima de 1, para o brilho da tela pegar o claro
  const material = new THREE.MeshBasicMaterial({ map: textura });
  material.color.setScalar(1.25);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(LARG, ALT), material);
  tela.position.set(0, Y, 0.025);
  grupo.add(semSombra(tela));

  // o plasma é calculado num canvas pequeno e esticado: fica com cara de pixel
  const miudo = document.createElement('canvas');
  miudo.width = 128;
  miudo.height = 72;
  const ctxMiudo = miudo.getContext('2d');
  const imagem = ctxMiudo?.createImageData(128, 72) ?? null;

  const barras = new Array(12).fill(0.3);
  let programa: ProgramaDoTelao = 'letreiro';
  let tempo = 0;
  let acumulado = 1;

  const desenhar = (): void => {
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    if (programa === 'plasma' && ctxMiudo && imagem) {
      const d = imagem.data;
      for (let y = 0; y < 72; y++) {
        for (let x = 0; x < 128; x++) {
          const v =
            Math.sin(x * 0.07 + tempo) +
            Math.sin(y * 0.09 - tempo * 1.3) +
            Math.sin((x + y) * 0.045 + tempo * 0.7) +
            Math.sin(Math.hypot(x - 64, y - 36) * 0.11 - tempo * 1.6);
          const k = (v + 4) / 8;
          const i = (y * 128 + x) * 4;
          // do azul de tela para o rosa e o amarelo do laboratório
          d[i] = Math.round(40 + 215 * Math.max(0, Math.sin(k * Math.PI * 2.2)));
          d[i + 1] = Math.round(30 + 190 * Math.max(0, Math.sin(k * Math.PI * 1.4 + 1.2)));
          d[i + 2] = Math.round(120 + 135 * Math.max(0, Math.cos(k * Math.PI * 1.8)));
          d[i + 3] = 255;
        }
      }
      ctxMiudo.putImageData(imagem, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(miudo, 0, 0, W, H);
    } else {
      ctx.fillStyle = css(P.labCeu);
      ctx.fillRect(0, 0, W, H);
      // a grade de pontinhos do fundo
      ctx.fillStyle = 'rgba(63, 224, 255, 0.12)';
      for (let y = 8; y < H; y += 16) for (let x = 8; x < W; x += 16) ctx.fillRect(x, y, 2, 2);
    }

    if (programa === 'letreiro') {
      // o coração de pixel batendo no meio
      const batida = Math.max(0, Math.sin(tempo * 7)) ** 6;
      const lado = 13 + batida * 2;
      const ox = W / 2 - (11 * lado) / 2;
      const oy = H / 2 - (10 * lado) / 2 - 14;
      ctx.fillStyle = css(P.heart);
      CORACAO_TELAO.forEach((linha, j) => {
        for (let i = 0; i < linha.length; i++) {
          if (linha[i] === 'X') ctx.fillRect(ox + i * lado, oy + j * lado, lado - 1, lado - 1);
        }
      });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox + 2 * lado, oy + 2 * lado, lado - 1, lado - 1);
      // o equalizador dos dois lados
      barras.forEach((b, i) => {
        barras[i] += ((0.15 + Math.abs(Math.sin(tempo * (2 + i * 0.37) + i)) * 0.85) - b) * 0.35;
        const altura = barras[i] * 120;
        const x = i < 6 ? 26 + i * 16 : W - 26 - (i - 5) * 16;
        ctx.fillStyle = i % 2 ? css(P.labCiano) : css(P.labRoxo);
        ctx.fillRect(x, H - 52 - altura, 10, altura);
      });
      // o letreiro correndo embaixo
      ctx.font = `800 26px "Nunito", ui-rounded, system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      const frase = '♥ AriStory • versão de teste • tudo aqui é feito de código ♥   ';
      const largura = ctx.measureText(frase).width;
      const x = W - ((tempo * 70) % (largura + W));
      ctx.fillStyle = css(P.labAmarelo);
      ctx.fillText(frase, x, H - 24);
      ctx.fillText(frase, x + largura, H - 24);
    }

    if (programa === 'relogio') {
      const agora = new Date();
      const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dia = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = css(P.labCiano);
      ctx.font = `800 92px ui-monospace, "Menlo", monospace`;
      ctx.fillText(hora, W / 2, H / 2 - 10);
      ctx.fillStyle = css(P.labBranco);
      ctx.font = `700 26px "Nunito", ui-rounded, system-ui, sans-serif`;
      ctx.fillText(dia, W / 2, H / 2 + 58);
      ctx.textAlign = 'start';
    }

    // AO VIVO, piscando, em todo programa
    if (Math.floor(tempo * 1.5) % 2 === 0) {
      ctx.fillStyle = '#ff4d5e';
      ctx.beginPath();
      ctx.arc(26, 26, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 20px "Nunito", ui-rounded, system-ui, sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText('AO VIVO', 42, 27);
    textura.needsUpdate = true;
  };
  desenhar();

  return {
    grupo,
    get programa() {
      return programa;
    },
    trocarPrograma() {
      programa = programa === 'letreiro' ? 'plasma' : programa === 'plasma' ? 'relogio' : 'letreiro';
      acumulado = 1;
      return programa;
    },
    descartar() {
      textura.dispose();
      material.dispose();
    },
    tique(dt) {
      tempo += dt;
      acumulado += dt;
      // doze desenhos por segundo bastam para tela de letreiro, e poupam o celular
      if (acumulado < 1 / 12) return;
      acumulado = 0;
      desenhar();
    },
  };
}

// ============================================================ TV ao vivo

export type CanalDaTv = 'seguranca' | 'de-cima' | 'chuvisco';

export interface TvAoVivo {
  /** a TV, com a tela que mostra a câmera */
  grupo: THREE.Group;
  /** a câmera de segurança num poste — a cena posiciona e ela gira sozinha */
  cameraDeSeguranca: THREE.Group;
  readonly canal: CanalDaTv;
  trocarCanal(): CanalDaTv;
  /** quantos quadros a câmera virtual já desenhou (o teste confere) */
  readonly desenhos: number;
  tique(dt: number): void;
  descartar(): void;
}

/**
 * @param deCima o ponto do mundo que o canal "de cima" enquadra
 */
export function tvAoVivo(deCima: THREE.Vector3): TvAoVivo {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'tv-ao-vivo';

  // a TV de tubo: caixa funda, quatro pezinhos e a antena em V
  for (const [x, z] of [[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]] as const) {
    const pe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.5, 8), toon(P.labMetal));
    pe.position.set(x, 0.25, z);
    grupo.add(pe);
  }
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.92, 0.78), toon(P.labPedestalClaro));
  corpo.position.y = 0.5 + 0.46;
  grupo.add(corpo);
  for (const lado of [-1, 1] as const) {
    const vareta = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6), toon(P.labMetal));
    vareta.position.set(lado * 0.17, 1.42 + 0.3, -0.1);
    vareta.rotation.z = -lado * 0.5;
    grupo.add(vareta);
  }
  const botao = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 12), neon(P.labVerde, 2));
  botao.rotation.x = Math.PI / 2;
  botao.position.set(0.47, 0.72, 0.4);
  grupo.add(semSombra(botao));

  const alvo = new THREE.WebGLRenderTarget(320, 240, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
  const materialAoVivo = new THREE.MeshBasicMaterial({ map: alvo.texture });

  // o chuvisco: ruído num canvas, redesenhado a cada quadro em que aparece
  const chuvisco = document.createElement('canvas');
  chuvisco.width = 96;
  chuvisco.height = 72;
  const ctxChuvisco = chuvisco.getContext('2d');
  const texturaChuvisco = new THREE.CanvasTexture(chuvisco);
  texturaChuvisco.colorSpace = THREE.SRGBColorSpace;
  const materialChuvisco = new THREE.MeshBasicMaterial({ map: texturaChuvisco });
  const pintarChuvisco = (): void => {
    if (!ctxChuvisco) return;
    const img = ctxChuvisco.createImageData(96, 72);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctxChuvisco.putImageData(img, 0, 0);
    texturaChuvisco.needsUpdate = true;
  };

  const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.66), materialAoVivo);
  tela.position.set(-0.08, 0.98, 0.395);
  grupo.add(semSombra(tela));

  // o "● REC" e o nome do canal, num canvas transparente na frente da tela
  const sobre = document.createElement('canvas');
  sobre.width = 256;
  sobre.height = 188;
  const ctxSobre = sobre.getContext('2d');
  const texturaSobre = new THREE.CanvasTexture(sobre);
  texturaSobre.colorSpace = THREE.SRGBColorSpace;
  const letreiro = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.66),
    new THREE.MeshBasicMaterial({ map: texturaSobre, transparent: true, depthWrite: false }),
  );
  letreiro.position.set(-0.08, 0.98, 0.4);
  grupo.add(semSombra(letreiro));

  // a câmera de segurança: poste, braço e a cabeça que vai e volta
  const cameraDeSeguranca = new THREE.Group();
  cameraDeSeguranca.userData.peca = 'camera-de-seguranca';
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 2.7, 10), toon(P.labMetal));
  poste.position.y = 1.35;
  cameraDeSeguranca.add(poste);
  const cabeca = new THREE.Group();
  cabeca.position.y = 2.75;
  cameraDeSeguranca.add(cabeca);
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.42), toon(P.labBranco));
  caixa.position.z = 0.1;
  cabeca.add(caixa);
  const lente = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 14), toon(P.labPedestal));
  lente.rotation.x = Math.PI / 2;
  lente.position.z = 0.33;
  cabeca.add(lente);
  const luzinha = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), neon(P.labVermelho, 2.6));
  luzinha.position.set(0.06, 0.07, 0.3);
  cabeca.add(semSombra(luzinha));

  const camera = new THREE.PerspectiveCamera(52, 320 / 240, 0.1, 70);
  let canal: CanalDaTv = 'seguranca';
  let trocando = 0;
  let pula = false;
  let desenhos = 0;
  let tempo = 0;
  let relogioDoLetreiro = 1;
  const mira = new THREE.Vector3();

  const pintarLetreiro = (): void => {
    if (!ctxSobre) return;
    ctxSobre.clearRect(0, 0, 256, 188);
    ctxSobre.font = `800 18px "Nunito", ui-rounded, system-ui, sans-serif`;
    ctxSobre.textBaseline = 'middle';
    if (canal !== 'chuvisco') {
      if (Math.floor(tempo * 2) % 2 === 0) {
        ctxSobre.fillStyle = '#ff4d5e';
        ctxSobre.beginPath();
        ctxSobre.arc(18, 18, 6, 0, Math.PI * 2);
        ctxSobre.fill();
      }
      ctxSobre.fillStyle = '#ffffff';
      ctxSobre.fillText('REC', 30, 19);
      ctxSobre.textAlign = 'right';
      ctxSobre.fillText(canal === 'seguranca' ? 'CAM 1' : 'CAM 2', 244, 19);
      const agora = new Date().toLocaleTimeString('pt-BR');
      ctxSobre.fillText(agora, 244, 170);
      ctxSobre.textAlign = 'left';
    } else {
      ctxSobre.fillStyle = '#ffffff';
      ctxSobre.fillText('CANAL 3', 14, 19);
    }
    texturaSobre.needsUpdate = true;
  };
  pintarLetreiro();

  /*
   * O desenho da câmera virtual acontece no gancho da própria tela: o three só
   * chama isto quando a tela vai ser desenhada — com a TV fora do quadro, a
   * câmera não custa nada. E um quadro sim, um não.
   */
  tela.onBeforeRender = (renderer, cena) => {
    if (trocando > 0 || canal === 'chuvisco' || desenhoExtra.ocupado) return;
    pula = !pula;
    if (pula) return;
    if (canal === 'seguranca') {
      lente.getWorldPosition(camera.position);
      cabeca.localToWorld(mira.set(0, -1.2, 6));
      camera.lookAt(mira);
    } else {
      camera.position.set(deCima.x + 0.01, deCima.y + 10, deCima.z);
      camera.lookAt(deCima);
    }
    camera.updateMatrixWorld();
    desenharDeOutroLugar(renderer, cena as THREE.Scene, camera, alvo, tela);
    desenhos++;
  };

  return {
    grupo,
    cameraDeSeguranca,
    get canal() {
      return canal;
    },
    get desenhos() {
      return desenhos;
    },
    descartar() {
      alvo.dispose();
      texturaChuvisco.dispose();
      texturaSobre.dispose();
      materialAoVivo.dispose();
      materialChuvisco.dispose();
    },
    trocarCanal() {
      canal = canal === 'seguranca' ? 'de-cima' : canal === 'de-cima' ? 'chuvisco' : 'seguranca';
      // entre um canal e outro, meio segundo de chuvisco: é TV de tubo
      trocando = 0.45;
      relogioDoLetreiro = 1;
      return canal;
    },
    tique(dt) {
      tempo += dt;
      trocando = Math.max(0, trocando - dt);
      // a cabeça da câmera de segurança varre de um lado para o outro
      cabeca.rotation.y = Math.sin(tempo * 0.45) * 0.55;
      const chiando = trocando > 0 || canal === 'chuvisco';
      tela.material = chiando ? materialChuvisco : materialAoVivo;
      if (chiando) pintarChuvisco();
      relogioDoLetreiro += dt;
      if (relogioDoLetreiro > 0.5) {
        relogioDoLetreiro = 0;
        pintarLetreiro();
      }
    },
  };
}

// ======================================================= quadros de pixel

export interface QuadrosDePixel {
  grupo: THREE.Group;
  tique(dt: number): void;
  readonly texturas: { nearest: THREE.DataTexture; linear: THREE.DataTexture };
  descartar(): void;
}

/**
 * Pinta o coração 16 × 16 nos bytes: o contorno da fórmula do coração
 * (`(x² + y² − 1)³ − x²y³ ≤ 0`), com a borda num rosa mais escuro e um brilho
 * branco no lobo esquerdo. `escala` maior = coração maior (é a batida).
 */
function pintarCoracaoDePixel(dados: Uint8Array, escala: number): void {
  const fundo = new THREE.Color(P.labChao);
  const corpo = new THREE.Color(P.heart);
  const borda = new THREE.Color(P.labRosa).multiplyScalar(0.7);
  const dentro = (i: number, j: number): boolean => {
    const x = (i - 7.5) / escala;
    const y = (8.6 - j) / escala;
    const a = x * x + y * y - 1;
    return a * a * a - x * x * y * y * y <= 0;
  };
  for (let j = 0; j < 16; j++) {
    for (let i = 0; i < 16; i++) {
      // a textura nasce de baixo para cima: a linha 0 dos bytes é o pé do quadro
      const k = ((15 - j) * 16 + i) * 4;
      let c = fundo;
      if (dentro(i, j)) {
        const naBorda = !dentro(i - 1, j) || !dentro(i + 1, j) || !dentro(i, j - 1) || !dentro(i, j + 1);
        c = naBorda ? borda : corpo;
      }
      // a cor da paleta já vem em linear no THREE.Color; o byte é sRGB
      const s = c.clone().convertLinearToSRGB();
      dados[k] = Math.round(s.r * 255);
      dados[k + 1] = Math.round(s.g * 255);
      dados[k + 2] = Math.round(s.b * 255);
      dados[k + 3] = 255;
    }
  }
  // o brilhinho: dois pixels brancos no lobo esquerdo
  for (const [i, j] of [[4, 5], [5, 4]] as const) {
    if (!dentro(i, j)) continue;
    const k = ((15 - j) * 16 + i) * 4;
    dados[k] = 255;
    dados[k + 1] = 255;
    dados[k + 2] = 255;
  }
}

export function quadrosDePixel(): QuadrosDePixel {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'quadros-de-pixel';
  const dados = new Uint8Array(16 * 16 * 4);
  pintarCoracaoDePixel(dados, 6.4);

  const criar = (filtro: THREE.MagnificationTextureFilter): THREE.DataTexture => {
    const t = new THREE.DataTexture(dados, 16, 16, THREE.RGBAFormat);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = filtro;
    t.minFilter = filtro;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  };
  const nearest = criar(THREE.NearestFilter);
  const linear = criar(THREE.LinearFilter);

  // dois cavaletes lado a lado, ao longo do eixo da tela da câmera de sempre
  ([[nearest, 'Nearest', -0.62], [linear, 'Linear', 0.62]] as const).forEach(([textura, nome, x]) => {
    const cavalete = new THREE.Group();
    cavalete.position.x = x;
    grupo.add(cavalete);
    for (const [lx, lz, inc] of [[-0.32, 0.12, 0.12], [0.32, 0.12, -0.12], [0, -0.3, 0]] as const) {
      const perna = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.7, 0.05), toon(P.labMetal));
      perna.position.set(lx, 0.82, lz);
      perna.rotation.set(lz < 0 ? -0.22 : 0.08, 0, inc);
      cavalete.add(perna);
    }
    const quadro = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.98, 0.06), toon(P.labPedestalClaro));
    quadro.position.set(0, 1.3, 0.16);
    quadro.rotation.x = -0.1;
    cavalete.add(quadro);
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.86), new THREE.MeshBasicMaterial({ map: textura }));
    tela.position.set(0, 1.3, 0.195);
    tela.rotation.x = -0.1;
    cavalete.add(semSombra(tela));
    const nomeDoFiltro = etiqueta(nome, 1.1, 0.3, nome === 'Nearest' ? P.labCiano : P.labRosa);
    nomeDoFiltro.position.set(0, 0.66, 0.26);
    cavalete.add(nomeDoFiltro);
  });

  let tempo = 0;
  let batendo = false;
  return {
    grupo,
    texturas: { nearest, linear },
    descartar() {
      nearest.dispose();
      linear.dispose();
    },
    tique(dt) {
      tempo += dt;
      // o coração bate: troca entre dois desenhos, escrevendo nos MESMOS bytes
      const agora = Math.sin(tempo * 5) > 0.55;
      if (agora === batendo) return;
      batendo = agora;
      pintarCoracaoDePixel(dados, batendo ? 7.2 : 6.4);
      nearest.needsUpdate = true;
      linear.needsUpdate = true;
    },
  };
}

// ======================================================= a bola espelhada

export interface BolaEspelhada {
  grupo: THREE.Group;
  readonly bola: THREE.Mesh;
  /** quantas vezes ela já fotografou a cena para os seis lados */
  readonly fotos: number;
  tique(dt: number): void;
  descartar(): void;
}

export function bolaEspelhada(): BolaEspelhada {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'bola-espelhada';
  grupo.add(pedestal(0.42, 0.55, P.labPedestal, P.labRoxo));

  const alvo = new THREE.WebGLCubeRenderTarget(128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  const cubo = new THREE.CubeCamera(0.3, 70, alvo);

  // facetas: sem vértice compartilhado, cada triângulo tem a normal dele — e
  // cada um reflete UMA direção, como o espelhinho do globo de discoteca
  const geo = new THREE.IcosahedronGeometry(0.72, 3).toNonIndexed();
  geo.computeVertexNormals();
  const espelho = new THREE.MeshBasicMaterial({ envMap: alvo.texture });
  // um pouco acima de 1: o reflexo do neon passa do limiar e a bola cintila
  espelho.color.setScalar(1.6);
  const bola = new THREE.Mesh(geo, espelho);
  bola.position.y = 2.5;
  grupo.add(semSombra(bola));

  // o anel que segura a bola no ar: neon girando por baixo dela
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.03, 8, 40), neon(P.labRoxo, 2.2));
  anel.rotation.x = Math.PI / 2;
  anel.position.y = 1.55;
  grupo.add(semSombra(anel));

  let fotos = 0;
  let conta = 0;
  bola.onBeforeRender = (renderer, cena) => {
    // as seis fotos custam seis cenas: uma vez a cada quatro quadros
    if (desenhoExtra.ocupado || ++conta % 4 !== 1) return;
    desenhoExtra.ocupado = true;
    bola.getWorldPosition(cubo.position);
    cubo.updateMatrixWorld();
    bola.visible = false;
    const sombra = renderer.shadowMap.autoUpdate;
    renderer.shadowMap.autoUpdate = false;
    cubo.update(renderer, cena as THREE.Scene);
    renderer.shadowMap.autoUpdate = sombra;
    bola.visible = true;
    desenhoExtra.ocupado = false;
    fotos++;
  };

  let tempo = 0;
  return {
    grupo,
    bola,
    get fotos() {
      return fotos;
    },
    descartar() {
      alvo.dispose();
      espelho.dispose();
    },
    tique(dt) {
      tempo += dt;
      bola.rotation.y = tempo * 0.35;
      bola.position.y = 2.5 + Math.sin(tempo * 1.1) * 0.08;
      anel.rotation.z = tempo * 0.8;
      anel.position.y = 1.55 + Math.sin(tempo * 1.1) * 0.05;
    },
  };
}
