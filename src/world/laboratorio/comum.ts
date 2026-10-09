import * as THREE from 'three';
import { toon } from '../../core/materials';
import { neon } from '../../core/shaders';
import { PALETTE as P } from '../../palette';

/**
 * ============================== O KIT DO LABORATÓRIO — as peças de todo canto
 *
 * O laboratório é o mundo dentro do computador do Ari: uma plataforma
 * flutuando no escuro, com uma estação por skill de Three.js. Cada estação
 * tem o arquivo dela nesta pasta; aqui mora o que todas usam — a placa que diz
 * o que é cada estação, o rótulo que flutua em cima das coisas, o pedestal com
 * aro de neon e a mola que faz as peças pularem quando alguém mexe nelas.
 *
 * Texto, aqui como no resto do jogo, é desenhado em `<canvas>` na hora: é a
 * única textura que o projeto aceita (nenhuma imagem entra no repositório).
 */

const FONTE = '"Nunito", ui-rounded, system-ui, sans-serif';

/** Cor do canvas a partir da paleta (o canvas fala CSS, não número). */
export function css(cor: number): string {
  return `#${cor.toString(16).padStart(6, '0')}`;
}

/**
 * Marca uma peça para NÃO projetar sombra. O `w.add()` liga a sombra de toda
 * malha que entra no mundo; holograma, neon e luz que projetam sombra parecem
 * objeto sólido. A cena chama `ajustarSombras()` depois do `w.add()`.
 */
export function semSombra<T extends THREE.Object3D>(obj: T): T {
  obj.userData.semSombra = true;
  return obj;
}

/** Desliga a sombra projetada do que foi marcado com `semSombra` (e de tudo dentro). */
export function ajustarSombras(raiz: THREE.Object3D): void {
  raiz.traverse((n) => {
    let marcado = false;
    let p: THREE.Object3D | null = n;
    while (p) {
      if (p.userData.semSombra) {
        marcado = true;
        break;
      }
      p = p.parent;
    }
    if (marcado && (n as THREE.Mesh).isMesh) n.castShadow = false;
  });
}

// ------------------------------------------------------------------ texto

/**
 * Um canvas com o título grande e as linhas pequenas embaixo, centralizado.
 * A letra encolhe até caber (a lição do `letreiro()`: placa com texto comprido
 * vazava pelos lados).
 */
function pintarTexto(
  titulo: string,
  linhas: readonly string[],
  largura: number,
  altura: number,
  corTitulo: string,
  corLinha: string,
  fundo: string | null,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  if (fundo) {
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, largura, altura);
  }
  const margem = largura * 0.07;
  const caber = (texto: string, px: number, peso: string): number => {
    let tamanho = px;
    ctx.font = `${peso} ${tamanho}px ${FONTE}`;
    while (tamanho > 10 && ctx.measureText(texto).width > largura - margem * 2) {
      tamanho -= 2;
      ctx.font = `${peso} ${tamanho}px ${FONTE}`;
    }
    return tamanho;
  };
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const tamTitulo = caber(titulo, Math.round(altura * (linhas.length ? 0.3 : 0.56)), '800');
  const alturaLinha = altura * 0.16;
  const blocoLinhas = linhas.length * alturaLinha;
  const yTitulo = linhas.length ? altura / 2 - blocoLinhas / 2 - tamTitulo * 0.15 : altura / 2;
  ctx.fillStyle = corTitulo;
  ctx.font = `800 ${tamTitulo}px ${FONTE}`;
  ctx.fillText(titulo, largura / 2, yTitulo);
  linhas.forEach((linha, i) => {
    const tam = caber(linha, Math.round(altura * 0.115), '700');
    ctx.font = `700 ${tam}px ${FONTE}`;
    ctx.fillStyle = corLinha;
    ctx.fillText(linha, largura / 2, yTitulo + tamTitulo * 0.62 + alturaLinha * (i + 0.6));
  });
  return canvas;
}

