import * as THREE from 'three';
import { toon } from '../../core/materials';
import { gradeDigital, neon, portal } from '../../core/shaders';
import { PALETTE as P } from '../../palette';
import { aroNoChao, css, semSombra } from './comum';

/**
 * ============================================ A PLATAFORMA DO LABORATÓRIO
 *
 * O chão do mundo dentro do computador: uma ilha quadrada flutuando no
 * escuro, com a grade de neon desenhada pelo shader (`gradeDigital`) e a
 * borda acesa. Aqui também moram as peças da praça do meio — o pouso onde a
 * dupla chega, o portal por onde ela sai e a mesa de controle dos efeitos de
 * tela.
 *
 * O chão NÃO é o `w.ground()`: aquele é o piso toon liso das outras cenas.
 * Este tem material próprio (o toon com a grade costurada) e por isso é peça
 * do kit, posta com `w.add()`. Ele respeita a regra da pilha do chão: a face
 * de cima fica em `y = -0,006`, abaixo da base de toda peça.
 */
export interface Chao {
  grupo: THREE.Group;
  tique(dt: number): void;
}

export function chaoDoLaboratorio(lado: number): Chao {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'chao-do-laboratorio';
  const grade = gradeDigital({ cor: P.labChao, linha: P.labCiano, onda: P.labRosa, celula: 11, centro: [0, 0] });
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(lado, lado), grade.material);
  piso.rotation.x = -Math.PI / 2;
  piso.position.y = -0.006;
  piso.receiveShadow = true;
  grupo.add(piso);

  // a laje por baixo: é ela que dá espessura à ilha quando a câmera mostra a
  // borda. O topo fica 2,4 cm abaixo do piso — nada de plano dividido
  const laje = new THREE.Mesh(new THREE.BoxGeometry(lado + 0.5, 1.6, lado + 0.5), toon(P.labChaoBorda));
  laje.position.y = -0.03 - 0.8;
  grupo.add(laje);
  // e a borda acesa, nas quatro beiradas, por cima da laje
  const fio = neon(P.labCiano, 2.4);
  for (const [x, z, largura, rot] of [
    [0, -(lado / 2 + 0.25), lado + 0.55, 0],
    [0, lado / 2 + 0.25, lado + 0.55, 0],
    [-(lado / 2 + 0.25), 0, lado + 0.55, Math.PI / 2],
    [lado / 2 + 0.25, 0, lado + 0.55, Math.PI / 2],
  ] as const) {
    const barra = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.06, 0.06), fio);
    barra.position.set(x, -0.03, z);
    barra.rotation.y = rot;
    grupo.add(semSombra(barra));
    // um segundo fio, lá embaixo, para a laje ler como bloco e não como chão
    const baixo = new THREE.Mesh(new THREE.BoxGeometry(largura, 0.04, 0.04), neon(P.labRoxo, 1.8));
    baixo.position.set(x, -1.6, z);
    baixo.rotation.y = rot;
    grupo.add(semSombra(baixo));
  }

  return {
    grupo,
    tique(dt) {
      grade.uniforms.uTempo.value += dt;
    },
  };
}

// -------------------------------------------------------- o pouso e o portal

export interface Pouso {
  grupo: THREE.Group;
  /** o feixe de chegada: acende e vai apagando */
  acender(): void;
  tique(dt: number): void;
}

export function pousoDeChegada(): Pouso {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'pouso-de-chegada';
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.3, 0.025, 48), toon(P.labPedestalClaro));
  disco.position.y = 0.0125;
  grupo.add(disco);
  grupo.add(aroNoChao(1.32, P.labCiano, 0.045));
  const dentro = aroNoChao(0.85, P.labRosa, 0.03);
  dentro.position.y = 0.035;
  grupo.add(dentro);
  // o feixe: um cilindro aberto, translúcido, somado por cima. Material
  // próprio porque a OPACIDADE dele anima (o `neon()` é compartilhado)
  const feixeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(P.labCiano).multiplyScalar(1.6),
    transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const feixe = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 6, 32, 1, true), feixeMat);
  feixe.position.y = 3;
  grupo.add(semSombra(feixe));

  let brilho = 0;
  let tempo = 0;
  return {
    grupo,
    acender() {
      brilho = 1;
    },
    tique(dt) {
      tempo += dt;
      brilho = Math.max(0, brilho - dt * 0.45);
      feixeMat.opacity = brilho * 0.35 * (0.85 + 0.15 * Math.sin(tempo * 18));
      feixe.visible = brilho > 0.01;
      dentro.rotation.z = tempo * 0.6;
    },
  };
}

