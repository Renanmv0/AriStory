import * as THREE from 'three';
import { pinturaAcesa, toon } from '../core/materials';
import { PALETTE as P } from '../palette';
import { fundir } from './fundir';
import { macia } from './moveisDaBoutique';
import { novaTextura } from './texturasDeChao';
import { escudoDoClube } from './carrinhoDeGolfeDaGina';

const ALTURA = .32, LARGURA = .48;
const css = (c: number): string => `#${c.toString(16).padStart(6, '0')}`;

function desenho(): THREE.Texture {
  return novaTextura('agradecimento-da-gina-primeira-semana', 1, (c, s) => {
    const a = s / (LARGURA / ALTURA);
    c.canvas.height = Math.round(a);
    c.fillStyle = css(P.portariaCreme); c.fillRect(0, 0, s, a);
    // O papel tem margem dupla, pontinhos e o mesmo escudo do clube.
    c.strokeStyle = css(P.portariaOuro); c.lineWidth = 5; c.strokeRect(13, 13, s - 26, a - 26);
    c.strokeStyle = css(P.portariaMenta); c.lineWidth = 2; c.setLineDash([3, 7]); c.strokeRect(24, 24, s - 48, a - 48); c.setLineDash([]);
    c.drawImage(escudoDoClube().image as HTMLCanvasElement, s / 2 - 27, 28, 54, 54);
    c.fillStyle = css(P.portariaVerdeEscuro); c.textAlign = 'center';
    c.font = '900 29px sans-serif'; c.fillText('Obrigada, bebitos!', s / 2, 123);
    c.font = '600 17px sans-serif'; c.fillText('Ari + Renan + Gina', s / 2, 156);
    c.font = '16px sans-serif'; c.fillText('nossa primeira semana', s / 2, 184);
    c.fillStyle = css(P.portariaRosa); c.beginPath();
    c.moveTo(s / 2, 238); c.bezierCurveTo(s / 2 - 45, 207, s / 2 - 21, 189, s / 2, 209);
    c.bezierCurveTo(s / 2 + 21, 189, s / 2 + 45, 207, s / 2, 238); c.fill();
    c.fillStyle = css(P.portariaVerde); c.font = 'italic 20px serif'; c.fillText('com carinho, Gina', s / 2, a - 33);
    for (const lado of [-1, 1]) {
      c.fillStyle = css(P.portariaOuro); c.font = '22px serif'; c.fillText('✦', s / 2 + lado * 148, 227);
    }
  }, 512);
}

/** Cartão de papel dobrado: fechado na boca, abre e se sustenta no tampo. */
export class CartaoDeAgradecimentoDaGina {
  readonly group = new THREE.Group();
  readonly dobra = new THREE.Group();
  readonly altura = ALTURA;

  constructor() {
    this.group.userData.peca = 'cartao-de-agradecimento-da-gina';
    const frente = new THREE.Mesh(macia(LARGURA, ALTURA, .005, .002), toon(P.portariaCreme));
    frente.position.y = ALTURA / 2; this.group.add(frente);
    const pintura = new THREE.Mesh(new THREE.PlaneGeometry(LARGURA - .007, ALTURA - .007), pinturaAcesa(desenho()));
    pintura.position.set(0, ALTURA / 2, .0035); this.group.add(pintura);
    this.dobra.name = 'dobra-do-cartao'; this.dobra.position.set(0, ALTURA, -.006);
    const verso = new THREE.Mesh(macia(LARGURA, ALTURA, .004, .0018), toon(P.portariaMenta));
    verso.position.y = -ALTURA / 2; this.dobra.add(verso); this.group.add(this.dobra);
    // Filete da dobra separado das faces, sem superfície coplanar.
    const vinco = new THREE.Mesh(new THREE.CylinderGeometry(.003, .003, LARGURA, 10), toon(P.portariaOuro));
    vinco.rotation.z = Math.PI / 2; vinco.position.set(0, ALTURA, -.002); this.group.add(vinco);
    fundir(this.group);
  }

  abrir(quanto: number): void { this.dobra.rotation.x = quanto * .64; }
  dispose(): void {
    this.group.removeFromParent();
    this.group.traverse(o => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose(); });
  }
}
