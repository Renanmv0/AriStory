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
}

const KEY = 'aristory.save.v1';

const EMPTY: SaveData = { version: 1, scene: '', flags: {}, memories: [], stats: {} };

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

  reset(): void {
    this.data = structuredClone(EMPTY);
    this.persist();
  }
}
