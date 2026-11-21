import * as THREE from 'three';
import { ARI, RENAN } from '../characters/cast';
import { CharacterRig } from '../characters/CharacterRig';
import type { Loadout } from '../core/types';
import { PALETTE as P } from '../palette';
import { PREMIOS_DA_PORTARIA } from '../world/itens';
import { PREMIOS } from '../minigames/portaria/consequencias';
import { RECADOS_DO_PREMIO } from '../minigames/portaria/premios';
import './presenteDaGina.css';

/** Uma prova do presente nos dois, com detalhe, giro e um único canvas de tamanho fixo. */
export class PresenteDaGina {
  readonly pronta: Promise<void>;
  private concluir!: () => void;
  private readonly raiz = document.createElement('section');
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cena = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(32, 1, .02, 30);
  private readonly palco = new THREE.Group();
  private readonly canvas: HTMLCanvasElement;
  private readonly focoAnterior = document.activeElement;
  private rig: CharacterRig | null = null;
  private indice = 0;
  private quem = 'ari';
  private detalhe = false;
  private fechada = false;
  private giro = -.15;
  private alvo = -.15;
  private dedo: { id: number; x: number } | null = null;
  private readonly menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private readonly dias: readonly number[], preferir: number) {
    this.pronta = new Promise(pronto => { this.concluir = pronto; });
    this.indice = Math.max(0, dias.indexOf(preferir));
    this.raiz.className = 'presente-gina';
    this.raiz.setAttribute('role', 'dialog'); this.raiz.setAttribute('aria-modal', 'true');
    this.raiz.setAttribute('aria-label', 'Um presente da Gina');
    this.raiz.innerHTML = `<div class="pg-caixa">
      <div class="pg-estrelas" aria-label="Três estrelas">★ ★ ★</div>
      <p class="pg-de">Um carinho da Gina</p><h2></h2><p class="pg-dia"></p>
      <div class="pg-prova"><canvas aria-label="Modelo 3D do prêmio"></canvas><span class="pg-legenda">arraste para girar</span></div>
      <div class="pg-controles"><button data-pg="ari">No Ari</button><button data-pg="renan">No Renan</button><button data-pg="detalhe">Ver detalhe 🔎</button></div>
      <div class="pg-giro"><button data-pg="esquerda" aria-label="Girar para a esquerda">↶</button><span>feito para os dois ♡</span><button data-pg="direita" aria-label="Girar para a direita">↷</button></div>
      <blockquote></blockquote><p class="pg-guardado">Já está no guarda-roupa dos dois.</p>
      <nav class="pg-outros" aria-label="Outros presentes conquistados"><button data-pg="anterior">←</button><span></span><button data-pg="seguinte">→</button></nav>
      <button class="pg-continuar" data-pg="continuar">Obrigado, Gina! 💚</button>
    </div>`;
    this.canvas = this.raiz.querySelector('canvas')!;
    document.body.append(this.raiz); document.body.classList.add('presente-da-gina');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.cena.add(this.palco);
    this.cena.add(new THREE.HemisphereLight(P.metalWhite, P.portariaVerde, 1.6));
    const luz = new THREE.DirectionalLight(P.sunWarm, 1.8); luz.position.set(3, 5, 5); this.cena.add(luz);
    const recorte = new THREE.DirectionalLight(P.wallMint, .65); recorte.position.set(-3, 2, -3); this.cena.add(recorte);
    this.raiz.addEventListener('click', this.clique);
    this.canvas.addEventListener('pointerdown', this.iniciarGiro);
    this.canvas.addEventListener('pointermove', this.arrastar);
    this.canvas.addEventListener('pointerup', this.soltar);
    this.canvas.addEventListener('pointercancel', this.soltar);
    document.addEventListener('keydown', this.tecla, true);
    this.montar();
    this.raiz.querySelector<HTMLButtonElement>('[data-pg="continuar"]')!.focus({ preventScroll: true });
  }

  private montar(): void {
    const n = this.dias[this.indice], pecas = PREMIOS_DA_PORTARIA[n];
    this.rig?.group.removeFromParent(); this.rig?.dispose();
    this.rig = new CharacterRig(this.quem === 'ari' ? ARI : RENAN);
    const roupa: Loadout = {};
    for (const peca of pecas) if (peca.slot) roupa[peca.slot] = peca.id;
    this.rig.vestirRoupa(roupa); this.palco.add(this.rig.group);
    this.raiz.querySelector('h2')!.textContent = PREMIOS[n].nome;
    this.raiz.querySelector('.pg-dia')!.textContent = `Dia ${n} · três estrelas${pecas.length > 1 ? ' · três peças' : ''}`;
    this.raiz.querySelector('blockquote')!.textContent = `“${RECADOS_DO_PREMIO[n]}”`;
    this.raiz.querySelector('.pg-outros')!.toggleAttribute('hidden', this.dias.length < 2);
    this.raiz.querySelector('.pg-outros span')!.textContent = `${this.indice + 1} / ${this.dias.length}`;
    this.raiz.querySelectorAll<HTMLButtonElement>('[data-pg="ari"], [data-pg="renan"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pg === this.quem)));
    this.giro = this.alvo = -.15; this.detalhe = false; this.atualizarDetalhe();
  }

  private readonly clique = (e: MouseEvent): void => {
    const a = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-pg]')?.dataset.pg;
    if (!a) return;
    if (a === 'continuar') { this.fechar(); return; }
    if (a === 'ari' || a === 'renan') { this.quem = a; this.montar(); }
    if (a === 'detalhe') { this.detalhe = !this.detalhe; this.atualizarDetalhe(); }
    if (a === 'esquerda' || a === 'direita') this.alvo += (a === 'esquerda' ? -1 : 1) * Math.PI / 4;
    if (a === 'anterior' || a === 'seguinte') { this.indice = (this.indice + (a === 'seguinte' ? 1 : -1) + this.dias.length) % this.dias.length; this.montar(); }
  };
  private atualizarDetalhe(): void {
    this.raiz.querySelector('[data-pg="detalhe"]')!.textContent = this.detalhe ? 'Ver inteiro' : 'Ver detalhe 🔎';
  }
  private readonly iniciarGiro = (e: PointerEvent): void => { this.dedo = { id: e.pointerId, x: e.clientX }; this.canvas.setPointerCapture(e.pointerId); };
  private readonly arrastar = (e: PointerEvent): void => { if (this.dedo?.id !== e.pointerId) return; this.alvo += (e.clientX - this.dedo.x) * .014; this.dedo.x = e.clientX; };
  private readonly soltar = (): void => { this.dedo = null; };
  private readonly tecla = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); this.fechar(); }
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { e.preventDefault(); e.stopImmediatePropagation(); this.alvo += (e.code === 'ArrowLeft' ? -1 : 1) * Math.PI / 4; }
    if (e.code === 'Tab') {
      const botoes = [...this.raiz.querySelectorAll<HTMLButtonElement>('button')].filter(b => b.getClientRects().length);
      const primeiro = botoes[0], ultimo = botoes[botoes.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  };

  update(dt: number): void {
    if (this.fechada || !this.rig) return;
    this.giro += (this.alvo - this.giro) * (this.menosMovimento ? 1 : 1 - Math.exp(-9 * dt));
    this.palco.rotation.y = this.giro;
    this.rig.update(dt, 0); this.rig.abrirBracos(.28);
    this.palco.updateMatrixWorld(true);
    const caixa = new THREE.Box3(); const ids = new Set(PREMIOS_DA_PORTARIA[this.dias[this.indice]].map(p => p.id));
    this.rig.group.traverse(o => {
      const malha = o as THREE.Mesh; if (!malha.isMesh) return;
      let pai: THREE.Object3D | null = o, visivel = true, premio = false;
      while (pai) { if (!pai.visible) visivel = false; if (ids.has(pai.userData.roupa)) premio = true; pai = pai.parent; }
      if (!visivel || this.detalhe && !premio) return;
      if (!malha.geometry.boundingBox) malha.geometry.computeBoundingBox();
      if (malha.geometry.boundingBox) caixa.union(malha.geometry.boundingBox.clone().applyMatrix4(malha.matrixWorld));
    });
    if (caixa.isEmpty()) return;
    const centro = caixa.getCenter(new THREE.Vector3()), tamanho = caixa.getSize(new THREE.Vector3());
    const moldura = this.canvas.parentElement!; const w = Math.min(1200, moldura.clientWidth), h = Math.min(1200, moldura.clientHeight);
    if (w < 2 || h < 2) return;
    const pr = this.renderer.getPixelRatio();
    if (this.canvas.width !== Math.floor(w * pr) || this.canvas.height !== Math.floor(h * pr)) this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const d = Math.max(tamanho.y, tamanho.x / this.camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(16))) * 1.17 + tamanho.z * .55;
    this.camera.position.copy(centro).add(new THREE.Vector3(0, tamanho.y * .025, d));
    this.camera.lookAt(centro); this.camera.updateProjectionMatrix();
    this.renderer.render(this.cena, this.camera);
  }

  fechar(): void {
    if (this.fechada) return; this.fechada = true;
    document.removeEventListener('keydown', this.tecla, true);
    this.rig?.dispose(); this.rig = null; this.renderer.dispose();
    this.raiz.remove(); document.body.classList.remove('presente-da-gina');
    if (this.focoAnterior instanceof HTMLElement && this.focoAnterior.isConnected) this.focoAnterior.focus({ preventScroll: true });
    this.concluir();
  }
}
