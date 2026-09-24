import * as THREE from 'three';
import { flat, translucido } from '../core/materials';
import { PALETTE as P } from '../palette';
import type { Collider, DecoracaoNoSave, GameAPI } from '../core/types';
import type { BotaoDoPosicionador } from '../minigames/jardim/tela';
import type { WorldBuilder } from './WorldBuilder';
import type { Interactable } from './Interactable';
import { circuloEncosta } from './collision';
import { decoracaoPorId, type FichaDeDecoracao } from './decoracoes';

/**
 * O DECORADOR — os enfeites no chão de uma cena, e o MODO DE DECORAR (pedido
 * do Renan: "uma mecânica para a gente conseguir colocar onde a gente quiser
 * cada uma dessas decorações"). Hoje só a estufa usa; ele só fala com o
 * `WorldBuilder` e a `GameAPI`, como uma cena.
 *
 * O QUE ELE FAZ:
 *
 * 1. **Monta o que está no save.** Cada enfeite posto (`DecoracaoNoSave`)
 *    vira a peça no chão, um colisor pequeno (`0,75 · raio`, para a dupla
 *    chegar perto) e um ponto "Mexer no …" — mudar de lugar, girar, guardar.
 * 2. **O modo de decorar.** O enfeite vai "na mão": translúcido, um passo à
 *    frente de quem joga, com um anel no chão — verde onde cabe, vermelho
 *    onde não. É ANDANDO que se escolhe o lugar (o mesmo controle de sempre,
 *    no teclado e no celular). A barra de baixo tem girar, colocar e
 *    cancelar; no teclado, G, E e X.
 * 3. **O modo de edição.** O ponto "Mexer no …" de cada enfeite SÓ EXISTE
 *    nele (pedido do Renan: com muitos enfeites, as caixinhas se amontoavam
 *    e roubavam o "Regar"). Quem liga é a cena — na estufa, o botão "Arrumar
 *    os enfeites" da lojinha. Cada enfeite ganha um anel no chão, os outros
 *    pontos da cena descansam, e a barra de baixo diz que é só chegar perto e
 *    apertar E; o "pronto" (X) sai.
 * 4. **Decide se cabe.** Três perguntas, nessa ordem: a cena proíbe ali?
 *    (`RegrasDoLugar` — parede, canteiro, frente de móvel, vão de passagem:
 *    quem conhece a planta é a cena), a pegada encosta em algum colisor do
 *    mundo?, e ela encosta em outro enfeite?
 *
 * ENQUANTO DECORA, OS PONTOS DA CENA FICAM SUSPENSOS (o mesmo truque da
 * rodada do jardim): o E é do "colocar", e não pode abrir a porta nem falar
 * com a Josefina no meio do caminho.
 *
 * ENFEITE NÃO SEGURA BICHO. Os bichos do jardim andam em linha e nunca leram
 * colisor, e é isso que deixa enfeitar o caminho deles. E quando a cena diz
 * `intangivel` (na estufa, durante a rodada) o colisor sai também para a
 * dupla: gota que cai em cima de um enfeite tem que dar para pegar.
 */

export interface RegrasDoLugar {
  /** por que NÃO dá para pôr um enfeite de `raio` ali (a zona da cena), ou `null` */
  proibido: (x: number, z: number, raio: number) => string | null;
}

/** um enfeite no chão, com o que o mundo sabe dele */
interface Posto {
  readonly uid: number;
  readonly ficha: FichaDeDecoracao;
  readonly peca: THREE.Object3D;
  readonly colisor: Collider;
  readonly ponto: Interactable;
}

interface Modo {
  readonly uid: number;
  readonly ficha: FichaDeDecoracao;
  giro: number;
  readonly fantasma: THREE.Group;
  readonly anel: THREE.Mesh;
  /** onde ele estava antes (mudar de lugar), para o cancelar devolver */
  readonly antes: { x: number; z: number; giro: number } | null;
  readonly suspensas: Interactable[];
  x: number;
  z: number;
  motivo: string | null;
}

/** o enfeite vai a este tanto à frente do corpo, mais o raio dele */
const NA_FRENTE = 0.85;
/** quanto cada "girar" vira */
const PASSO_DO_GIRO = Math.PI / 4;

export class Decorador {
  private readonly g: GameAPI;
  private readonly postos = new Map<number, Posto>();
  private modo: Modo | null = null;
  /** o relógio das animações (a roda gigante, o cata-vento) */
  private t = 0;
  /** no modo de edição: os pontos da cena que ele pôs para descansar */
  private edicao: { suspensas: Interactable[] } | null = null;
  /** o anel de cada enfeite, no modo de edição */
  private readonly aneis = new Map<number, THREE.Mesh>();
  /** a pergunta "o que fazer com…" está aberta: a barra sai da frente dela */
  private perguntando = false;
  /** sem colisor para a dupla (a cena liga na rodada) */
  private semCorpo = false;
  /** a cena é avisada quando um enfeite entra, sai ou muda (quem passeia desvia) */
  aoMudar: (() => void) | null = null;

