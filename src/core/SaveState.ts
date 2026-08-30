import { SLOTS_ROUPA, type Coleta, type ItemDef, type Loadout, type SlotRoupa, type Vaga } from './types';
import { fichaDoItem } from '../world/itens';
import { fichaDaPeca } from '../world/roupas';

/** vagas da mochila (o que se carrega na mao) */
export const SLOTS_MAO = 5;
/** vagas de acessorio (o que se veste) */
export const SLOTS_VESTIVEL = 4;

/**
 * Um item pode morar nesta lista?
 *
 * A regra e ASSIMETRICA de proposito:
 * - a mochila de mao aceita qualquer coisa — e o que faz "desequipar e guardar
 *   pra usar depois" existir; um chapeu na mochila e um chapeu na mochila;
 * - a vaga de acessorio so aceita `vestivel`. Sorvete nao se veste.
 *
 * Tratar as duas listas com a mesma regra e o erro obvio aqui: ele conserta a
 * vestimenta e quebra o desequipar no mesmo movimento.
 */
function podeMorarEm(item: ItemDef, lista: 'mao' | 'vestivel'): boolean {
  return lista === 'mao' || item.tipo === 'vestivel';
}

/**
 * As 9 vagas, guardadas do jeito mais burro possivel: dois arrays de tamanho
 * FIXO em que `null` e vaga vazia.
 *
 * E de proposito que nao e uma lista que cresce. A vaga tem endereco — o slot
 * 2 e o slot 2 tanto na tela quanto no save — e e isso que faz o "slot
 * principal" ser um numero (`ativo`) em vez de uma copia do item, que sairia
 * do lugar sozinha na primeira vez que a lista fosse reordenada.
 */
export interface SaveInventario {
  /** 5 vagas; a de indice `ativo` e a que esta de fato na mao */
  mao: (ItemDef | null)[];
  /** 0..4 */
  ativo: number;
  /** 4 vagas de acessorio vestido */
  vestiveis: (ItemDef | null)[];
}

export interface SavedMemory {
  id: string;
  title: string;
  place: string;
  note: string;
  icon: string;
  at: number;
}

interface SaveData {
  version: number;
  scene: string;
  flags: Record<string, boolean>;
  memories: SavedMemory[];
  stats: Record<string, number>;
  /** uma mochila POR PESSOA, chaveada pelo id da ficha ('ari', 'renan') */
  inventarios: Record<string, SaveInventario>;
  // --- guarda-roupa
  /**
   * Ids das pecas desbloqueadas. GLOBAL de proposito: o que a dupla ganhou, os
   * dois podem vestir — o acervo e do casal, o loadout e de cada um.
   */
  acervo: string[];
  /** o que cada pessoa esta vestindo, chaveado pelo id da ficha */
  loadouts: Record<string, Loadout>;
}

function vagasVazias(quantas: number): (ItemDef | null)[] {
  return Array.from({ length: quantas }, () => null);
}

function inventarioVazio(): SaveInventario {
  return { mao: vagasVazias(SLOTS_MAO), ativo: 0, vestiveis: vagasVazias(SLOTS_VESTIVEL) };
}

/**
 * Devolve um inventario com o tamanho certo, venha o que vier do localStorage.
 *
 * Save antigo (de antes da mochila existir) nao tem o campo; save mexido a mao
 * pode ter array de tamanho errado. Nos dois casos o jogo tem que abrir, e nao
 * explodir num `.length` — entao aqui as vagas sao sempre recortadas para 5 e 4.
 */
function normalizarTodos(
  bruto: Record<string, Partial<SaveInventario>> | undefined,
): Record<string, SaveInventario> {
  const todos: Record<string, SaveInventario> = {};
  if (!bruto || typeof bruto !== 'object') return todos;
  for (const [quem, inv] of Object.entries(bruto)) todos[quem] = normalizar(inv);
  return todos;
}

