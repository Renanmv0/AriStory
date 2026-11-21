import * as THREE from 'three';
import type { Gina } from '../../entities/bichos/Gina';
import { recadoDaGina } from '../../minigames/portaria/abertura';
import type { Data } from '../../minigames/portaria/tipos';
import type { MesaDaPortaria } from '../../world/mesaDaPortaria';
import '../../ui/aberturaDaPortaria.css';

interface Pose { posicao: THREE.Vector3; giro: THREE.Quaternion; escala: THREE.Vector3 }
const poseDe = (o: THREE.Object3D): Pose => ({ posicao: o.position.clone(), giro: o.quaternion.clone(), escala: o.scale.clone() });

/** Uma conversa do banco de quem joga. Nada aqui altera o expediente ou o save. */
export class AberturaDaGina {
  readonly pronta: Promise<void>;
  private concluir!: () => void;
  private readonly raiz = document.createElement('section');
  private readonly texto = document.createElement('p');
  private readonly etapa = document.createElement('span');
  private readonly proximo = document.createElement('button');
  private readonly recado;
  private readonly poses = new Map<THREE.Object3D, Pose>();
  private readonly alvos = new Map<THREE.Object3D, Pose>();
  private readonly luz = new THREE.PointLight(0xffefd2, 1.2, 4, 1);
  private readonly giroDaGina: number;
  private readonly alturaDaGina: number;
  private readonly postoDaGina: THREE.Vector3;
  private fase = 0;
  private tempo = 0;
  private fechada = false;
  private animando = false;
  private aguarda: { falta: number; pronto: () => void } | null = null;
  private readonly menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(
    n: number, hoje: Data, private readonly mesa: MesaDaPortaria, private readonly gina: Gina,
    private readonly foco: (para: THREE.Vector3 | null, lente?: number) => void,
    private readonly som: (qual: 'folhear' | 'fala' | 'tranco') => void,
  ) {
    this.recado = recadoDaGina(n, hoje);
    this.giroDaGina = gina.group.rotation.y;
    this.alturaDaGina = gina.abaixar;
    this.postoDaGina = gina.group.position.clone();
    gina.entrarEmServico();
    gina.group.position.set(1.75, this.postoDaGina.y, 1.35);
    this.luz.position.set(.25, 2.25, .65);
    mesa.group.add(this.luz);
    this.pronta = new Promise(pronto => { this.concluir = pronto; });
    this.raiz.className = 'pt-abertura';
    this.raiz.setAttribute('aria-label', 'Abertura do expediente com a Gina');
    this.raiz.innerHTML = '<header><span class="pt-ab-dia"></span><button class="pt-ab-pular" type="button">Pular explicação ↪</button></header><div class="pt-ab-cartao"><div class="pt-ab-etiqueta">🦒 Gina <span></span></div><h2></h2><div class="pt-ab-fala"></div><footer></footer></div>';
    this.raiz.querySelector('.pt-ab-dia')!.textContent = `Dia ${n} · Antes de abrir`;
    this.raiz.querySelector('h2')!.textContent = this.recado.titulo;
    this.raiz.querySelector('.pt-ab-etiqueta span')!.append(this.etapa);
    this.texto.setAttribute('aria-live', 'polite');
    this.raiz.querySelector('.pt-ab-fala')!.append(this.texto);
    this.proximo.type = 'button';
    this.proximo.className = 'pt-ab-proximo';
    this.proximo.addEventListener('click', () => void this.avancar());
    this.raiz.querySelector('footer')!.append(this.proximo);
    this.raiz.querySelector('header button')!.addEventListener('click', () => this.fechar());
    document.body.append(this.raiz);
    document.body.classList.add('portaria-em-abertura');
    document.addEventListener('keydown', this.tecla, true);
    this.mostrar();
    this.proximo.focus({ preventScroll: true });
  }

