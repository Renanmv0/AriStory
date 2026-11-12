import * as THREE from 'three';
import { flat, translucido } from '../core/materials';
import { PALETTE as P } from '../palette';
import type { CenaDeDecorar, Collider, GameAPI, PostaNoSave } from '../core/types';
import type { BotaoDoPosicionador } from '../minigames/jardim/tela';
import type { WorldBuilder } from './WorldBuilder';
import type { Interactable } from './Interactable';
import { circuloEncosta } from './collision';
import { fundir } from './fundir';
import { decoracaoPorId, type FichaDeDecoracao } from './decoracoes';

/**
 * O DECORADOR — os enfeites no chão de uma cena, e o MODO DE DECORAR (pedido
 * do Renan: "uma mecânica para a gente conseguir colocar onde a gente quiser
 * cada uma dessas decorações"). A estufa e o quintal usam; ele só fala com o
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

/**
 * DE ONDE SAI O PAGAMENTO de um enfeite. Na estufa são os GIRASSÓIS (a moeda
 * que só a rodada do jardim paga): a cena diz qual é, e o decorador só pede.
 */
export interface Cofre {
  saldo(): number;
  /** tira `quanto` e devolve `true`, ou não tira nada e devolve `false` */
  gastar(quanto: number): boolean;
  /** "12 girassóis", para o toast */
  escrever(quanto: number): string;
  readonly icone: string;
}

/**
 * UMA SUPERFÍCIE DA CENA onde se prende enfeite (`docs/QUINTAL.md` §3, etapa
 * 3): uma PAREDE (a fachada, a parede da garagem, a face de fora do muro), um
 * TAMPO (o alto do muro e da mureta) ou uma VIGA (o pergolado, o beiral). É
 * sempre uma linha reta no chão, de `a` a `b`, numa altura.
 */
export interface Superficie {
  readonly id: string;
  readonly tipo: 'parede' | 'emCima' | 'pendurado';
  /** para a barra: "a fachada", "o muro", "a viga do pergolado" */
  readonly nome: string;
  readonly a: readonly [number, number];
  readonly b: readonly [number, number];
  /** parede: a faixa de altura que se pode usar; tampo e viga: a altura dele (`y0`) */
  readonly y0: number;
  readonly y1?: number;
  /**
   * PARA ONDE ELA OLHA: na parede, a face (o enfeite vira para lá); no tampo,
   * o lado de onde se põe (é por lá que fica o "Mexer no…"). Viga: `[0, 0]`.
   */
  readonly normal: readonly [number, number];
  /** na parede: o que não se tapa (porta, janela, lampião), em `s` (metros desde `a`) e `y` */
  readonly buracos?: ReadonlyArray<{ readonly s0: number; readonly s1: number; readonly y0: number; readonly y1: number; readonly nome: string }>;
}

export interface RegrasDoLugar {
  /**
   * por que NÃO dá para pôr um enfeite de `raio` ali (a zona da cena), ou
   * `null`. A `ficha` vem junto para a cena que olha a ALTURA (o quintal: o
   * que é alto não vai perto do muro do lado da câmera).
   */
  proibido: (x: number, z: number, raio: number, ficha?: FichaDeDecoracao) => string | null;
  /** onde se pega de novo um enfeite guardado, para o toast ("pela lojinha") */
  readonly ondeGuardar?: string;
  /** as paredes, os tampos e as vigas (sem elas, só o chão — a estufa) */
  readonly superficies?: readonly Superficie[];
  /** os pontos de amarrar o que vai de ponta a ponta (o alto do pilar, a viga, o beiral) */
  readonly amarras?: ReadonlyArray<{ readonly x: number; readonly y: number; readonly z: number }>;
}

type Encaixe = NonNullable<FichaDeDecoracao['encaixe']> | 'chao';
const encaixeDe = (f: FichaDeDecoracao): Encaixe => f.encaixe ?? 'chao';