function normalizar(bruto: Partial<SaveInventario> | undefined): SaveInventario {
  const vazio = inventarioVazio();
  if (!bruto) return vazio;
  const encaixar = (lista: unknown, quantas: number, qual: 'mao' | 'vestivel'): (ItemDef | null)[] => {
    const vagas = vagasVazias(quantas);
    if (!Array.isArray(lista)) return vagas;
    for (let i = 0; i < quantas; i++) {
      const item = lista[i] as ItemDef | null | undefined;
      if (!item || typeof item.id !== 'string') {
        vagas[i] = null;
        continue;
      }
      // A CATEGORIA VEM DO CATALOGO, nunca do que estava salvo. Save gravado
      // por uma versao que reescrevia o `tipo` ao mover de lista deixaria o
      // chapeu preso como item de mao para sempre.
      const ficha = fichaDoItem(item.id);
      const certo = ficha ? { ...item, ...ficha } : item;
      // e, pela mesma razao, sorvete carimbado de vestivel por aquela versao
      // antiga nao continua ocupando uma vaga de acessorio
      vagas[i] = podeMorarEm(certo, qual) ? certo : null;
    }
    return vagas;
  };
  const ativo = typeof bruto.ativo === 'number' ? Math.floor(bruto.ativo) : 0;
  return {
    mao: encaixar(bruto.mao, SLOTS_MAO, 'mao'),
    ativo: ativo >= 0 && ativo < SLOTS_MAO ? ativo : 0,
    vestiveis: encaixar(bruto.vestiveis, SLOTS_VESTIVEL, 'vestivel'),
  };
}

// --- guarda-roupa: normalizacao na leitura
//
// Mesma severidade do `normalizar` de inventario, e pelo mesmo motivo: o
// catalogo manda, o save so guarda id. Peca tirada do catalogo, id escrito a
// mao ou peca que mudou de slot somem sozinhos em vez de virar estado torto.

function normalizarAcervo(bruto: unknown): string[] {
  if (!Array.isArray(bruto)) return [];
  const vistos = new Set<string>();
  for (const id of bruto) {
    if (typeof id === 'string' && fichaDaPeca(id)) vistos.add(id);
  }
  return [...vistos];
}

function normalizarLoadouts(
  bruto: unknown,
  acervo: readonly string[],
): Record<string, Loadout> {
  const todos: Record<string, Loadout> = {};
  if (!bruto || typeof bruto !== 'object') return todos;
  for (const [quem, cru] of Object.entries(bruto as Record<string, unknown>)) {
    todos[quem] = normalizarLoadout(cru, acervo);
  }
  return todos;
}

function normalizarLoadout(bruto: unknown, acervo: readonly string[]): Loadout {
  const limpo: Loadout = {};
  if (!bruto || typeof bruto !== 'object') return limpo;
  const cru = bruto as Record<string, unknown>;
  for (const slot of SLOTS_ROUPA) {
    const id = cru[slot];
    if (typeof id !== 'string') continue;
    const ficha = fichaDaPeca(id);
    // tres condicoes, e as tres importam: a peca existe, ela e DAQUELE slot
    // (uma calca nao fica presa na cabeca se o catalogo mudar) e ela foi mesmo
    // desbloqueada
    if (!ficha || ficha.slot !== slot || !acervo.includes(id)) continue;
    limpo[slot] = id;
  }
  return limpo;
}

const KEY = 'aristory.save.v1';

const EMPTY: SaveData = {
  version: 1,
  scene: '',
  flags: {},
  memories: [],
  stats: {},
  inventarios: {},
  acervo: [],
  loadouts: {},
};

/** Progresso guardado no proprio navegador: flags, memorias e contadores. */
export class SaveState {
  private data: SaveData;

  constructor() {
    this.data = SaveState.read();
  }

