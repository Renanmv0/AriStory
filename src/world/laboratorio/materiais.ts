import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { toon } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { etiqueta, pedestal } from './comum';
import { geometriaDeCoracao } from './geometria';

/**
 * ===================================== ESTAÇÃO DE MATERIAIS: a vitrine
 *
 * Dez amostras da MESMA forma, cada uma com um tipo de material do three — e
 * no meio delas, o toon, que é o único que o jogo usa. A vitrine existe para a
 * comparação: ao lado de um metal que reflete a sala e de um vidro que entorta
 * o que está atrás, dá para ver o que o toon escolhe NÃO fazer (nada de brilho
 * que anda com a câmera, só degraus chapados de luz). É ele que faz o jogo
 * parecer desenho.
 *
 * ESTA É A EXCEÇÃO À REGRA "MATERIAL SÓ POR `toon()`": os materiais daqui SÃO
 * o assunto da peça, então eles nascem aqui mesmo, um de cada classe, e não
 * saem desta vitrine. Nenhuma outra peça do jogo deve copiar daqui.
 *
 * O AMBIENTE (o reflexo do metal, do vidro e da bolha) é a `RoomEnvironment`
 * dos exemplos do three: uma sala montada com caixas e luzes, em CÓDIGO —
 * nenhum arquivo HDR. O `PMREMGenerator` fotografa essa sala para todos os
 * lados e prepara os níveis de desfoque que o material PBR consulta conforme
 * a rugosidade. Ele precisa do renderer, que a peça não conhece: por isso a
 * foto é tirada no primeiro `onBeforeRender` (o three entrega o renderer ali),
 * uma vez só.
 */
export interface Vitrine {
  grupo: THREE.Group;
  tique(dt: number): void;
  /** troca a forma de todas as amostras e devolve o nome da nova */
  trocarForma(): string;
  readonly forma: string;
  readonly amostras: ReadonlyArray<{ nome: string; malha: THREE.Mesh }>;
  /** o reflexo de sala já foi fotografado (o primeiro quadro com a vitrine na tela) */
  readonly comAmbiente: boolean;
  /** solta o reflexo e os materiais da vitrine (menos o toon, que é do jogo) */
  descartar(): void;
}

/** a bolinha de matcap: uma esfera iluminada PINTADA, que o material só consulta */
function pinturaDeMatcap(): THREE.CanvasTexture {
  const lado = 256;
  const canvas = document.createElement('canvas');
  canvas.width = lado;
  canvas.height = lado;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0d1530';
    ctx.fillRect(0, 0, lado, lado);
    const g = ctx.createRadialGradient(lado * 0.38, lado * 0.32, lado * 0.02, lado / 2, lado / 2, lado / 2);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.18, '#c9f3ff');
    g.addColorStop(0.55, '#5fb4e8');
    g.addColorStop(0.85, '#2a4a9a');
    g.addColorStop(1, '#141c45');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lado / 2, lado / 2, lado / 2 - 1, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const FORMAS = ['esfera', 'nó', 'coração'] as const;