/** um enfeite no mundo, com o que o mundo sabe dele */
interface Posto {
  readonly uid: number;
  readonly ficha: FichaDeDecoracao;
  readonly peca: THREE.Object3D;
  /** piso e o que não está no chão não têm colisor */
  readonly colisor: Collider | null;
  readonly ponto: Interactable;
  /** onde ele está guardado no save (é o que o "mudar de lugar" devolve no cancelar) */
  readonly onde: Onde;
  /** onde fica o anel e o "Mexer no…", no chão (a frente da parede, o pé do muro) */
  readonly chao: { x: number; z: number };
}

/** o lugar de um enfeite, como vai para o save (sem a cena, que é do decorador) */
type Onde = Omit<PostaNoSave, 'cena'>;

interface Modo {
  readonly uid: number;
  readonly ficha: FichaDeDecoracao;
  giro: number;
  fantasma: THREE.Group;
  readonly anel: THREE.Mesh;
  /** onde ele estava antes (mudar de lugar), para o cancelar devolver */
  readonly antes: Onde | null;
  readonly suspensas: Interactable[];
  x: number;
  z: number;
  /** a altura: na parede, a escolhida (▲ ▼); nos outros, a do tampo ou da viga */
  y: number;
  altura: number;
  sup: Superficie | null;
  /** de ponta a ponta: a primeira ponta, quando já escolhida, e a segunda que está na mira */
  pontaA: THREE.Vector3 | null;
  pontaB: THREE.Vector3 | null;
  motivo: string | null;
}

/** o enfeite vai a este tanto à frente do corpo, mais o raio dele */
const NA_FRENTE = 0.85;
/** quanto cada "girar" vira */
const PASSO_DO_GIRO = Math.PI / 4;
/** quanto cada ▲ ▼ sobe ou desce na parede */
const PASSO_DA_ALTURA = 0.1;
/** até onde o fantasma "gruda" numa parede, num tampo ou numa viga */
const ALCANCE = 2.4;

/** a altura de cada enfeite, medida do modelo uma vez só (a parede e a régua da câmera usam) */
const ALTURAS = new Map<string, { baixo: number; alto: number }>();
export function alturaDaFicha(ficha: FichaDeDecoracao): { baixo: number; alto: number } {
  let h = ALTURAS.get(ficha.id);
  if (!h) {
    const peca = ficha.monta();
    const caixa = new THREE.Box3().setFromObject(peca);
    peca.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    h = { baixo: caixa.min.y, alto: caixa.max.y };
    ALTURAS.set(ficha.id, h);
  }
  return h;
}