  private static read(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(EMPTY);
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      // o acervo e lido ANTES dos loadouts: e ele que decide se uma peca
      // vestida ainda vale
      const acervo = normalizarAcervo(parsed.acervo);
      return {
        version: 1,
        scene: parsed.scene ?? '',
        flags: parsed.flags ?? {},
        memories: parsed.memories ?? [],
        stats: parsed.stats ?? {},
        inventarios: normalizarTodos(parsed.inventarios),
        acervo,
        loadouts: normalizarLoadouts(parsed.loadouts, acervo),
      };
    } catch {
      return structuredClone(EMPTY);
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* modo anonimo ou storage cheio: o jogo continua, so nao salva */
    }
  }

  get scene(): string {
    return this.data.scene;
  }

  set scene(id: string) {
    this.data.scene = id;
    this.persist();
  }

  flag(key: string): boolean {
    return this.data.flags[key] === true;
  }

  setFlag(key: string, value = true): void {
    this.data.flags[key] = value;
    this.persist();
  }

  bump(key: string, by = 1): number {
    this.data.stats[key] = (this.data.stats[key] ?? 0) + by;
    this.persist();
    return this.data.stats[key];
  }

  stat(key: string): number {
    return this.data.stats[key] ?? 0;
  }

  get memories(): readonly SavedMemory[] {
    return this.data.memories;
  }

  hasMemory(id: string): boolean {
    return this.data.memories.some((m) => m.id === id);
  }

  addMemory(m: Omit<SavedMemory, 'at'>): boolean {
    if (this.hasMemory(m.id)) return false;
    this.data.memories.push({ ...m, at: Date.now() });
    this.persist();
    return true;
  }

  // ------------------------------------------------------------- mochila
  //
  // Tudo aqui pede `quem`: o id da ficha do dono. Nao ha mochila "do jogador" —
  // ha a do Ari e a do Renan, e o T so muda qual delas a tela mostra. E o que
  // deixa o morango na mao do Renan mesmo quando quem anda e o Ari.

  /** A mochila de alguem, criada vazia na primeira vez que e pedida. */
  private de(quem: string): SaveInventario {
    let inv = this.data.inventarios[quem];
    if (!inv) {
      inv = inventarioVazio();
      this.data.inventarios[quem] = inv;
    }
    return inv;
  }

  maos(quem: string): ReadonlyArray<ItemDef | null> {
    return this.de(quem).mao;
  }

  vestiveis(quem: string): ReadonlyArray<ItemDef | null> {
    return this.de(quem).vestiveis;
  }

  slotAtivo(quem: string): number {
    return this.de(quem).ativo;
  }

  /** Fora de 0..4 e ignorado: a vaga principal sempre existe. */
  setSlotAtivo(quem: string, i: number): void {
    if (i < 0 || i >= SLOTS_MAO) return;
    this.de(quem).ativo = i;
    this.persist();
  }

  /** O item da vaga principal, que e o que esta de fato na mao. */
  itemAtivo(quem: string): ItemDef | null {
    const inv = this.de(quem);
    return inv.mao[inv.ativo] ?? null;
  }

  achouItem(quem: string, id: string): boolean {
    const inv = this.de(quem);
    return inv.mao.some((i) => i?.id === id) || inv.vestiveis.some((i) => i?.id === id);
  }

  /**
   * Coleta com auto-stash.
   *
   * A vaga principal tem prioridade; ocupada, a varredura comeca na VIZINHA
   * dela e da a volta — `(ativo + n) % 5`. Isso visita as outras quatro exatamente
   * uma vez, sem precisar pular a principal no meio do laco, e faz o item novo
   * cair ao lado do que ja esta na mao em vez de sempre no comeco da lista.
   *
   * Nada e escrito antes de haver vaga confirmada: nao existe caminho em que um
   * item entre por cima de outro.
   */
  pegar(quem: string, item: ItemDef): Coleta {
    if (this.achouItem(quem, item.id)) return 'repetido';
    // acessorio tenta vestir primeiro; com as 4 vagas cheias ele ainda cabe na
    // mochila de mao, que aceita qualquer coisa
    if (item.tipo === 'vestivel' && this.vestir(quem, item)) return 'guardado';
    const inv = this.de(quem);

    if (inv.mao[inv.ativo] === null) {
      inv.mao[inv.ativo] = item;
      this.persist();
      return 'mao';
    }

    for (let n = 1; n < SLOTS_MAO; n++) {
      const i = (inv.ativo + n) % SLOTS_MAO;
      if (inv.mao[i] === null) {
        inv.mao[i] = item;
        this.persist();
        return 'guardado';
      }
    }
    return 'cheio';
  }

  /** Veste numa vaga escolhida (ou na primeira livre). */
  /**
   * Veste um acessorio numa vaga escolhida (ou na primeira livre).
   *
   * Item de mao e RECUSADO, nao convertido. A versao antiga carimbava
   * `tipo: 'vestivel'` no que chegasse, e era por isso que dava para vestir
   * sorvete: o dado mentia sobre o proprio item para caber na vaga.
   */
  vestir(quem: string, item: ItemDef, slot?: number): boolean {
    if (!podeMorarEm(item, 'vestivel')) return false;
    if (this.achouItem(quem, item.id)) return false;
    const vagas = this.de(quem).vestiveis;
    const onde = slot ?? vagas.indexOf(null);
    if (onde < 0 || onde >= SLOTS_VESTIVEL || vagas[onde] !== null) return false;
    vagas[onde] = item;
    this.persist();
    return true;
  }

  despir(quem: string, slot: number): void {
    if (slot < 0 || slot >= SLOTS_VESTIVEL) return;
    this.de(quem).vestiveis[slot] = null;
    this.persist();
  }

  /**
   * Move um item de uma vaga para outra, dentro da mesma mochila.
   *
   * Destino ocupado TROCA os dois em vez de apagar — e a mesma regra do
   * auto-stash: nada se perde por acidente. Mas a troca so acontece se AS DUAS
   * pontas couberem: sorvete nao vira acessorio por ter caido numa vaga de
   * vestimenta.
   *
   * O `ativo` nao precisa de manutencao: ele e um indice, nao uma copia. Sair
   * da vaga principal esvazia a mao sozinho; entrar nela enche.
   */
  mover(quem: string, de: Vaga, para: Vaga): boolean {
    const inv = this.de(quem);
    const lista = (v: Vaga): (ItemDef | null)[] =>
      v.lista === 'mao' ? inv.mao : inv.vestiveis;
    const cabe = (v: Vaga): boolean =>
      v.indice >= 0 && v.indice < (v.lista === 'mao' ? SLOTS_MAO : SLOTS_VESTIVEL);

    if (!cabe(de) || !cabe(para)) return false;
    if (de.lista === para.lista && de.indice === para.indice) return false;

    const origem = lista(de);
    const destino = lista(para);
    const item = origem[de.indice];
    if (!item) return false; // arrastar vaga vazia nao faz nada

    // A TRAVA DE CATEGORIA. O item tem que caber na lista de destino pelo que
    // ELE e, e a troca so vale se o item deslocado tambem couber de volta.
    if (!podeMorarEm(item, para.lista)) return false;
    const trocado = destino[para.indice];
    if (trocado && !podeMorarEm(trocado, de.lista)) return false;

    destino[para.indice] = item;
    origem[de.indice] = trocado ?? null;
    this.persist();
    return true;
  }

  /** Tira o item de onde quer que ele esteja. */
  largar(quem: string, id: string): boolean {
    const inv = this.de(quem);
    let achou = false;
    for (const vagas of [inv.mao, inv.vestiveis]) {
      const i = vagas.findIndex((item) => item?.id === id);
      if (i >= 0) {
        vagas[i] = null;
        achou = true;
      }
    }
    if (achou) this.persist();
    return achou;
  }

  // ---------------------------------------------------------- guarda-roupa
  //
  // Eixo separado do de cima. Nada aqui toca em `inventarios`: o chapeu de
  // campeao e os patins continuam sendo vaga de acessorio, e uma peca de roupa
  // nunca ocupa vaga de mochila.

  /** O que a dupla ja desbloqueou. Vale para os dois. */
  get acervo(): readonly string[] {
    return this.data.acervo;
  }

  temPeca(id: string): boolean {
    return this.data.acervo.includes(id);
  }

  /** Poe uma peca no acervo. false se ela ja estava la ou nao existe. */
  desbloquear(id: string): boolean {
    if (!fichaDaPeca(id)) return false;
    if (this.data.acervo.includes(id)) return false;
    this.data.acervo.push(id);
    this.persist();
    return true;
  }

  /**
   * O que alguem esta vestindo. Devolve COPIA: quem chama nao consegue mexer
   * no save por baixo, e o `Game` compara a copia com a anterior para saber se
   * precisa reconstruir alguma coisa.
   */
  loadout(quem: string): Loadout {
    return { ...(this.data.loadouts[quem] ?? {}) };
  }

  /**
   * Veste uma peca. O slot NAO e escolhido por quem chama: ele vem da ficha,
   * que e a mesma razao de `mover()` recusar sorvete em vaga de acessorio —
   * o dado nao pode mentir sobre o proprio item para caber onde quer.
   */
  vestirPeca(quem: string, id: string): boolean {
    const ficha = fichaDaPeca(id);
    if (!ficha) return false;
    if (!this.temPeca(id)) return false;
    const atual = this.data.loadouts[quem] ?? {};
    atual[ficha.slot] = id;
    this.data.loadouts[quem] = atual;
    this.persist();
    return true;
  }

  tirarPeca(quem: string, slot: SlotRoupa): void {
    const atual = this.data.loadouts[quem];
    if (!atual || atual[slot] === undefined) return;
    delete atual[slot];
    this.persist();
  }

  reset(): void {
    this.data = structuredClone(EMPTY);
    this.persist();
  }
}
