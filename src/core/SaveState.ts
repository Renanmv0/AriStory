import { SLOTS_ROUPA, type Coleta, type ItemDef, type Loadout, type SlotRoupa, type Vaga } from './types';

import { fichaDoItem } from '../world/itens';

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
 * A vaga de vestimenta em que uma peca mora, pelo corpo.
 *
 * As 4 vagas SAO as 4 partes, na ordem de `SLOTS_ROUPA`. Nao ha escolha: um
 * gorro so pode ir para a vaga da cabeca. E isso que faz o painel conseguir
 * dizer "o que esta na cabeca" sem procurar, e que impede duas calcas.
 *
 * Devolve -1 para vestivel de catalogo antigo, sem `slot` declarado.
 */
function vagaDoCorpo(item: ItemDef): number {
  return item.slot ? SLOTS_ROUPA.indexOf(item.slot) : -1;
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
  loadoutsAntigos: Record<string, unknown> | undefined,
): Record<string, SaveInventario> {
  const todos: Record<string, SaveInventario> = {};
  const antigos = (loadoutsAntigos && typeof loadoutsAntigos === 'object') ? loadoutsAntigos : {};
  const quemTodos = new Set([...Object.keys(bruto ?? {}), ...Object.keys(antigos)]);
  for (const quem of quemTodos) {
    todos[quem] = normalizar((bruto ?? {})[quem], antigos[quem]);
  }
  return todos;
}

function normalizar(
  bruto: Partial<SaveInventario> | undefined,
  loadoutAntigo?: unknown,
): SaveInventario {
  const vazio = inventarioVazio();
  if (!bruto && !loadoutAntigo) return vazio;
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
  const ativo = typeof bruto?.ativo === 'number' ? Math.floor(bruto.ativo) : 0;
  const vestiveis = encaixar(bruto?.vestiveis, SLOTS_VESTIVEL, 'vestivel');

  // As vagas de vestimenta viraram TIPADAS: a 0 e a cabeca, a 1 o tronco... Um
  // save gravado antes disso tem o chapeu na vaga 0 por acaso e os patins na 1.
  // Recoloca cada um na vaga do seu corpo; quem nao tem `slot` no catalogo cai
  // fora, em vez de ficar ocupando a vaga de outra parte.
  const arrumado = vagasVazias(SLOTS_VESTIVEL);
  for (const item of vestiveis) {
    if (!item) continue;
    const vaga = vagaDoCorpo(item);
    if (vaga >= 0 && arrumado[vaga] === null) arrumado[vaga] = item;
  }

  // Migracao do guarda-roupa que morava fora do inventario: quem estava de
  // camisa listrada continua de camisa listrada, agora como item na vaga do
  // tronco. Roda uma vez; depois disso o inventario e a unica verdade.
  if (loadoutAntigo && typeof loadoutAntigo === 'object') {
    for (const [slot, id] of Object.entries(loadoutAntigo as Record<string, unknown>)) {
      if (typeof id !== 'string') continue;
      const ficha = fichaDoItem(id);
      if (!ficha || ficha.slot !== slot) continue;
      const vaga = SLOTS_ROUPA.indexOf(slot as SlotRoupa);
      if (vaga >= 0 && arrumado[vaga] === null) arrumado[vaga] = ficha;
    }
  }

  return {
    mao: encaixar(bruto?.mao, SLOTS_MAO, 'mao'),
    ativo: ativo >= 0 && ativo < SLOTS_MAO ? ativo : 0,
    vestiveis: arrumado,
  };
}

const KEY = 'aristory.save.v1';

const EMPTY: SaveData = {
  version: 1,
  scene: '',
  flags: {},
  memories: [],
  stats: {},
  inventarios: {},
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
      // `loadouts` era o guarda-roupa paralelo; hoje ele so serve de entrada
      // para a migracao, e some do save na primeira gravacao
      const antigos = (parsed as { loadouts?: Record<string, unknown> }).loadouts;
      return {
        version: 1,
        scene: parsed.scene ?? '',
        flags: parsed.flags ?? {},
        memories: parsed.memories ?? [],
        stats: parsed.stats ?? {},
        inventarios: normalizarTodos(parsed.inventarios, antigos),
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

  /**
   * O que a pessoa esta vestindo, lido das vagas.
   *
   * Nao ha estado separado: a vaga E o loadout. Foi assim que o guarda-roupa
   * deixou de ser um segundo armazenamento paralelo ao inventario.
   */
  loadout(quem: string): Loadout {
    const l: Loadout = {};
    this.de(quem).vestiveis.forEach((item, i) => {
      if (item) l[SLOTS_ROUPA[i]] = item.id;
    });
    return l;
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

  /**
   * Guarda na mochila SEM vestir.
   *
   * O `pegar` veste o acessorio na hora, e e o certo para um premio ou uma
   * compra — ninguem ganha patins para deixar na mochila. Mas o armario
   * ENTREGA: as pecas tem que chegar na mao para a pessoa escolher o que vestir,
   * senao abrir o armario ja veste tudo sozinho e nao sobra nada para olhar.
   */
  guardar(quem: string, item: ItemDef): Coleta {
    if (this.achouItem(quem, item.id)) return 'repetido';
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
  vestir(quem: string, item: ItemDef): boolean {
    if (!podeMorarEm(item, 'vestivel')) return false;
    if (this.achouItem(quem, item.id)) return false;
    // a vaga NAO e escolhida por quem chama: ela vem do corpo
    const onde = vagaDoCorpo(item);
    if (onde < 0) return false;
    const vagas = this.de(quem).vestiveis;
    if (vagas[onde] !== null) return false;
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
    // e, na vestimenta, tem que ser A vaga daquela parte do corpo: bota nao
    // entra na vaga da cabeca so porque o dedo soltou ali
    if (para.lista === 'vestivel' && vagaDoCorpo(item) !== para.indice) return false;
    const trocado = destino[para.indice];
    if (trocado && !podeMorarEm(trocado, de.lista)) return false;
    if (de.lista === 'vestivel' && trocado && vagaDoCorpo(trocado) !== de.indice) return false;

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

  reset(): void {
    this.data = structuredClone(EMPTY);
    this.persist();
  }
}
