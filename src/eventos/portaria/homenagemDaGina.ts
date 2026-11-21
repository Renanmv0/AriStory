import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { Gina } from '../../entities/bichos/Gina';
import { FALAS_DA_HOMENAGEM } from '../../minigames/portaria/homenagem';
import { CartaoDeAgradecimentoDaGina } from '../../world/cartaoDeAgradecimentoDaGina';
import { MESA_DA_PORTARIA } from '../../world/mesaDaPortaria';
import { PALETTE as P } from '../../palette';
import '../../ui/homenagemDaGina.css';

const suave = (t: number): number => { const k = THREE.MathUtils.clamp(t, 0, 1); return k * k * (3 - 2 * k); };

/** A primeira semana, vista do banco da dupla. O expediente já está encerrado. */
export class HomenagemDaGina {
  readonly pronta: Promise<boolean>;
  readonly cartao = new CartaoDeAgradecimentoDaGina();
  private concluir!: (vista: boolean) => void;
  private readonly raiz = document.createElement('section');
  private readonly focoAnterior = document.activeElement;
  private readonly posto: THREE.Vector3;
  private readonly giroInicial: number;
  private readonly abaixarInicial: number;
  private readonly menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly chegada = new THREE.Vector3(1.92, 0, 1.25);
  private readonly luzDaConversa = new THREE.PointLight(P.portariaCreme, 1.15, 4, 1);
  private readonly lugarDoCartao = new THREE.Vector3(.02, MESA_DA_PORTARIA.topo + .007, 1.08);
  private readonly giroDoCartao = new THREE.Quaternion().setFromEuler(new THREE.Euler(-.32, Math.PI, 0, 'YXZ'));
  private origemDoCartao: { pos: THREE.Vector3; giro: THREE.Quaternion } | null = null;
  private fase = 0;
  private tempo = 0;
  private fechada = false;
  private travada = true;
  private parceiroVirado = 0;
  private somDoCartao = false;
  private voltandoAoPosto = false;

  constructor(
    private readonly g: Pick<GameAPI, 'companionName' | 'cabecaDe' | 'som'>,
    private readonly mundo: THREE.Object3D,
    private readonly gina: Gina,
    private readonly foco: (para: THREE.Vector3 | null, lente?: number) => void,
    private readonly virarParceiro: (quanto: number) => void,
  ) {
    this.pronta = new Promise(pronto => { this.concluir = pronto; });
    this.posto = gina.group.position.clone(); this.giroInicial = gina.group.rotation.y; this.abaixarInicial = gina.abaixar;
    this.chegada.y = this.posto.y;
    // A mesma luz de apoio da abertura, sem sombras extras, só nesta conversa.
    this.luzDaConversa.position.set(.25, 2.25, .65); mundo.add(this.luzDaConversa);
    gina.entrarEmServico(); gina.abaixar = .82;
    gina.naHomenagem = { olhar: 0, aceno: 0, contente: .65, falando: false, menosMovimento: this.menosMovimento };
    if (this.menosMovimento) gina.group.position.copy(this.chegada);
    else gina.seguir(this.chegada.x, this.chegada.z, .5);
    // A borda superior fica entre os lábios; o papel acompanha a cabeça.
    gina.cabecaDaGina.add(this.cartao.group);
    this.cartao.group.position.set(0, -.105 - this.cartao.altura, .245);
    this.raiz.className = 'homenagem-gina'; this.raiz.setAttribute('role', 'dialog');
    this.raiz.setAttribute('aria-modal', 'true'); this.raiz.setAttribute('aria-label', 'Agradecimento da Gina pela primeira semana');
    this.raiz.innerHTML = `<header><span class="hg-marco">🦒 Nossa primeira semana</span><button type="button" class="hg-pular">Pular cena ↪</button></header>
      <div class="hg-fala"><div class="hg-etiqueta"><b></b><span></span></div><h2></h2><p aria-live="polite"></p><footer><button type="button" class="hg-proximo"></button></footer></div>`;
    document.body.append(this.raiz); document.body.classList.add('portaria-em-homenagem');
    this.raiz.querySelector('.hg-pular')!.addEventListener('click', () => this.fechar(true));
    this.raiz.querySelector('.hg-proximo')!.addEventListener('click', this.avancar);
    document.addEventListener('keydown', this.tecla, true);
    this.mostrar(); this.proximo.focus({ preventScroll: true });
  }

  private get proximo(): HTMLButtonElement { return this.raiz.querySelector('.hg-proximo')!; }

  private mostrar(): void {
    const fala = FALAS_DA_HOMENAGEM[this.fase];
    this.raiz.dataset.etapa = String(this.fase);
    this.raiz.querySelector('.hg-etiqueta b')!.textContent = this.fase === 3 ? this.g.companionName() : '🦒 Gina';
    this.raiz.querySelector('.hg-etiqueta span')!.textContent = `${this.fase + 1} / ${FALAS_DA_HOMENAGEM.length}`;
    this.raiz.querySelector('h2')!.textContent = fala.titulo;
    this.raiz.querySelector('p')!.textContent = fala.texto;
    this.proximo.textContent = fala.botao; this.proximo.disabled = this.travada;
  }

  private readonly avancar = (): void => {
    if (this.fechada || this.travada) return;
    if (this.fase === FALAS_DA_HOMENAGEM.length - 1) {
      this.voltandoAoPosto = true; this.travada = true; this.tempo = 0;
      this.proximo.disabled = true; this.proximo.textContent = 'Até já, Gina! 💚';
      this.gina.seguir(this.posto.x, this.posto.z, .55);
      return;
    }
    this.fase++; this.tempo = 0; this.travada = true; this.mostrar();
    if (this.fase === 1) this.g.som('memoria');
    else this.g.som('fala');
  };