  constructor(private readonly w: WorldBuilder, private readonly regras: RegrasDoLugar) {
    this.g = w.game;
    for (const d of this.g.decoracoes()) if (d.posta) this.por(d.uid, decoracaoPorId(d.id), d.posta);
    w.onUpdate((dt) => {
      this.t += dt;
      // o que se mexe continua se mexendo — no chão e na mão
      for (const p of this.postos.values()) p.ficha.anima?.(p.peca, this.t);
      if (this.modo) this.modo.ficha.anima?.(this.modo.fantasma, this.t);
      this.atualizar();
    });
  }

  // ------------------------------------------------------ o que a cena lê

  get decorando(): boolean {
    return this.modo !== null;
  }

  get editando(): boolean {
    return this.edicao !== null;
  }

  /** colocando ou editando: a cena não deve religar ponto nenhum dela */
  get ocupado(): boolean {
    return this.modo !== null || this.edicao !== null;
  }

  /** quantos enfeites estão no chão */
  get noChao(): number {
    return this.postos.size;
  }

  /**
   * INTANGÍVEL: o colisor de cada enfeite sai do mundo (e volta quando
   * desliga). A estufa liga durante a rodada — bicho nunca leu colisor, e
   * assim nem a dupla tropeça no flamingo correndo atrás de uma gota.
   */
  set intangivel(sim: boolean) {
    if (sim === this.semCorpo) return;
    this.semCorpo = sim;
    for (const p of this.postos.values()) {
      const i = this.w.colliders.indexOf(p.colisor);
      if (sim && i >= 0) this.w.colliders.splice(i, 1);
      else if (!sim && i < 0) this.w.colliders.push(p.colisor);
    }
  }

  get intangivel(): boolean {
    return this.semCorpo;
  }

  // ---------------------------------------------------- o modo de edição

  /**
   * Liga o modo de edição: o "Mexer no …" de cada enfeite acorda, os outros
   * pontos da cena descansam, e cada enfeite ganha um anel no chão.
   */
  editar(): boolean {
    if (this.ocupado || this.postos.size === 0) return false;
    const meus = new Set([...this.postos.values()].map((p) => p.ponto));
    const suspensas = this.w.interactables.filter((p) => p.enabled && !meus.has(p));
    for (const p of suspensas) p.enabled = false;
    for (const p of meus) p.enabled = true;
    this.edicao = { suspensas };
    for (const uid of this.postos.keys()) this.pintarAnel(uid);
    this.g.som('menu');
    return true;
  }

  /** Sai do modo de edição: os enfeites voltam a ser só enfeite. */
  pararDeEditar(): void {
    const e = this.edicao;
    if (!e) return;
    for (const p of this.postos.values()) p.ponto.enabled = false;
    for (const p of e.suspensas) p.enabled = true;
    this.edicao = null;
    for (const uid of [...this.aneis.keys()]) this.apagarAnel(uid);
    this.g.posicionador(null);
    this.g.som('confirma');
  }

  private pintarAnel(uid: number): void {
    const p = this.postos.get(uid);
    if (!p || this.aneis.has(uid)) return;
    const anel = new THREE.Mesh(
      new THREE.RingGeometry(p.ficha.raio + 0.04, p.ficha.raio + 0.11, 32),
      flat(P.decorarPode, 0.8),
    );
    anel.rotation.x = -Math.PI / 2;
    anel.position.set(p.peca.position.x, 0.025, p.peca.position.z);
    this.w.root.add(anel);
    this.aneis.set(uid, anel);
  }

  private apagarAnel(uid: number): void {
    const anel = this.aneis.get(uid);
    if (!anel) return;
    this.w.root.remove(anel);
    anel.geometry.dispose();
    this.aneis.delete(uid);
  }

  guardadas(id: string): number {
    return this.g.decoracoes().filter((d) => d.id === id && !d.posta).length;
  }

  postas(id: string): number {
    return this.g.decoracoes().filter((d) => d.id === id && d.posta).length;
  }

  /** os enfeites no chão, em círculos — para quem passeia pela cena desviar */
  circulos(): Array<{ x: number; z: number; r: number }> {
    return [...this.postos.values()].map((p) => ({ x: p.peca.position.x, z: p.peca.position.z, r: p.ficha.raio + 0.25 }));
  }

  // ------------------------------------------------------------ comprar