function texturaDe(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/**
 * A PLACA DE UMA ESTAÇÃO: dois pés, a chapa escura com aro de neon e o texto
 * (o nome da skill em cima, o que ela mostra embaixo). Olha para `+Z`; a cena
 * gira para a câmera.
 */
export function placaDoLab(titulo: string, linhas: readonly string[], cor: number = P.labCiano): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'placa-do-lab';
  const largura = 2.3;
  const altura = 1.15;
  const yPlaca = 1.55;

  for (const lado of [-1, 1] as const) {
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.08, yPlaca, 0.08), toon(P.labPedestalClaro));
    pe.position.set(lado * (largura / 2 - 0.25), yPlaca / 2, -0.02);
    g.add(pe);
  }
  const chapa = new THREE.Mesh(new THREE.BoxGeometry(largura, altura, 0.07), toon(P.labChaoBorda));
  chapa.position.y = yPlaca;
  g.add(chapa);

  // o aro de neon: quatro barras finas por FORA da chapa, um pouco à frente
  const aro = neon(cor, 2.2);
  for (const sy of [-1, 1] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(largura + 0.06, 0.035, 0.035), aro);
    barra.position.set(0, yPlaca + sy * (altura / 2 + 0.015), 0.02);
    g.add(semSombra(barra));
  }
  for (const sx of [-1, 1] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(0.035, altura + 0.06, 0.035), aro);
    barra.position.set(sx * (largura / 2 + 0.015), yPlaca, 0.02);
    g.add(semSombra(barra));
  }

  const canvas = pintarTexto(titulo, linhas, 512, 256, css(cor), '#dfe7ff', null);
  const texto = new THREE.Mesh(
    new THREE.PlaneGeometry(largura - 0.12, altura - 0.1),
    new THREE.MeshBasicMaterial({ map: texturaDe(canvas), transparent: true }),
  );
  texto.position.set(0, yPlaca, 0.045);
  g.add(semSombra(texto));
  return g;
}

/**
 * RÓTULO QUE FLUTUA: um `Sprite` (sempre de frente para a câmera, gire ela
 * para onde girar) com o texto num canvas. Serve para o nome dos planetas e
 * para o "Nearest" e "Linear" do quadro de pixels. `largura` em metros.
 */
export function rotulo(texto: string, cor: number = P.labBranco, largura = 1.1): THREE.Sprite {
  const canvas = pintarTexto(texto, [], 256, 72, css(cor), css(cor), null);
  const ctx = canvas.getContext('2d');
  // um contorno escuro por baixo da letra: o rótulo lê em cima de qualquer fundo
  if (ctx) {
    const copia = document.createElement('canvas');
    copia.width = canvas.width;
    copia.height = canvas.height;
    copia.getContext('2d')?.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(8, 12, 32, 0.72)';
    const r = 30;
    ctx.beginPath();
    ctx.roundRect(4, 6, canvas.width - 8, canvas.height - 12, r);
    ctx.fill();
    ctx.drawImage(copia, 0, 0);
  }
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaDe(canvas), depthWrite: false }));
  sprite.scale.set(largura, (largura * 72) / 256, 1);
  return semSombra(sprite);
}

/** Texto chapado num plano (a frente de um pedestal, a legenda de um quadro). */
export function etiqueta(texto: string, largura: number, altura: number, cor: number = P.labBranco): THREE.Mesh {
  const canvas = pintarTexto(texto, [], 256, Math.max(48, Math.round((256 * altura) / largura)), css(cor), css(cor), null);
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(largura, altura),
    new THREE.MeshBasicMaterial({ map: texturaDe(canvas), transparent: true }),
  );
  return semSombra(m);
}

/**
 * PEDESTAL: o bloco onde cada experimento se apoia, com o aro de neon no
 * topo. O topo fica em `altura` — é ali que a peça de cima nasce.
 */