  private readonly tecla = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); this.fechar(true); }
    else if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat && !(e.target instanceof HTMLButtonElement && e.target !== this.proximo)) {
      e.preventDefault(); e.stopImmediatePropagation(); this.avancar();
    } else if (e.code === 'Tab') {
      const pular = this.raiz.querySelector<HTMLButtonElement>('.hg-pular')!;
      const destino = this.proximo.disabled ? pular : document.activeElement === pular ? this.proximo : pular;
      e.preventDefault(); e.stopImmediatePropagation(); destino.focus();
    }
  };

  update(dt: number): void {
    if (this.fechada) return;
    this.tempo += dt;
    const k = this.menosMovimento ? 1 : 1 - Math.exp(-5 * dt);
    if (this.voltandoAoPosto) {
      const pose = this.gina.naHomenagem!;
      pose.falando = false; pose.aceno = 0; this.gina.abaixar = this.abaixarInicial;
      if (this.menosMovimento) this.gina.group.position.copy(this.posto);
      if (this.gina.group.position.distanceTo(this.posto) < .08) {
        this.gina.entrarEmServico();
        this.gina.group.rotation.y += (this.giroInicial - this.gina.group.rotation.y) * k;
        if (Math.abs(this.gina.group.rotation.y - this.giroInicial) < .025) { this.fechar(true); return; }
      }
      this.gina.group.updateMatrixWorld(true);
      this.foco(this.gina.cabecaDaGina.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -.1, 0)), innerHeight > innerWidth ? 84 : 70);
      return;
    }
    const chegou = this.gina.group.position.distanceTo(this.chegada) < .08;
    if (chegou) {
      this.gina.entrarEmServico();
      this.gina.group.rotation.y += (-1.8 - this.gina.group.rotation.y) * k;
    }
    const pose = this.gina.naHomenagem!;
    pose.contente += ((this.fase >= 2 ? 1 : .65) - pose.contente) * k;
    pose.olhar += ((this.fase === 3 ? -.28 : -.05) - pose.olhar) * k;
    pose.falando = this.fase === 2 || this.fase === 4;
    pose.aceno = this.menosMovimento ? 0 : Math.sin(Math.min(1, this.tempo / 1.5) * Math.PI * 2) * Math.sin(Math.min(1, this.tempo / 1.5) * Math.PI);
    this.gina.abaixar = this.fase === 1 && this.tempo < 1.65 ? 1.28 : .82;

    if (this.fase === 1) {
      if (this.tempo >= (this.menosMovimento ? 0 : 1) && !this.origemDoCartao) {
        this.mundo.updateMatrixWorld(true); this.mundo.attach(this.cartao.group);
        this.origemDoCartao = { pos: this.cartao.group.position.clone(), giro: this.cartao.group.quaternion.clone() };
      }
      if (this.origemDoCartao) {
        const t = this.menosMovimento ? 1 : suave((this.tempo - 1) / .85);
        this.cartao.group.position.lerpVectors(this.origemDoCartao.pos, this.lugarDoCartao, t);
        this.cartao.group.position.y += this.menosMovimento ? 0 : Math.sin(t * Math.PI) * .075;
        this.cartao.group.quaternion.slerpQuaternions(this.origemDoCartao.giro, this.giroDoCartao, t);
        this.cartao.abrir(t);
        if (t === 1 && !this.somDoCartao) { this.somDoCartao = true; this.g.som('folhear'); }
      }
    }

    this.parceiroVirado += ((this.fase === 3 ? 1 : 0) - this.parceiroVirado) * k;
    this.virarParceiro(this.parceiroVirado);
    this.gina.group.updateMatrixWorld(true);
    const alvo = this.fase === 3 ? this.g.cabecaDe('parceiro').add(new THREE.Vector3(0, -.09, 0))
      : this.fase === 1 ? this.cartao.group.localToWorld(new THREE.Vector3(0, this.cartao.altura / 2, 0))
        : this.gina.cabecaDaGina.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -.1, 0));
    const emPe = innerHeight > innerWidth;
    this.foco(alvo, this.fase === 1 ? emPe ? 78 : 58 : this.fase === 3 ? emPe ? 84 : 60 : emPe ? 84 : 70);
    const pronta = this.fase === 0 ? chegou && this.tempo >= 1.8 : this.fase === 1 ? this.somDoCartao && this.tempo >= 2.4 : this.tempo >= .85;
    if (pronta && this.travada) { this.travada = false; this.proximo.disabled = false; }
  }

  /** Cancelar a cena não consome a homenagem; assistir ou pular consome uma vez. */
  fechar(vista = false): void {
    if (this.fechada) return; this.fechada = true;
    document.removeEventListener('keydown', this.tecla, true);
    this.gina.entrarEmServico(); this.gina.group.position.copy(this.posto);
    this.gina.group.rotation.y = this.giroInicial; this.gina.abaixarDeUmaVez(this.abaixarInicial);
    this.gina.naHomenagem = null; this.gina.cabecaDaGina.rotation.z = 0; this.gina.voltarAPassear();
    this.virarParceiro(0); this.cartao.dispose(); this.luzDaConversa.removeFromParent(); this.foco(null);
    this.raiz.remove(); document.body.classList.remove('portaria-em-homenagem');
    if (this.focoAnterior instanceof HTMLElement && this.focoAnterior.isConnected) this.focoAnterior.focus({ preventScroll: true });
    this.concluir(vista);
  }
}