  /** Compra uma unidade: debita e guarda (sem lugar ainda). */
  comprar(id: string): boolean {
    const ficha = decoracaoPorId(id);
    if (!ficha) return false;
    if (!this.g.gastar(ficha.preco)) {
      this.g.toast(`Faltam R$ ${ficha.preco - this.g.carteira()}`, '💸');
      return false;
    }
    const lista = this.g.decoracoes();
    const uid = lista.reduce((m, d) => Math.max(m, d.uid), 0) + 1;
    this.g.salvarDecoracoes([...lista, { uid, id, posta: null }]);
    this.g.som('caixa');
    this.g.toast(`${ficha.nome} — R$ ${ficha.preco}`, '🛍️');
    return true;
  }

  // ---------------------------------------------------- o modo de decorar

  /** Entra no modo com um enfeite GUARDADO daquele tipo na mão. */
  colocar(id: string): boolean {
    const d = this.g.decoracoes().find((k) => k.id === id && !k.posta);
    const ficha = decoracaoPorId(id);
    if (!d || !ficha || this.modo) return false;
    this.entrar(d.uid, ficha, null);
    return true;
  }

  /** Pega um enfeite do chão e entra no modo com ele (o cancelar devolve). */
  mover(uid: number): void {
    const p = this.postos.get(uid);
    if (!p || this.modo) return;
    const antes = { x: p.peca.position.x, z: p.peca.position.z, giro: p.peca.rotation.y };
    this.tirar(uid);
    this.entrar(uid, p.ficha, antes);
  }