export function vitrineDeMateriais(): Vitrine {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'vitrine-de-materiais';

  const pbr: Array<THREE.MeshStandardMaterial> = [];
  const metal = new THREE.MeshStandardMaterial({ color: P.labAmarelo, roughness: 0.2, metalness: 1 });
  const fosco = new THREE.MeshStandardMaterial({ color: P.labRosa, roughness: 0.6, metalness: 0 });
  const vidro = new THREE.MeshPhysicalMaterial({
    color: P.labBranco, transmission: 1, thickness: 0.7, roughness: 0.04, ior: 1.45, metalness: 0,
  });
  const bolha = new THREE.MeshPhysicalMaterial({
    color: P.labBranco, iridescence: 1, iridescenceIOR: 1.33, iridescenceThicknessRange: [140, 900],
    roughness: 0.06, metalness: 0, transmission: 0.55, thickness: 0.1,
  });
  pbr.push(metal, fosco, vidro, bolha);

  const lista: Array<{ nome: string; material: THREE.Material }> = [
    { nome: 'Basic', material: new THREE.MeshBasicMaterial({ color: P.labRosa }) },
    { nome: 'Lambert', material: new THREE.MeshLambertMaterial({ color: P.labRosa }) },
    { nome: 'Phong', material: new THREE.MeshPhongMaterial({ color: P.labRosa, specular: P.metalGrey, shininess: 70 }) },
    { nome: 'Toon (o do jogo)', material: toon(P.labRosa) },
    { nome: 'Standard', material: fosco },
    { nome: 'Metal', material: metal },
    { nome: 'Vidro', material: vidro },
    { nome: 'Bolha de sabão', material: bolha },
    { nome: 'Matcap', material: new THREE.MeshMatcapMaterial({ matcap: pinturaDeMatcap() }) },
    { nome: 'Normal', material: new THREE.MeshNormalMaterial() },
  ];

  const geometrias: Record<(typeof FORMAS)[number], THREE.BufferGeometry> = {
    esfera: new THREE.SphereGeometry(0.36, 40, 28),
    'nó': new THREE.TorusKnotGeometry(0.22, 0.085, 140, 18),
    'coração': geometriaDeCoracao(0.62),
  };
  let forma = 0;

  const amostras: Array<{ nome: string; malha: THREE.Mesh }> = [];
  let ambiente: THREE.Texture | null = null;
  lista.forEach(({ nome, material }, i) => {
    const fileira = i < 5 ? 0 : 1;
    const coluna = i % 5;
    // duas fileiras desencontradas: a da frente não tapa a de trás
    const x = (coluna - 2) * 1.55 + fileira * 0.78;
    const z = fileira === 0 ? -0.95 : 0.95;
    const base = pedestal(0.32, 0.9, P.labPedestal, i === 3 ? P.labAmarelo : P.labCiano);
    base.position.set(x, 0, z);
    grupo.add(base);

    const malha = new THREE.Mesh(geometrias.esfera, material);
    malha.position.set(x, 1.36, z);
    grupo.add(malha);
    amostras.push({ nome, malha });

    const placa = etiqueta(nome, 1.1, 0.24, i === 3 ? P.labAmarelo : P.labBranco);
    // de frente para a câmera de sempre, colada na frente do pedestal
    placa.position.set(x + 0.25, 0.52, z + 0.25);
    placa.rotation.y = Math.PI / 4;
    grupo.add(placa);
  });

  // A LUZ DA VITRINE: o laboratório é noite, e Lambert, Phong e toon dependem
  // da luz da cena (o ambiente PBR só vale para os quatro de cima). Uma
  // lâmpada branca em cima dá o brilho do Phong e os degraus do toon.
  const lampada = new THREE.PointLight(P.labBranco, 4.5, 9, 2);
  lampada.position.set(0.4, 3.3, 1.2);
  grupo.add(lampada);

  // o ambiente PBR, fotografado no primeiro quadro em que o vidro é desenhado
  amostras[6].malha.onBeforeRender = (renderer) => {
    if (ambiente) return;
    const pmrem = new THREE.PMREMGenerator(renderer);
    ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    for (const m of pbr) {
      m.envMap = ambiente;
      m.envMapIntensity = 0.9;
      m.needsUpdate = true;
    }
  };

  let tempo = 0;
  return {
    grupo,
    amostras,
    get forma() {
      return FORMAS[forma];
    },
    get comAmbiente() {
      return ambiente !== null;
    },
    descartar() {
      ambiente?.dispose();
      for (const { material } of lista) if (material !== lista[3].material) material.dispose();
      for (const geo of Object.values(geometrias)) geo.dispose();
    },
    trocarForma() {
      forma = (forma + 1) % FORMAS.length;
      const geo = geometrias[FORMAS[forma]];
      for (const a of amostras) a.malha.geometry = geo;
      return FORMAS[forma];
    },
    tique(dt) {
      tempo += dt;
      amostras.forEach((a, i) => {
        // girando devagar: é o reflexo andando na superfície que mostra o material
        a.malha.rotation.y = tempo * 0.6 + i * 0.7;
        a.malha.rotation.x = Math.sin(tempo * 0.5 + i) * 0.2;
      });
    },
  };
}
