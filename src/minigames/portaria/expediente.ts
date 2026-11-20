/**
 * O EXPEDIENTE — o dia na portaria andando, sem three.
 *
 * A cena só ANIMA (quem chega, os papéis deslizando, a cancela); quem sabe em
 * que ponto o dia está é esta classe: a fila (com os chamados), quem está na
 * janela, o que já foi perguntado e apontado, o que foi para os achados, o
 * relógio das 9h às 17h, e no fim o envelope (`fecharODia`). O teste sem
 * navegador joga um dia inteiro por aqui, e a cena joga o mesmo dia pela tela.
 */
import { apontar, assuntosDe, fichaDe, perguntar, proibidosNaSacola, type Diferenca, type Visitante } from './conferencia';
import { avaliarAtendimento, dicaDoParceiro, fecharODia, type Atendimento, type AvaliacaoDoAtendimento, type FimDoDia } from './consequencias';
import { chamarNaFila, montarDia, type DiaMontado } from './semana';
import { RELOGIO, type Assunto, type Carimbo, type Fato, type ItemDaSacola, type Pista } from './tipos';

/** uma linha da transcrição (a tirinha do caderninho) */
export interface LinhaDaTranscricao {
  assunto: Assunto;
  valor: string;
  falas: readonly string[];
}

/** o atendimento de quem está na janela, enquanto a dupla decide */
export interface NaJanela {
  visitante: Visitante;
  perguntas: Assunto[];
  transcricao: LinhaDaTranscricao[];
  apontados: Array<{ pistas: readonly [Pista, Pista]; diferenca: Diferenca | null }>;
  confiscados: ItemDaSacola[];
  aceitouOferta?: boolean;
  /** as diferenças aparentes que já se corrigiram (o capacete fora, a Luna à vista) */
  corrigidas: Set<string>;
}

/** quantas ajudas do parceiro por dia (§10) */
export const AJUDAS_POR_DIA = 3;
/** o tempo de confiscar um item (minutos do relógio) */
const MINUTOS_DE_CONFISCAR = 2;

export class Expediente {
  readonly montado: DiaMontado;
  fila: Visitante[];
  /** a posição de quem está (ou esteve por último) na janela; −1 antes do primeiro */
  indice = -1;
  janela: NaJanela | null = null;
  /** minutos desde as 9h */
  minutos = 0;
  readonly atendimentos: Atendimento[] = [];
  readonly avaliacoes: AvaliacaoDoAtendimento[] = [];
  ajudas = AJUDAS_POR_DIA;
  private fim: FimDoDia | null = null;

  constructor(readonly n: number, readonly semente: number, fatosDaSemana: ReadonlySet<Fato>) {
    this.montado = montarDia(n, semente, fatosDaSemana);
    this.fila = [...this.montado.fila];
  }

  get dia() { return this.montado.dia; }
  get contexto() { return this.montado.contexto; }

  // ------------------------------------------------------------ o relógio
  get semRelogio(): boolean { return this.dia.segundos === null; }

  /** o expediente acabou (17h): ninguém NOVO é chamado */
  get fechou(): boolean { return !this.semRelogio && this.minutos >= RELOGIO.fecha - RELOGIO.abre; }

  /** a hora no relógio ("10:40") */
  get hora(): string {
    if (this.semRelogio) return 'Sem limite';
    const t = Math.min(RELOGIO.fecha, RELOGIO.abre + Math.floor(this.minutos));
    return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  }

  /** o relógio anda com o tempo de verdade (a cena chama só durante os atendimentos) */
  passar(segundos: number): void {
    if (this.dia.segundos === null) return;
    this.gastarMinutos((segundos * (RELOGIO.fecha - RELOGIO.abre)) / this.dia.segundos);
  }

  private gastarMinutos(minutos: number): void {
    if (!this.semRelogio) this.minutos += minutos;
  }

  /** quantos ainda esperam na fila (sem contar quem está na janela) */
  get esperando(): number { return Math.max(0, this.fila.length - this.indice - 1); }

  // ------------------------------------------------------------ a fila
  /** chama o próximo da fila; `null` quando acabou a fila ou o expediente */
  proximo(): Visitante | null {
    if (this.janela) throw new Error('ainda tem gente na janela');
    if (this.fechou || this.indice + 1 >= this.fila.length) return null;
    this.indice += 1;
    const v = this.fila[this.indice];
    this.janela = { visitante: v, perguntas: [], transcricao: [], apontados: [], confiscados: [], corrigidas: new Set() };
    return v;
  }