export interface PortalDeSaida {
  grupo: THREE.Group;
  /** onde fica o meio do redemoinho, em coordenada do grupo */
  readonly centro: THREE.Vector3;
  /** puxa mais forte (a dupla entrando) */
  puxar(forca: number): void;
  tique(dt: number): void;
}

export function portalDeSaida(): PortalDeSaida {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'portal-de-saida';
  const centro = new THREE.Vector3(0, 1.45, 0);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.14, 40), toon(P.labPedestal));
  base.position.y = 0.07;
  grupo.add(base);
  grupo.add(aroNoChao(1.48, P.labRoxo, 0.035));
  // o aro em pé e as duas colunas que o seguram
  const aro = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.09, 12, 72), neon(P.labCiano, 2.2));
  aro.position.copy(centro);
  grupo.add(semSombra(aro));
  for (const lado of [-1, 1] as const) {
    const coluna = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 0.3), toon(P.labPedestalClaro));
    coluna.position.set(lado * 1.3, 0.75, 0);
    grupo.add(coluna);
  }
  const redemoinho = portal(P.labCiano, P.labRosa);
  const disco = new THREE.Mesh(new THREE.CircleGeometry(1.12, 64), redemoinho.material);
  disco.position.copy(centro);
  grupo.add(semSombra(disco));

  let alvo = 1;
  return {
    grupo,
    centro,
    puxar(forca) {
      alvo = forca;
    },
    tique(dt) {
      redemoinho.uniforms.uTempo.value += dt * (0.6 + redemoinho.uniforms.uForca.value * 0.6);
      redemoinho.uniforms.uForca.value += (alvo - redemoinho.uniforms.uForca.value) * Math.min(1, dt * 3);
      aro.rotation.z += dt * 0.3;
    },
  };
}

// ------------------------------------------------------- a mesa de controle

export interface MesaDeControle {
  grupo: THREE.Group;
  /** o que a telinha da mesa escreve: o nome do filtro e a peça do three por trás */
  mostrar(titulo: string, detalhe: string): void;
  tique(dt: number): void;
  descartar(): void;
}

/**
 * A MESA DE CONTROLE da tela: é aqui que a dupla troca o efeito de tela
 * (pós-processamento). Botões e faders de enfeite, e uma telinha em canvas
 * que diz o filtro de agora.
 */