  private readonly tecla = (e: KeyboardEvent): void => {
    if (e.code === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); this.fechar(); }
    else if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat && !(e.target instanceof HTMLButtonElement && e.target !== this.proximo)) {
      e.preventDefault(); e.stopImmediatePropagation(); void this.avancar();
    }
  };

  private mostrar(): void {
    this.raiz.dataset.etapa = String(this.fase);
    this.etapa.textContent = `${this.fase + 1} / 3`;
    this.texto.textContent = [this.recado.boasVindas, this.recado.exemplo, this.recado.lembrete][this.fase];
    this.proximo.textContent = ['Ver exemplo →', 'Entendi →', 'Começar expediente 🔔'][this.fase];
    this.som('fala');
    const dupla = this.recado.papeis.length > 1 || this.recado.apoio === 'prancheta' || this.recado.apoio === 'calendario';
    this.foco(this.fase === 0 ? new THREE.Vector3(.85, 2.4, 1.1)
      : this.fase === 1 ? new THREE.Vector3(0, 1.4, 1.28) : new THREE.Vector3(.04, 1.22, 1.6),
    innerHeight > innerWidth && this.fase === 1 && dupla ? 94 : this.fase === 0 ? 76 : 68);
  }

  private guardar(o: THREE.Object3D): void {
    if (!this.poses.has(o)) this.poses.set(o, poseDe(o));
  }

  private erguer(o: THREE.Object3D, x: number, escala: number): void {
    this.guardar(o);
    this.alvos.set(o, { posicao: new THREE.Vector3(x, 1.44, 1.25),
      giro: new THREE.Quaternion().setFromEuler(new THREE.Euler(-.94, 0, 0)), escala: new THREE.Vector3(escala, escala, escala) });
  }

  private async avancar(): Promise<void> {
    if (this.fechada || this.animando) return;
    if (this.fase === 2) { this.fechar(); return; }
    this.fase++; this.mostrar();
    this.animando = true; this.proximo.disabled = true;
    if (this.fase === 1) {
      this.raiz.dataset.exemplo = 'sim';
      // Ela passa os exemplos do seu lado da bancada, sem chamar ninguém da fila.
      await this.mesa.receber(this.recado.papeis, () => new THREE.Vector3(.88, 1.53, 1.3));
      if (this.fechada) return;
      this.som('folhear');
      if (this.recado.apoio === 'soClube') {
        await this.mesa.carimbar('soClube');
        if (this.fechada) return;
        this.som('tranco');
      }
      const apoio = this.recado.apoio === 'prancheta' ? this.mesa.prancheta
        : this.recado.apoio === 'calendario' ? this.mesa.calendario : null;
      const papeis = this.recado.papeis;
      const dois = papeis.length > 1 || !!apoio;
      papeis.forEach((p, i) => this.erguer(this.mesa.papelDe(p.tipo), dois ? .19 - i * .38 : 0, p.tipo === 'cracha' || p.tipo === 'carteirinha' ? 1.6 : 1.28));
      if (apoio) {
        this.erguer(apoio, -.19, apoio === this.mesa.calendario ? 1.6 : 1.05);
        if (apoio === this.mesa.calendario) {
          const alvo = this.alvos.get(apoio)!;
          alvo.giro.setFromEuler(new THREE.Euler(.05, Math.PI, 0));
          alvo.posicao.y = 1.32;
        }
      }
      await this.esperar(this.menosMovimento ? 0 : .6);
    } else {
      this.raiz.dataset.exemplo = 'nao';
      for (const [o, pose] of this.poses) this.alvos.set(o, pose);
      await this.esperar(this.menosMovimento ? 0 : .5);
      if (this.fechada) return;
      this.restaurar();
      await this.mesa.devolver();
    }
    if (this.fechada) return;
    this.animando = false; this.proximo.disabled = false;
    this.proximo.focus({ preventScroll: true });
  }

  private esperar(segundos: number): Promise<void> {
    if (!segundos || this.fechada) return Promise.resolve();
    return new Promise(pronto => { this.aguarda = { falta: segundos, pronto }; });
  }

  update(dt: number): void {
    if (this.fechada) return;
    this.tempo += dt;
    // A Gina vira para os dois e faz um aceno de cabeça; o resto do rig continua respirando.
    const k = this.menosMovimento ? 1 : 1 - Math.exp(-5 * dt);
    const giro = this.fase === 0 ? -2 : -1.75;
    this.gina.group.rotation.y += (giro - this.gina.group.rotation.y) * k;
    this.gina.abaixar = this.fase === 0 ? .7 : .8;
    this.gina.cabecaDaGina.rotation.y = -.15;
    if (!this.menosMovimento) this.gina.cabecaDaGina.rotation.x += Math.sin(this.tempo * 2.8) * .045;
    if (this.fase === 0) {
      this.gina.group.updateMatrixWorld(true);
      const cabeca = this.gina.cabecaDaGina.getWorldPosition(new THREE.Vector3());
      this.foco(cabeca.add(new THREE.Vector3(0, -.1, 0)), innerHeight > innerWidth ? 80 : 64);
    }
    for (const [o, alvo] of this.alvos) {
      o.position.lerp(alvo.posicao, k); o.quaternion.slerp(alvo.giro, k); o.scale.lerp(alvo.escala, k);
    }
    if (this.aguarda) {
      this.aguarda.falta -= dt;
      if (this.aguarda.falta <= 0) { const pronto = this.aguarda.pronto; this.aguarda = null; pronto(); }
    }
  }

  private restaurar(): void {
    for (const [o, p] of this.poses) { o.position.copy(p.posicao); o.quaternion.copy(p.giro); o.scale.copy(p.escala); }
    this.poses.clear(); this.alvos.clear();
  }

  /** Pular e desmontar cancelam também os voos/promessas, sem callbacks tardios no expediente. */
  fechar(): void {
    if (this.fechada) return;
    this.fechada = true;
    this.restaurar(); this.mesa.limparDemonstracao();
    this.gina.group.rotation.y = this.giroDaGina;
    this.gina.group.position.copy(this.postoDaGina);
    this.gina.abaixar = this.alturaDaGina;
    this.gina.voltarAPassear();
    this.aguarda?.pronto(); this.aguarda = null;
    this.raiz.remove();
    this.luz.removeFromParent();
    document.removeEventListener('keydown', this.tecla, true);
    document.body.classList.remove('portaria-em-abertura');
    this.foco(null); this.concluir();
  }
}
