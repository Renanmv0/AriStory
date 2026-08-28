import type { ItemDef } from './types';

/** vagas da mochila (o que se carrega na mao) */
export const SLOTS_MAO = 5;
/** vagas de acessorio (o que se veste) */
export const SLOTS_VESTIVEL = 4;

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
  inventario: SaveInventario;
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
function normalizar(bruto: Partial<SaveInventario> | undefined): SaveInventario {
  const vazio = inventarioVazio();
  if (!bruto) return vazio;
  const encaixar = (lista: unknown, quantas: number): (ItemDef | null)[] => {
    const vagas = vagasVazias(quantas);
    if (!Array.isArray(lista)) return vagas;
    for (let i = 0; i < quantas; i++) {
      const item = lista[i] as ItemDef | null | undefined;
      vagas[i] = item && typeof item.id === 'string' ? item : null;
    }
    return vagas;
  };
  const ativo = typeof bruto.ativo === 'number' ? Math.floor(bruto.ativo) : 0;
  return {
    mao: encaixar(bruto.mao, SLOTS_MAO),
    ativo: ativo >= 0 && ativo < SLOTS_MAO ? ativo : 0,
    vestiveis: encaixar(bruto.vestiveis, SLOTS_VESTIVEL),
  };
}

const KEY = 'aristory.save.v1';

const EMPTY: SaveData = {
  version: 1,
  scene: '',
  flags: {},
  memories: [],
  stats: {},
  inventario: inventarioVazio(),
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
      return {
        version: 1,
        scene: parsed.scene ?? '',
        flags: parsed.flags ?? {},
        memories: parsed.memories ?? [],
        stats: parsed.stats ?? {},
        inventario: normalizar(parsed.inventario),
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

  get maos(): ReadonlyArray<ItemDef | null> {
    return this.data.inventario.mao;
  }

  get vestiveis(): ReadonlyArray<ItemDef | null> {
    return this.data.inventario.vestiveis;
  }

  get slotAtivo(): number {
    return this.data.inventario.ativo;
  }

  /** Fora de 0..4 e ignorado: a vaga principal sempre existe. */
  set slotAtivo(i: number) {
    if (i < 0 || i >= SLOTS_MAO) return;
    this.data.inventario.ativo = i;
    this.persist();
  }

  /** O item da vaga principal, que e o que esta de fato na mao. */
  get itemAtivo(): ItemDef | null {
    return this.data.inventario.mao[this.data.inventario.ativo] ?? null;
  }

  achouItem(id: string): boolean {
    const inv = this.data.inventario;
    return inv.mao.some((i) => i?.id === id) || inv.vestiveis.some((i) => i?.id === id);
  }

  /**
   * Guarda na primeira vaga livre da lista que o TIPO do item manda.
   * @returns false se ja tinha esse id ou se nao sobrou vaga
   */
  guardar(item: ItemDef): boolean {
    if (this.achouItem(item.id)) return false;
    const vagas = item.tipo === 'vestivel'
      ? this.data.inventario.vestiveis
      : this.data.inventario.mao;
    const livre = vagas.indexOf(null);
    if (livre < 0) return false;
    vagas[livre] = item;
    this.persist();
    return true;
  }

  /** Veste numa vaga escolhida (ou na primeira livre). */
  vestir(item: ItemDef, slot?: number): boolean {
    const vagas = this.data.inventario.vestiveis;
    if (slot === undefined) return this.guardar({ ...item, tipo: 'vestivel' });
    if (slot < 0 || slot >= SLOTS_VESTIVEL) return false;
    if (this.achouItem(item.id)) return false;
    vagas[slot] = { ...item, tipo: 'vestivel' };
    this.persist();
    return true;
  }

  despir(slot: number): void {
    if (slot < 0 || slot >= SLOTS_VESTIVEL) return;
    this.data.inventario.vestiveis[slot] = null;
    this.persist();
  }

  /** Tira o item de onde quer que ele esteja. */
  largar(id: string): boolean {
    const inv = this.data.inventario;
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

  reset(): void {
    this.data = structuredClone(EMPTY);
    this.persist();
  }
}
