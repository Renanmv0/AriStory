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
 * 3. **Decide se cabe.** Três perguntas, nessa ordem: a cena proíbe ali?
 *    (`RegrasDoLugar` — terreiro, caminhos, frente de móvel: quem conhece a
 *    planta é a cena), a pegada encosta em algum colisor do mundo?, e ela
 *    encosta em outro enfeite?
 *
 * ENQUANTO DECORA, OS PONTOS DA CENA FICAM SUSPENSOS (o mesmo truque da
 * rodada do jardim): o E é do "colocar", e não pode abrir a porta nem falar
 * com a Josefina no meio do caminho.
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
    if (!m) return;
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
      { nome: m.ficha.nome, icone: m.ficha.icone, valido: !m.motivo, motivo: m.motivo ?? undefined },
      (b) => this.apertar(b),
    );
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
    this.w.colliders.push(colisor);
    const de = ficha.artigo === 'a' ? 'na' : 'no';
    const ponto = this.w.interact({
      id: `decoracao:${uid}`,
      // prioridade NORMAL: ganha o prompt mais perto. Com prioridade menor, o
      // "Regar" de um canteiro vizinho roubava o enfeite para sempre; e a
      // frente da lojinha, do livro e da bancada já é proibida para enfeite
      x: onde.x, z: onde.z, radius: ficha.raio + 0.75,
      label: `Mexer ${de} ${ficha.nome.charAt(0).toLowerCase()}${ficha.nome.slice(1)}`,
      icon: ficha.icone,
      highlight: peca,
      onInteract: async (g) => {
        const qual = await g.ask(`O que fazer com ${ficha.artigo} ${ficha.nome.toLowerCase()}?`, [
          'Mudar de lugar', 'Girar', 'Guardar', 'Deixar assim',
        ]);
        if (qual === 0) this.mover(uid);
        else if (qual === 1) this.girar(uid);
        else if (qual === 2) this.guardar(uid);
      },
    });
    // enfeite posto durante o modo (o cancelar do "mudar de lugar") já nasce suspenso
    if (this.modo) {
      ponto.enabled = false;
      this.modo.suspensas.push(ponto);
    }
    this.postos.set(uid, { uid, ficha, peca, colisor, ponto });
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
    this.postos.delete(uid);
    this.aoMudar?.();
  }

  private gravar(uid: number, posta: DecoracaoNoSave['posta']): void {
    this.g.salvarDecoracoes(this.g.decoracoes().map((d) => (d.uid === uid ? { ...d, posta } : d)));
  }
}