/** o ponto da linha `a`–`b` mais perto de (x, z): a distância desde `a` e o ponto */
function naLinha(sup: Superficie, x: number, z: number): { s: number; L: number; px: number; pz: number; d: number } {
  const [ax, az] = sup.a;
  const dx = sup.b[0] - ax;
  const dz = sup.b[1] - az;
  const L = Math.hypot(dx, dz);
  const s = Math.max(0, Math.min(L, ((x - ax) * dx + (z - az) * dz) / L));
  const px = ax + (dx / L) * s;
  const pz = az + (dz / L) * s;
  return { s, L, px, pz, d: Math.hypot(x - px, z - pz) };
}

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
  /** quantos pisos já foram postos (a ordem de pintura de cada um) */
  private pisos = 0;
  /** a cena é avisada quando um enfeite entra, sai ou muda (quem passeia desvia) */
  aoMudar: (() => void) | null = null;

  constructor(
    private readonly w: WorldBuilder,
    private readonly regras: RegrasDoLugar,
    private readonly cofre: Cofre,
    /** o lugar deste decorador: ele só monta (e só grava) os enfeites daqui */
    readonly cena: CenaDeDecorar = 'estufa',
  ) {
    this.g = w.game;
    for (const d of this.g.decoracoes()) {
      if (!d.posta || (d.posta.cena ?? 'estufa') !== cena) continue;
      // preso numa superfície que a cena não tem mais: volta ao baú (nunca some)
      if (!this.por(d.uid, decoracaoPorId(d.id), d.posta)) this.gravar(d.uid, null);
    }
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

  /** quantos enfeites estão no lugar */
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
      if (!p.colisor) continue;
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
    const r = encaixeDe(p.ficha) === 'chao' ? p.ficha.raio : 0.35;
    const anel = new THREE.Mesh(new THREE.RingGeometry(r + 0.04, r + 0.11, 32), flat(P.decorarPode, 0.8));
    anel.rotation.x = -Math.PI / 2;
    anel.position.set(p.chao.x, 0.025, p.chao.z);
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

  /** no baú: comprados, já entregues e sem lugar (o baú é um só para os dois lugares) */
  guardadas(id: string): number {
    return this.g.decoracoes().filter((d) => d.id === id && !d.posta && !d.aCaminho).length;
  }

  /** no lugar, DESTE lugar */
  postas(id: string): number {
    return this.g.decoracoes().filter((d) => d.id === id && (d.posta?.cena ?? 'estufa') === this.cena && d.posta).length;
  }

  /** os enfeites no chão, em círculos — para quem passeia pela cena desviar */
  circulos(): Array<{ x: number; z: number; r: number }> {
    return [...this.postos.values()].filter((p) => p.colisor)
      .map((p) => ({ x: p.peca.position.x, z: p.peca.position.z, r: p.ficha.raio + 0.25 }));
  }

  // ------------------------------------------------------------ comprar

  /** Compra uma unidade: paga do cofre da cena e guarda (sem lugar ainda). */
  comprar(id: string): boolean {
    const ficha = decoracaoPorId(id);
    if (!ficha) return false;
    if (!this.cofre.gastar(ficha.girassois)) {
      this.g.toast(`Faltam ${this.cofre.escrever(ficha.girassois - this.cofre.saldo())}`, this.cofre.icone);
      return false;
    }
    const lista = this.g.decoracoes();
    const uid = lista.reduce((m, d) => Math.max(m, d.uid), 0) + 1;
    this.g.salvarDecoracoes([...lista, { uid, id, posta: null }]);
    this.g.som('caixa');
    this.g.toast(`${ficha.nome} — ${this.cofre.escrever(ficha.girassois)}`, '🛍️');
    return true;
  }

  // ---------------------------------------------------- o modo de decorar

  /** Entra no modo com um enfeite GUARDADO daquele tipo na mão. */
  colocar(id: string): boolean {
    const d = this.g.decoracoes().find((k) => k.id === id && !k.posta && !k.aCaminho);
    const ficha = decoracaoPorId(id);
    if (!d || !ficha || this.modo) return false;
    this.entrar(d.uid, ficha, null);
    return true;
  }

  /** Pega um enfeite do lugar e entra no modo com ele (o cancelar devolve). */
  mover(uid: number): void {
    const p = this.postos.get(uid);
    if (!p || this.modo) return;
    this.tirar(uid);
    this.entrar(uid, p.ficha, p.onde);
  }

  /** Gira um enfeite no lugar (a pegada é redonda: sempre cabe). O da parede e o de ponta a ponta não giram. */
  girar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    if (encaixeDe(p.ficha) === 'parede' || encaixeDe(p.ficha) === 'pontaAPonta') {
      this.g.toast('Esse fica sempre de frente', p.ficha.icone);
      return;
    }
    p.peca.rotation.y += PASSO_DO_GIRO;
    const onde = { ...p.onde, giro: p.peca.rotation.y };
    this.postos.set(uid, { ...p, onde });
    this.gravar(uid, onde);
    this.g.som('confirma');
  }

  /** Tira do lugar e guarda (volta a contar como guardado na loja). */
  guardar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    this.tirar(uid);
    this.gravar(uid, null);
    this.g.som('menu');
    this.g.toast(`${p.ficha.nome} ${p.ficha.artigo === 'a' ? 'guardada' : 'guardado'} — dá para pôr de novo ${this.regras.ondeGuardar ?? 'pela lojinha'}`, p.ficha.icone);
    // guardou o último: não sobra nada para arrumar
    if (this.edicao && this.postos.size === 0) this.pararDeEditar();
  }

  /** o fantasma: a peça translúcida, sem sombra */
  private fantasmaDe(peca: THREE.Group): THREE.Group {
    peca.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = false;
      m.material = Array.isArray(m.material) ? m.material.map((k) => translucido(k, 0.6)) : translucido(m.material, 0.6);
    });
    return peca;
  }

  private entrar(uid: number, ficha: FichaDeDecoracao, antes: Onde | null): void {
    const fantasma = this.fantasmaDe(ficha.monta());
    fantasma.rotation.y = antes?.giro ?? 0;
    // de ponta a ponta: a peça só aparece quando as duas pontas existem
    if (encaixeDe(ficha) === 'pontaAPonta') fantasma.visible = false;
    const anel = new THREE.Mesh(new THREE.RingGeometry(ficha.raio, ficha.raio + 0.07, 32), flat(P.decorarPode));
    anel.rotation.x = -Math.PI / 2;
    anel.position.y = 0.02;
    this.w.root.add(fantasma, anel);
    // os pontos da cena param: o E agora é do "colocar"
    const suspensas = this.w.interactables.filter((p) => p.enabled);
    for (const p of suspensas) p.enabled = false;
    const altura = antes?.y ?? ficha.alturaPadrao ?? 1.4;
    this.modo = {
      uid, ficha, giro: antes?.giro ?? 0, fantasma, anel, antes, suspensas,
      x: 0, z: 0, y: 0, altura, sup: null, pontaA: null, pontaB: null, motivo: null,
    };
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

  /** onde o modo está agora, do jeito que vai para o save */
  private ondeDoModo(m: Modo): Onde {
    const e = encaixeDe(m.ficha);
    if (e === 'chao') return { x: m.x, z: m.z, giro: m.giro };
    if (e === 'pontaAPonta') {
      const a = m.pontaA!;
      const b = m.pontaB!;
      return { x: a.x, z: a.z, giro: 0, encaixe: e, y: a.y, ate: { x: b.x, y: b.y, z: b.z } };
    }
    return { x: m.x, z: m.z, giro: m.giro, encaixe: e, y: m.y, sup: m.sup?.id };
  }

  /** o botão da barra (ou a tecla) */
  private apertar(b: BotaoDoPosicionador): void {
    const m = this.modo;
    if (!m) return;
    const ponta = encaixeDe(m.ficha) === 'pontaAPonta';
    if (b === 'girar') {
      if (encaixeDe(m.ficha) === 'parede' || ponta) return;
      m.giro += PASSO_DO_GIRO;
      this.g.som('menu');
    } else if (b === 'subir' || b === 'descer') {
      if (encaixeDe(m.ficha) !== 'parede') return;
      m.altura += b === 'subir' ? PASSO_DA_ALTURA : -PASSO_DA_ALTURA;
      this.g.som('menu');
    } else if (b === 'cancelar') {
      // de ponta a ponta, o X desfaz a primeira ponta antes de cancelar tudo
      if (ponta && m.pontaA) {
        m.pontaA = null;
        m.fantasma.visible = false;
        this.g.som('menu');
        return;
      }
      // quem veio do lugar volta para onde estava; quem veio do baú volta a ser guardado
      if (m.antes) this.por(m.uid, m.ficha, m.antes);
      this.sair();
    } else if (ponta && !m.pontaA) {
      // o primeiro E marca a primeira ponta
      if (m.motivo || !m.pontaB) {
        this.g.som('toast');
        return;
      }
      m.pontaA = m.pontaB.clone();
      m.pontaB = null;
      this.g.som('confirma');
    } else if (!m.motivo) {
      const onde = this.ondeDoModo(m);
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
    if (this.g.keyPressed('Equal') || this.g.keyPressed('NumpadAdd') || this.g.keyPressed('PageUp')) this.apertar('subir');
    if (this.g.keyPressed('Minus') || this.g.keyPressed('NumpadSubtract') || this.g.keyPressed('PageDown')) this.apertar('descer');
    if (this.modo !== m) return;
    const e = encaixeDe(m.ficha);
    if (e === 'chao') this.mirarNoChao(m);
    else if (e === 'pontaAPonta') this.mirarDePontaAPonta(m);
    else this.mirarNaSuperficie(m, e);
    m.anel.material = flat(m.motivo ? P.decorarNaoPode : P.decorarPode);
    this.g.posicionador(
      {
        tipo: 'colocar', nome: m.ficha.nome, icone: m.ficha.icone, valido: !m.motivo, motivo: m.motivo ?? undefined,
        altura: e === 'parede' && m.sup ? m.y : undefined,
        ponta: e === 'pontaAPonta' ? (m.pontaA ? 'a segunda ponta' : 'a primeira ponta') : undefined,
        giravel: e !== 'parede' && e !== 'pontaAPonta',
      },
      (b) => this.apertar(b),
    );
  }

  /** o de sempre: um passo à frente de quem joga, no chão */
  private mirarNoChao(m: Modo): void {
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    const longe = NA_FRENTE + m.ficha.raio;
    m.x = eu.x + Math.sin(f) * longe;
    m.z = eu.z + Math.cos(f) * longe;
    m.motivo = this.porQueNao(m.x, m.z, m.ficha.raio, m.ficha);
    m.fantasma.position.set(m.x, 0, m.z);
    m.fantasma.rotation.y = m.giro;
    m.anel.position.set(m.x, 0.02, m.z);
  }

  /**
   * NA PAREDE, EM CIMA, PENDURADO: o fantasma GRUDA na superfície daquele tipo
   * mais perto do ponto à frente de quem joga (a parede só de frente para
   * ela). Andar ao longo dela leva o enfeite junto; na parede, ▲ ▼ escolhem a
   * altura.
   */
  private mirarNaSuperficie(m: Modo, e: 'parede' | 'emCima' | 'pendurado'): void {
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    const fx = eu.x + Math.sin(f) * 1.1;
    const fz = eu.z + Math.cos(f) * 1.1;
    let melhor: { sup: Superficie; s: number; L: number; px: number; pz: number; d: number } | null = null;
    for (const sup of this.regras.superficies ?? []) {
      if (sup.tipo !== e) continue;
      // a parede, só pelo lado da face (de trás ninguém a vê)
      if (e === 'parede' && (eu.x - sup.a[0]) * sup.normal[0] + (eu.z - sup.a[1]) * sup.normal[1] < 0.1) continue;
      const k = naLinha(sup, fx, fz);
      if (k.d < ALCANCE && (!melhor || k.d < melhor.d)) melhor = { sup, ...k };
    }
    const h = alturaDaFicha(m.ficha);
    if (!melhor) {
      m.sup = null;
      m.motivo = e === 'parede' ? 'chegue perto de uma parede' : e === 'emCima' ? 'chegue perto do muro' : 'chegue perto de uma viga ou do beiral';
      m.x = fx;
      m.z = fz;
      m.fantasma.position.set(fx, e === 'parede' ? (m.altura) : 0, fz);
      m.fantasma.rotation.y = m.giro;
      m.anel.position.set(fx, 0.02, fz);
      return;
    }
    const { sup, s, L } = melhor;
    const r = m.ficha.raio;
    m.sup = sup;
    m.x = melhor.px + sup.normal[0] * (e === 'parede' ? 0.012 : 0);
    m.z = melhor.pz + sup.normal[1] * (e === 'parede' ? 0.012 : 0);
    if (e === 'parede') {
      // a altura escolhida, presa à faixa da parede (o meio da peça)
      const min = sup.y0 - h.baixo;
      const max = (sup.y1 ?? sup.y0 + 2) - h.alto;
      m.altura = Math.max(min, Math.min(max, m.altura));
      m.y = Math.round(m.altura * 100) / 100;
      m.giro = Math.atan2(sup.normal[0], sup.normal[1]);
    } else {
      m.y = sup.y0;
    }
    m.fantasma.position.set(m.x, m.y, m.z);
    m.fantasma.rotation.y = m.giro;
    m.anel.position.set(m.x + sup.normal[0] * 0.6, 0.02, m.z + sup.normal[1] * 0.6);
    // o motivo: a ponta, um buraco (porta, janela), outro enfeite na mesma superfície
    m.motivo = null;
    if (e === 'parede' && h.alto - h.baixo > (sup.y1 ?? sup.y0 + 2) - sup.y0) m.motivo = `alto demais para ${sup.nome}`;
    if (!m.motivo && (s < r * 0.8 || s > L - r * 0.8)) m.motivo = `na ponta d${sup.nome.startsWith('a ') ? 'a' : 'o'} ${sup.nome.slice(2)}`;
    const yb = m.y + h.baixo;
    const ya = m.y + h.alto;
    for (const b of sup.buracos ?? []) {
      if (!m.motivo && s + r > b.s0 && s - r < b.s1 && ya > b.y0 && yb < b.y1) m.motivo = `na frente ${b.nome}`;
    }
    for (const p of this.postos.values()) {
      if (m.motivo || p.onde.sup !== sup.id) continue;
      const ps = naLinha(sup, p.onde.x, p.onde.z).s;
      const ph = alturaDaFicha(p.ficha);
      const pyb = (p.onde.y ?? 0) + ph.baixo;
      const pya = (p.onde.y ?? 0) + ph.alto;
      if (Math.abs(ps - s) < r + p.ficha.raio && ya > pyb && yb < pya) m.motivo = 'em cima de outro enfeite';
    }
  }

  /**
   * DE PONTA A PONTA: o fantasma mira o ponto de amarrar mais perto (o alto do
   * pilar, a viga, o beiral). O primeiro E marca a primeira ponta; daí a peça
   * aparece esticada até a segunda, e o segundo E põe. O X desfaz a primeira.
   */
  private mirarDePontaAPonta(m: Modo): void {
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    const fx = eu.x + Math.sin(f) * 1.4;
    const fz = eu.z + Math.cos(f) * 1.4;
    let melhor: THREE.Vector3 | null = null;
    let dist = ALCANCE + 0.6;
    for (const a of this.regras.amarras ?? []) {
      if (m.pontaA && Math.hypot(a.x - m.pontaA.x, a.z - m.pontaA.z) < 0.05) continue;
      const d = Math.hypot(a.x - fx, a.z - fz);
      if (d < dist) {
        dist = d;
        melhor = new THREE.Vector3(a.x, a.y, a.z);
      }
    }
    m.motivo = null;
    if (!melhor) m.motivo = m.pontaA ? 'chegue perto de outro ponto de amarrar' : 'chegue perto de um pilar, de uma viga ou do beiral';
    const mudou = !melhor || !m.pontaB || melhor.distanceTo(m.pontaB) > 0.01;
    m.pontaB = melhor;
    const marca = melhor ?? new THREE.Vector3(fx, 0, fz);
    m.anel.position.set(marca.x, 0.02, marca.z);
    if (!m.pontaA || !melhor) {
      m.fantasma.visible = false;
      return;
    }
    const L = m.pontaA.distanceTo(melhor);
    if (L < 1.2) m.motivo = 'as pontas estão juntas demais';
    else if (L > 9.5) m.motivo = 'as pontas estão longe demais';
    if (mudou && m.ficha.montaEntre) {
      // a peça é refeita entre as duas pontas (só quando a segunda muda)
      this.w.root.remove(m.fantasma);
      m.fantasma.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      m.fantasma = this.fantasmaDe(m.ficha.montaEntre(m.pontaA, melhor));
      this.w.root.add(m.fantasma);
    }
    m.fantasma.visible = true;
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

  /** `null` se cabe; senão, o porquê, em palavras de gente (o que vai no CHÃO) */
  porQueNao(x: number, z: number, raio: number, ficha?: FichaDeDecoracao): string | null {
    const daCena = this.regras.proibido(x, z, raio, ficha);
    if (daCena) return daCena;
    /*
     * O PISO É CHÃO: ele não briga com enfeite nem com outro piso (a mesinha
     * fica EM CIMA do deck, a hortênsia no canteiro), e só esbarra no que é
     * do mundo — a parede, a casa, o muro. Enfeite, por sua vez, não olha
     * para piso nenhum.
     */
    if (ficha?.piso) {
      const dosEnfeites = new Set([...this.postos.values()].map((p) => p.colisor));
      if (circuloEncosta(x, z, raio, this.w.colliders.filter((c) => !dosEnfeites.has(c)))) return 'encostado em outra coisa';
      return null;
    }
    for (const p of this.postos.values()) {
      if (!p.colisor) continue;
      if (Math.hypot(x - p.peca.position.x, z - p.peca.position.z) < raio + p.ficha.raio) return 'em cima de outro enfeite';
    }
    if (circuloEncosta(x, z, raio, this.w.colliders)) return 'encostado em outra coisa';
    const par = this.g.companionPosition();
    if (Math.hypot(x - par.x, z - par.z) < raio + 0.45) return `em cima de ${this.g.companionName()}`;
    return null;
  }

  // ------------------------------------------------- o enfeite no lugar

  /** Põe a peça no mundo. Devolve `false` se o lugar não existe mais (a superfície sumiu). */
  private por(uid: number, ficha: FichaDeDecoracao | undefined, onde: Onde): boolean {
    if (!ficha) return false;
    const e = encaixeDe(ficha);
    let peca: THREE.Object3D;
    let chao = { x: onde.x, z: onde.z };
    if (e === 'pontaAPonta') {
      if (!onde.ate || !ficha.montaEntre || onde.y === undefined) return false;
      const a = new THREE.Vector3(onde.x, onde.y, onde.z);
      const b = new THREE.Vector3(onde.ate.x, onde.ate.y, onde.ate.z);
      peca = this.w.add(fundir(ficha.montaEntre(a, b)));
      chao = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
    } else {
      // o enfeite parado vira poucas malhas, uma por material — a mesma imagem
      // com menos desenho; o que se mexe fica inteiro, porque a `anima` acha as
      // partes dele pelo `userData`
      const montada = this.w.place(ficha.monta(), onde.x, 0, onde.z, onde.giro);
      if (e !== 'chao') {
        const sup = (this.regras.superficies ?? []).find((k) => k.id === onde.sup);
        if (!sup || onde.y === undefined) return false;
        montada.position.y = onde.y;
        // (o "Mexer no…" fica no chão, do lado de quem põe)
        if (e !== 'pendurado') chao = { x: onde.x + sup.normal[0] * 0.7, z: onde.z + sup.normal[1] * 0.7 };
      }
      peca = this.w.add(ficha.anima ? montada : fundir(montada));
    }
    const colisor: Collider | null = ficha.piso || e !== 'chao' ? null : { kind: 'circle', x: onde.x, z: onde.z, r: ficha.raio * 0.75 };
    if (colisor && !this.semCorpo) this.w.colliders.push(colisor);
    // o piso posto por último pinta por cima dos outros (o chão é decalque: quem
    // decide é a ordem de pintura)
    if (ficha.piso) {
      const ordem = 10 + this.pisos++;
      peca.traverse((o) => {
        if (o.renderOrder >= 4) o.renderOrder = ordem;
      });
    }
    const de = ficha.artigo === 'a' ? 'na' : 'no';
    const ponto = this.w.interact({
      id: `decoracao:${uid}`,
      // prioridade NORMAL: ganha o prompt mais perto. E ele só existe no modo
      // de edição, onde os pontos da cena (o "Regar", a porta) descansam
      x: chao.x, z: chao.z, radius: (e === 'chao' ? ficha.raio : 0.3) + 0.75,
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
    this.postos.set(uid, { uid, ficha, peca, colisor, ponto, onde, chao });
    if (this.edicao) this.pintarAnel(uid);
    this.aoMudar?.();
    return true;
  }

  private tirar(uid: number): void {
    const p = this.postos.get(uid);
    if (!p) return;
    this.w.root.remove(p.peca);
    p.peca.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
    const i = p.colisor ? this.w.colliders.indexOf(p.colisor) : -1;
    if (i >= 0) this.w.colliders.splice(i, 1);
    const j = this.w.interactables.indexOf(p.ponto);
    if (j >= 0) this.w.interactables.splice(j, 1);
    this.apagarAnel(uid);
    this.postos.delete(uid);
    this.aoMudar?.();
  }

  private gravar(uid: number, onde: Onde | null): void {
    const posta: PostaNoSave | null = onde ? { ...onde, cena: this.cena } : null;
    this.g.salvarDecoracoes(this.g.decoracoes().map((d) => (d.uid === uid ? { ...d, posta } : d)));
  }
}
