import * as THREE from 'three';
import { brilhoDeLuz } from '../../core/materials';
import { PALETTE as P } from '../../palette';
import { css, semSombra } from './comum';

/**
 * ============================== A TELA DO COMPUTADOR DO ARI (a porta do lab)
 *
 * O monitor da escrivaninha do quarto era um plano azul chapado. Esta é a tela
 * de verdade, desenhada em canvas, em três estados:
 *
 *  - a ÁREA DE TRABALHO: papel de parede, as pastas e, no canto, a pasta
 *    nova — `AriStory_teste`;
 *  - ABRINDO: a janela da pasta carregando, com a barra de progresso;
 *  - o REDEMOINHO: a tela vira espiral, acende e puxa quem está na frente.
 *
 * O brilho em volta (o halo) é a luz falsa de sempre (`brilhoDeLuz`): o quarto
 * não tem efeito de tela, e um halo em sprite faz o papel do brilho.
 */
export type EstadoDaTela = 'area-de-trabalho' | 'abrindo' | 'redemoinho';

export interface TelaDoComputador {
  grupo: THREE.Group;
  readonly estado: EstadoDaTela;
  mudar(estado: EstadoDaTela): void;
  tique(dt: number): void;
  descartar(): void;
}

const LARG = 320;
const ALT = 186;
const FONTE = '"Nunito", ui-rounded, system-ui, sans-serif';

function pasta(ctx: CanvasRenderingContext2D, x: number, y: number, nome: string, destaque: boolean): void {
  ctx.fillStyle = destaque ? css(P.labCiano) : '#f2c14a';
  ctx.beginPath();
  ctx.roundRect(x, y + 4, 34, 24, 4);
  ctx.fill();
  ctx.fillRect(x, y, 14, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 3, y + 8, 28, 3);
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 9px ${FONTE}`;
  ctx.textAlign = 'center';
  ctx.fillText(nome, x + 17, y + 40);
  ctx.textAlign = 'start';
}

export function telaDoComputador(largura = 0.72, altura = 0.42): TelaDoComputador {
  const grupo = new THREE.Group();
  grupo.userData.peca = 'tela-do-computador';
  const canvas = document.createElement('canvas');
  canvas.width = LARG;
  canvas.height = ALT;
  const ctx = canvas.getContext('2d');
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: textura });
  const tela = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), material);
  grupo.add(semSombra(tela));
  const halo = new THREE.Sprite(brilhoDeLuz(P.labCiano, 0.7));
  halo.position.z = 0.05;
  halo.scale.setScalar(0.01);
  grupo.add(semSombra(halo));

  let estado: EstadoDaTela = 'area-de-trabalho';
  let tempo = 0;
  let noEstado = 0;
  let acumulado = 1;

  const desenhar = (): void => {
    if (!ctx) return;
    if (estado !== 'redemoinho') {
      // o papel de parede: o céu de fim de tarde, com duas nuvens
      const g = ctx.createLinearGradient(0, 0, 0, ALT);
      g.addColorStop(0, css(P.skyNight));
      g.addColorStop(0.6, '#8a6fd1');
      g.addColorStop(1, css(P.skyDusk));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, LARG, ALT);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.ellipse(230, 50, 46, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(80, 90, 36, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      pasta(ctx, 14, 12, 'fotos', false);
      pasta(ctx, 14, 62, 'músicas', false);
      pasta(ctx, 14, 112, 'AriStory_teste', true);
      // a pasta nova pisca uma estrelinha
      if (Math.floor(tempo * 2) % 2 === 0) {
        ctx.fillStyle = css(P.labAmarelo);
        ctx.font = `800 14px ${FONTE}`;
        ctx.fillText('✦', 50, 118);
      }
      // a barra de tarefas, com o relógio
      ctx.fillStyle = 'rgba(16, 22, 50, 0.85)';
      ctx.fillRect(0, ALT - 18, LARG, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 10px ${FONTE}`;
      ctx.textAlign = 'right';
      ctx.fillText(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), LARG - 8, ALT - 5);
      ctx.textAlign = 'start';
    }
    if (estado === 'abrindo') {
      const x = 70;
      const y = 40;
      ctx.fillStyle = '#f6f7fb';
      ctx.beginPath();
      ctx.roundRect(x, y, 200, 104, 8);
      ctx.fill();
      ctx.fillStyle = css(P.labCiano);
      ctx.beginPath();
      ctx.roundRect(x, y, 200, 20, [8, 8, 0, 0]);
      ctx.fill();
      ctx.fillStyle = css(P.labCeu);
      ctx.font = `800 11px ${FONTE}`;
      ctx.fillText('AriStory_teste', x + 10, y + 14);
      ctx.font = `700 11px ${FONTE}`;
      ctx.fillText('carregando a versão de teste…', x + 14, y + 50);
      const progresso = Math.min(1, noEstado / 1.4);
      ctx.fillStyle = '#dfe3ee';
      ctx.fillRect(x + 14, y + 66, 172, 14);
      ctx.fillStyle = css(P.labRosa);
      ctx.fillRect(x + 14, y + 66, 172 * progresso, 14);
      ctx.fillStyle = css(P.labCeu);
      ctx.fillText(`${Math.round(progresso * 100)}%`, x + 14, y + 96);
    }
    if (estado === 'redemoinho') {
      ctx.fillStyle = css(P.labCeu);
      ctx.fillRect(0, 0, LARG, ALT);
      // a espiral: arcos concêntricos girando, cada anel mais atrasado
      ctx.lineWidth = 7;
      for (let i = 0; i < 9; i++) {
        const r = 10 + i * 12;
        const a = tempo * (4 - i * 0.25) + i * 0.7;
        ctx.strokeStyle = i % 2 ? css(P.labRosa) : css(P.labCiano);
        ctx.beginPath();
        ctx.arc(LARG / 2, ALT / 2, r, a, a + Math.PI * 1.25);
        ctx.stroke();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(LARG / 2, ALT / 2, 9 + Math.sin(tempo * 12) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    textura.needsUpdate = true;
  };
  desenhar();

  return {
    grupo,
    get estado() {
      return estado;
    },
    descartar() {
      textura.dispose();
      material.dispose();
    },
    mudar(novo) {
      estado = novo;
      noEstado = 0;
      acumulado = 1;
    },
    tique(dt) {
      tempo += dt;
      noEstado += dt;
      // o halo cresce no redemoinho e some fora dele
      const alvo = estado === 'redemoinho' ? 1.6 + Math.sin(tempo * 9) * 0.15 : 0.01;
      halo.scale.setScalar(halo.scale.x + (alvo - halo.scale.x) * Math.min(1, dt * 4));
      material.color.setScalar(estado === 'redemoinho' ? 1.35 : 1);
      acumulado += dt;
      if (acumulado < 1 / 15) return;
      acumulado = 0;
      desenhar();
    },
  };
}