export function mesaDeControle(): MesaDeControle {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'mesa-de-controle';
  const corpo = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.82, 0.72), toon(P.labPedestal));
  corpo.position.y = 0.41;
  grupo.add(corpo);
  const painel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.82), toon(P.labPedestalClaro));
  painel.position.set(0, 0.87, 0);
  painel.rotation.x = 0.28;
  grupo.add(painel);
  // os botões: uma fileira de luzinhas, cada uma de uma cor
  const cores = [P.labVermelho, P.labLaranja, P.labAmarelo, P.labVerde, P.labCiano, P.labAzul, P.labRoxo, P.labRosa];
  const botoes: THREE.Mesh[] = [];
  cores.forEach((cor, i) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 12), neon(cor, 1.8));
    b.position.set(-0.8 + i * 0.23, 0.95, 0.12);
    b.rotation.x = 0.28;
    grupo.add(semSombra(b));
    botoes.push(b);
  });
  // os faders
  for (let i = 0; i < 5; i++) {
    const trilho = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.3), toon(P.labChaoBorda));
    trilho.position.set(-0.55 + i * 0.27, 0.93, -0.16);
    trilho.rotation.x = 0.28;
    grupo.add(trilho);
    const pino = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.05), toon(P.labBranco));
    pino.position.set(-0.55 + i * 0.27, 0.96, -0.16 + ((i * 0.37) % 0.2) - 0.1);
    pino.rotation.x = 0.28;
    grupo.add(pino);
  }

  // a telinha, num braço atrás da mesa
  const haste = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), toon(P.labMetal));
  haste.position.set(0, 1.2, -0.3);
  grupo.add(haste);
  const caixa = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.66, 0.08), toon(P.labChaoBorda));
  caixa.position.set(0, 1.78, -0.32);
  grupo.add(caixa);
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: textura });
  material.color.setScalar(1.2);
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.56), material);
  tela.position.set(0, 1.78, -0.275);
  grupo.add(semSombra(tela));

  const mostrar = (titulo: string, detalhe: string): void => {
    if (!ctx) return;
    ctx.fillStyle = css(P.labCeu);
    ctx.fillRect(0, 0, 384, 160);
    ctx.strokeStyle = css(P.labCiano);
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, 372, 148);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = css(P.labAmarelo);
    ctx.font = `800 20px "Nunito", ui-rounded, system-ui, sans-serif`;
    ctx.fillText('FILTRO DA TELA', 192, 34);
    ctx.fillStyle = '#ffffff';
    let tamanho = 44;
    ctx.font = `800 ${tamanho}px "Nunito", ui-rounded, system-ui, sans-serif`;
    while (tamanho > 18 && ctx.measureText(titulo).width > 350) {
      tamanho -= 2;
      ctx.font = `800 ${tamanho}px "Nunito", ui-rounded, system-ui, sans-serif`;
    }
    ctx.fillText(titulo, 192, 82);
    ctx.fillStyle = css(P.labCiano);
    ctx.font = `700 18px ui-monospace, "Menlo", monospace`;
    ctx.fillText(detalhe, 192, 128);
    textura.needsUpdate = true;
  };
  mostrar('Neon', 'UnrealBloomPass');

  let tempo = 0;
  return {
    grupo,
    mostrar,
    descartar() {
      textura.dispose();
      material.dispose();
    },
    tique(dt) {
      tempo += dt;
      // as luzinhas piscam em onda, como painel de filme
      botoes.forEach((b, i) => (b.visible = Math.sin(tempo * 3 - i * 0.8) > -0.6));
    },
  };
}

// ------------------------------------------------------- o vazio em volta

/**
 * Blocos flutuando no escuro em volta da ilha — pedaços de tela soltos. Uma
 * malha instanciada só, cada bloco subindo e descendo no seu tempo.
 */
export function blocosNoVazio(rng: () => number, lado: number): { grupo: THREE.InstancedMesh; tique(dt: number): void } {
  const TOTAL = 46;
  const blocos = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), toon(P.labPedestalClaro), TOTAL);
  const dados: Array<{ x: number; y: number; z: number; s: number; fase: number; giro: number }> = [];
  const cores = [P.labPedestal, P.labPedestalClaro, P.labRoxo, P.labAzul].map((c) => new THREE.Color(c));
  for (let i = 0; i < TOTAL; i++) {
    const a = rng() * Math.PI * 2;
    const r = lado * 0.62 + rng() * 14;
    dados.push({
      x: Math.cos(a) * r, y: -6 + rng() * 6, z: Math.sin(a) * r,
      s: 0.5 + rng() * 1.8, fase: rng() * Math.PI * 2, giro: (rng() - 0.5) * 0.4,
    });
    blocos.setColorAt(i, cores[i % cores.length]);
  }
  if (blocos.instanceColor) blocos.instanceColor.needsUpdate = true;
  blocos.frustumCulled = false;
  const peca = new THREE.Object3D();
  let tempo = 0;
  const atualizar = (): void => {
    dados.forEach((d, i) => {
      peca.position.set(d.x, d.y + Math.sin(tempo * 0.5 + d.fase) * 0.6, d.z);
      peca.rotation.set(tempo * d.giro, tempo * d.giro * 0.7 + d.fase, 0);
      peca.scale.setScalar(d.s);
      peca.updateMatrix();
      blocos.setMatrixAt(i, peca.matrix);
    });
    blocos.instanceMatrix.needsUpdate = true;
  };
  atualizar();
  return {
    grupo: semSombra(blocos),
    tique(dt) {
      tempo += dt;
      atualizar();
    },
  };
}