  /** Gira um enfeite no chão, no lugar (a pegada é redonda: sempre cabe). */
  girar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    p.peca.rotation.y += PASSO_DO_GIRO;
    this.gravar(uid, { x: p.peca.position.x, z: p.peca.position.z, giro: p.peca.rotation.y });
    this.g.som('confirma');
  }

  /** Tira do chão e guarda (volta a contar como guardado na loja). */
  guardar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    this.tirar(uid);
    this.gravar(uid, null);
    this.g.som('menu');
    this.g.toast(`${p.ficha.nome} ${p.ficha.artigo === 'a' ? 'guardada' : 'guardado'} — dá para pôr de novo pela lojinha`, p.ficha.icone);
    // guardou o último: não sobra nada para arrumar
    if (this.edicao && this.postos.size === 0) this.pararDeEditar();
  }

  private entrar(uid: number, ficha: FichaDeDecoracao, antes: Modo['antes']): void {
    const fantasma = ficha.monta();
    fantasma.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = false;
      m.material = Array.isArray(m.material) ? m.material.map((k) => translucido(k, 0.6)) : translucido(m.material, 0.6);
    });
    fantasma.rotation.y = antes?.giro ?? 0;
    const anel = new THREE.Mesh(new THREE.RingGeometry(ficha.raio, ficha.raio + 0.07, 32), flat(P.decorarPode));
    anel.rotation.x = -Math.PI / 2;
    anel.position.y = 0.02;
    this.w.root.add(fantasma, anel);
    // os pontos da cena param: o E agora é do "colocar"
    const suspensas = this.w.interactables.filter((p) => p.enabled);
    for (const p of suspensas) p.enabled = false;
    this.modo = { uid, ficha, giro: antes?.giro ?? 0, fantasma, anel, antes, suspensas, x: 0, z: 0, motivo: null };
    this.atualizar();
  }

  private sair(): void {
    const m = this.modo;
    if (!m) return;
    this.w.root.remove(m.fantasma, m.anel);
    m.anel.geometry.dispose();
    m.fantasma.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
    for (const p of m.suspensas) p.enabled = true;
    this.modo = null;
    this.g.posicionador(null);
  }

  /** o botão da barra (ou a tecla) */
  private apertar(b: BotaoDoPosicionador): void {
    const m = this.modo;
    if (!m) return;
    if (b === 'girar') {
      m.giro += PASSO_DO_GIRO;
      this.g.som('menu');
    } else if (b === 'cancelar') {
      // quem veio do chão volta para onde estava; quem veio da loja volta a ser guardado
      if (m.antes) this.por(m.uid, m.ficha, m.antes);
      this.sair();
    } else if (!m.motivo) {
      const onde = { x: m.x, z: m.z, giro: m.giro };
      this.sair();
      this.por(m.uid, m.ficha, onde);
      this.gravar(m.uid, onde);
      this.g.som('brotar');
      this.g.toast(`${m.ficha.nome} no lugar`, m.ficha.icone);
    } else {
      this.g.som('toast');
    }
  }

  private atualizar(): void {
    const m = this.modo;
    if (!m) {
      this.atualizarEdicao();
      return;
    }
    if (this.g.keyPressed('KeyG')) this.apertar('girar');
    if (this.g.keyPressed('KeyX')) this.apertar('cancelar');
    if (this.g.keyPressed('KeyE')) this.apertar('colocar');
    if (this.modo !== m) return;
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    const longe = NA_FRENTE + m.ficha.raio;
    m.x = eu.x + Math.sin(f) * longe;
    m.z = eu.z + Math.cos(f) * longe;
    m.motivo = this.porQueNao(m.x, m.z, m.ficha.raio);
    m.fantasma.position.set(m.x, 0, m.z);
    m.fantasma.rotation.y = m.giro;
    m.anel.position.set(m.x, 0.02, m.z);
    m.anel.material = flat(m.motivo ? P.decorarNaoPode : P.decorarPode);
    this.g.posicionador(
      { tipo: 'colocar', nome: m.ficha.nome, icone: m.ficha.icone, valido: !m.motivo, motivo: m.motivo ?? undefined },
      (b) => this.apertar(b),
    );
  }

  /** a barra do modo de edição, e o X que sai dele */
  private atualizarEdicao(): void {
    if (!this.edicao) return;
    if (this.perguntando) {
      this.g.posicionador(null);
      return;
    }
    if (this.g.keyPressed('KeyX')) {
      this.pararDeEditar();
      return;
    }
    this.g.posicionador({ tipo: 'editar', postos: this.postos.size }, (b) => {
      if (b === 'pronto') this.pararDeEditar();
    });
  }

  /** `null` se cabe; senão, o porquê, em palavras de gente */
  porQueNao(x: number, z: number, raio: number): string | null {
    const daCena = this.regras.proibido(x, z, raio);
    if (daCena) return daCena;
    for (const p of this.postos.values()) {
      if (Math.hypot(x - p.peca.position.x, z - p.peca.position.z) < raio + p.ficha.raio) return 'em cima de outro enfeite';
    }
    if (circuloEncosta(x, z, raio, this.w.colliders)) return 'encostado em outra coisa';
    const par = this.g.companionPosition();
    if (Math.hypot(x - par.x, z - par.z) < raio + 0.45) return `em cima de ${this.g.companionName()}`;
    return null;
  }

  // ------------------------------------------------- o enfeite no chão

  private por(uid: number, ficha: FichaDeDecoracao | undefined, onde: { x: number; z: number; giro: number }): void {
    if (!ficha) return;
    const peca = this.w.add(this.w.place(ficha.monta(), onde.x, 0, onde.z, onde.giro));
    const colisor: Collider = { kind: 'circle', x: onde.x, z: onde.z, r: ficha.raio * 0.75 };
    if (!this.semCorpo) this.w.colliders.push(colisor);
    const de = ficha.artigo === 'a' ? 'na' : 'no';
    const ponto = this.w.interact({
      id: `decoracao:${uid}`,
      // prioridade NORMAL: ganha o prompt mais perto. E ele só existe no modo
      // de edição, onde os pontos da cena (o "Regar", a porta) descansam
      x: onde.x, z: onde.z, radius: ficha.raio + 0.75,
      label: `Mexer ${de} ${ficha.nome.charAt(0).toLowerCase()}${ficha.nome.slice(1)}`,
      icon: ficha.icone,
      highlight: peca,
      onInteract: async (g) => {
        this.perguntando = true;
        let qual: number;
        try {
          qual = await g.ask(`O que fazer com ${ficha.artigo} ${ficha.nome.toLowerCase()}?`, [
            'Mudar de lugar', 'Girar', 'Guardar', 'Deixar assim',
          ]);
        } finally {
          this.perguntando = false;
        }
        if (qual === 0) this.mover(uid);
        else if (qual === 1) this.girar(uid);
        else if (qual === 2) this.guardar(uid);
      },
    });
    /*
     * FORA DO MODO DE EDIÇÃO O PONTO DORME. Posto durante o modo de colocar (o
     * cancelar do "mudar de lugar"), ele entra na lista do modo — que só o
     * religa se a dupla estiver editando.
     */
    ponto.enabled = false;
    if (this.modo && this.edicao) this.modo.suspensas.push(ponto);
    else if (this.edicao) ponto.enabled = true;
    this.postos.set(uid, { uid, ficha, peca, colisor, ponto });
    if (this.edicao) this.pintarAnel(uid);
    this.aoMudar?.();
  }

  private tirar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    this.w.root.remove(p.peca);
    p.peca.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
    const i = this.w.colliders.indexOf(p.colisor);
    if (i >= 0) this.w.colliders.splice(i, 1);
    const j = this.w.interactables.indexOf(p.ponto);
    if (j >= 0) this.w.interactables.splice(j, 1);
    this.apagarAnel(uid);
    this.postos.delete(uid);
    this.aoMudar?.();
  }

  private gravar(uid: number, posta: DecoracaoNoSave['posta']): void {
    this.g.salvarDecoracoes(this.g.decoracoes().map((d) => (d.uid === uid ? { ...d, posta } : d)));
  }
}