export function pedestal(raio = 0.45, altura = 0.9, cor: number = P.labPedestal, corAro: number = P.labCiano): THREE.Group {
  const g = new THREE.Group();
  g.userData.peca = 'pedestal-do-lab';
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(raio * 0.86, raio, altura, 20), toon(cor));
  corpo.position.y = altura / 2;
  g.add(corpo);
  const tampo = new THREE.Mesh(new THREE.CylinderGeometry(raio * 1.02, raio * 1.02, 0.06, 24), toon(P.labPedestalClaro));
  tampo.position.y = altura + 0.03;
  g.add(tampo);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(raio * 1.04, 0.022, 6, 32), neon(corAro, 2.4));
  aro.rotation.x = Math.PI / 2;
  aro.position.y = altura + 0.035;
  g.add(semSombra(aro));
  return g;
}

/**
 * Um anel de neon deitado no chão (o contorno de uma estação, o pouso da
 * chegada). Fica 2 cm acima do chão: é peça, não decalque — e por isso não
 * divide plano com a grade.
 */
export function aroNoChao(raio: number, cor: number = P.labCiano, espessura = 0.04): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.TorusGeometry(raio, espessura, 6, 64), neon(cor, 2.2));
  m.rotation.x = Math.PI / 2;
  m.position.y = 0.02;
  return semSombra(m);
}

// ----------------------------------------------------- desenho dentro de desenho

/**
 * A TRAVA DOS DESENHOS EXTRAS. A TV ao vivo e a bola espelhada desenham a cena
 * de novo, de outro ponto de vista, dentro do `onBeforeRender` (o mesmo truque
 * do espelho da boutique). Uma vendo a outra viraria desenho dentro de desenho
 * dentro de desenho — a bola refletindo a TV que filma a bola. Quem está
 * desenhando marca aqui, e quem chegar no meio espera o quadro seguinte.
 */
export const desenhoExtra = { ocupado: false };

/**
 * Desenha `cena` com `camera` no `alvo`, com as três travas: a peça que pediu
 * se apaga (não aparece no próprio reflexo), a sombra do quadro é reaproveitada
 * (não é refeita a cada desenho extra) e o alvo anterior volta no fim — que,
 * com efeito de tela ligado, é a textura do pós-processamento, e não o canvas.
 */
export function desenharDeOutroLugar(
  renderer: THREE.WebGLRenderer,
  cena: THREE.Scene,
  camera: THREE.Camera,
  alvo: THREE.WebGLRenderTarget,
  esconder: THREE.Object3D,
): void {
  if (desenhoExtra.ocupado) return;
  desenhoExtra.ocupado = true;
  const visivel = esconder.visible;
  esconder.visible = false;
  const alvoAnterior = renderer.getRenderTarget();
  const sombra = renderer.shadowMap.autoUpdate;
  renderer.shadowMap.autoUpdate = false;
  renderer.setRenderTarget(alvo);
  renderer.clear();
  renderer.render(cena, camera);
  renderer.setRenderTarget(alvoAnterior);
  renderer.shadowMap.autoUpdate = sombra;
  esconder.visible = visivel;
  desenhoExtra.ocupado = false;
}

// ------------------------------------------------------------------ mola

/**
 * A MOLA da skill de animação: um valor que persegue o alvo com rigidez e
 * amortecimento, passando um pouco do ponto e voltando. É o que faz o cristal
 * pular quando é clicado e assentar sozinho, sem keyframe nenhum.
 */
export class Mola {
  valor: number;
  velocidade = 0;
  alvo: number;

  constructor(inicial = 0, private readonly rigidez = 120, private readonly amortecimento = 9) {
    this.valor = inicial;
    this.alvo = inicial;
  }

  /** um peteleco: a mola sai do lugar com essa velocidade e volta sozinha */
  empurrar(v: number): void {
    this.velocidade += v;
  }

  tique(dt: number): number {
    // em passos curtos: mola dura com quadro longo explode
    let resta = Math.min(dt, 0.1);
    while (resta > 0) {
      const h = Math.min(resta, 1 / 120);
      const forca = -this.rigidez * (this.valor - this.alvo) - this.amortecimento * this.velocidade;
      this.velocidade += forca * h;
      this.valor += this.velocidade * h;
      resta -= h;
    }
    return this.valor;
  }
}

/** Suavização de entrada e saída (a curva de quase toda animação daqui). */
export function suave(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}