  /** os assuntos que dá para perguntar a quem está na janela (vazio sem o 💬 do dia) */
  assuntos(): Assunto[] {
    if (!this.janela || !this.contexto.ferramentas.has('perguntar')) return [];
    return assuntosDe(this.janela.visitante);
  }

  // ------------------------------------------------------------ as ferramentas
  perguntar(assunto: Assunto): { falas: readonly string[]; valor: string; repetida: boolean } {
    const j = this.exigir();
    const ja = j.perguntas.includes(assunto);
    const r = perguntar(j.visitante, assunto, ja);
    j.perguntas.push(assunto);
    this.gastarMinutos(ja ? RELOGIO.perguntaRepetida : RELOGIO.pergunta);
    if (fichaDe(j.visitante).jeito === 'dorminhoco' && !ja) this.gastarMinutos(RELOGIO.cochilo);
    if (!ja) j.transcricao.push({ assunto, valor: r.valor, falas: r.falas });
    return r;
  }

  apontar(a: Pista, b: Pista): ReturnType<typeof apontar> {
    const j = this.exigir();
    const r = apontar(j.visitante, this.contexto, a, b, new Set(j.perguntas));
    j.apontados.push({ pistas: [a, b], diferenca: r.diferenca });
    this.gastarMinutos(r.diferenca ? RELOGIO.apontar : RELOGIO.apontarAToa);
    if (r.diferenca?.aparente) j.corrigidas.add(r.diferenca.problema);
    return r;
  }

  /** tira um item da sacola: o proibido vai para os achados (`true`); o permitido volta (`false`) */
  confiscar(item: ItemDaSacola): boolean {
    const j = this.exigir();
    this.gastarMinutos(MINUTOS_DE_CONFISCAR);
    if (!proibidosNaSacola(j.visitante, this.contexto).includes(item)) return false;
    if (!j.confiscados.includes(item)) j.confiscados.push(item);
    return true;
  }

  /** aceita ou recusa o agrado oferecido pela fresta */
  responderOferta(aceitou: boolean): void {
    this.exigir().aceitouOferta = aceitou;
  }

  /** a dica do parceiro (três por dia); `null` quando acabaram */
  ajuda(): string | null {
    const j = this.exigir();
    if (this.ajudas <= 0) return null;
    this.ajudas -= 1;
    return dicaDoParceiro(j.visitante, this.contexto);
  }

  // ------------------------------------------------------------ o carimbo
  /**
   * CARIMBA e devolve os papéis: avalia, guarda o atendimento, e põe na fila
   * quem a decisão chamar (o Noel de verdade, o Bento sem carteirinha).
   */
  carimbar(c: Carimbo): { avaliacao: AvaliacaoDoAtendimento; chamado: Visitante | null } {
    const j = this.exigir();
    const at: Atendimento = {
      visitante: j.visitante, carimbo: c, perguntas: [...j.perguntas], apontados: [...j.apontados],
      confiscados: [...j.confiscados], aceitouOferta: j.visitante.oferta ? j.aceitouOferta ?? false : undefined,
    };
    const avaliacao = avaliarAtendimento(at, this.contexto);
    this.atendimentos.push(at);
    this.avaliacoes.push(avaliacao);
    const jaNaFila = new Set(this.fila.map((v) => v.id));
    this.fila = chamarNaFila(this.fila, this.indice, c, this.montado.reservas);
    const chamado = this.fila.find((v) => !jaNaFila.has(v.id)) ?? null;
    this.janela = null;
    return { avaliacao, chamado };
  }

  // ------------------------------------------------------------ o fim
  /** fecha o dia: quem ficou na fila entra como não atendido */
  terminar(): FimDoDia {
    if (this.fim) return this.fim;
    if (this.janela) throw new Error('ainda tem gente na janela');
    const naoAtendidos: Atendimento[] = this.fila.slice(this.indice + 1)
      .map((v) => ({ visitante: v, carimbo: null, perguntas: [], apontados: [], confiscados: [] }));
    this.fim = fecharODia(this.dia, [...this.atendimentos, ...naoAtendidos], this.contexto);
    return this.fim;
  }

  private exigir(): NaJanela {
    if (!this.janela) throw new Error('ninguém na janela');
    return this.janela;
  }
}
