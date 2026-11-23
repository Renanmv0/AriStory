import { ESPECIES_FIGURANTES, FICHAS } from './personagens';
import type { Visitante } from './conferencia';
import type { Carimbo, Retrato } from './tipos';

/** Registro separado dos fatos da história: só encontros realmente concluídos. */
export const CHAVE_DOS_ENCONTROS = 'portaria:encontros:v1';
const NOVOS = new Set(['hipolito', 'alpacina', 'alpacona', 'bento', 'beto', 'tata', 'preguica', ...ESPECIES_FIGURANTES]);
export type PapelDaLembranca = 'socio' | 'convidado' | 'entregador';
export interface EncontroDaPortaria {
  dia: number;
  ficha: string;
  nome: string;
  rosto: Retrato;
  papel: PapelDaLembranca;
  numero?: string;
  carimbo: Carimbo;
  entrega?: { empresa: string; destino: string; itens: string[] };
}
export interface ArmazemDosEncontros {
  retomada?(chave: string): unknown;
  guardarRetomada?(chave: string, dados: unknown): void;
}

export function identidadeDaPortaria(v: Pick<Visitante, 'ficha' | 'nome'>): string {
  const nome = (ESPECIES_FIGURANTES as readonly string[]).includes(v.ficha) ? v.nome : FICHAS[v.ficha]?.nome ?? v.nome;
  return `${v.ficha}:${nome}`;
}

export function lembrarAtendimento(dia: number, v: Visitante, carimbo: Carimbo): EncontroDaPortaria | null {
  if (!NOVOS.has(v.ficha)) return null; // os conhecidos do jogo e o arco do Jean-Luc já têm seu vínculo
  const c = v.docs.find(d => d.tipo === 'carteirinha'), ordem = v.docs.find(d => d.tipo === 'ordem');
  const cracha = v.docs.find(d => d.tipo === 'cracha');
  const nome = identidadeDaPortaria(v).slice(v.ficha.length + 1);
  return { dia, ficha: v.ficha, nome, rosto: { ...v.rosto }, carimbo,
    papel: ordem || cracha ? 'entregador' : c && !(v.ficha === 'beto' && dia < 6) ? 'socio' : 'convidado',
    ...(c ? { numero: c.numero } : {}),
    ...(ordem ? { entrega: { empresa: cracha?.empresa ?? ordem.empresa, destino: ordem.destino, itens: [...ordem.itens] } } : {}),
  };
}

/** Valida cópias de save antigo/incompleto e limita o registro às duas semanas. */
export function normalizarEncontros(bruto: unknown): EncontroDaPortaria[] {
  if (!Array.isArray(bruto)) return [];
  const texto = (x: unknown): x is string => typeof x === 'string' && x.length > 0 && x.length < 160;
  return bruto.slice(-288).filter((e): e is EncontroDaPortaria => {
    if (!e || typeof e !== 'object' || !Number.isInteger(e.dia) || e.dia < 1 || e.dia > 12 || !NOVOS.has(e.ficha) || !texto(e.nome)) return false;
    if (!['entra', 'soClube', 'hojeNao'].includes(e.carimbo) || !['socio', 'convidado', 'entregador'].includes(e.papel)) return false;
    if (!e.rosto || e.rosto.especie !== FICHAS[e.ficha]?.retrato.especie || !texto(e.rosto.cor)) return false;
    if (e.rosto.marca !== null && e.rosto.marca !== undefined && !texto(e.rosto.marca)) return false;
    if (e.numero !== undefined && (typeof e.numero !== 'string' || !/^\d{4}$/.test(e.numero))) return false;
    return !e.entrega || texto(e.entrega.empresa) && texto(e.entrega.destino) && Array.isArray(e.entrega.itens)
      && e.entrega.itens.length <= 12 && e.entrega.itens.every(texto);
  }).filter((_, i, todos) => todos.slice(0, i).filter(e => e.dia === todos[i].dia).length < 24)
    .map(e => ({ dia: e.dia, ficha: e.ficha, nome: e.nome, papel: e.papel, carimbo: e.carimbo,
      rosto: { especie: e.rosto.especie, cor: e.rosto.cor, marca: e.rosto.marca ?? null,
        ...(typeof e.rosto.cabelo === 'string' ? { cabelo: e.rosto.cabelo } : {}),
        ...(typeof e.rosto.enfeite === 'string' ? { enfeite: e.rosto.enfeite } : {}),
      }, ...(e.numero ? { numero: e.numero } : {}),
      ...(e.entrega ? { entrega: { empresa: e.entrega.empresa, destino: e.entrega.destino, itens: [...e.entrega.itens] } } : {}),
    }));
}

export function encontrosAntesDoDia(s: ArmazemDosEncontros, n: number): EncontroDaPortaria[] {
  return normalizarEncontros(s.retomada?.(CHAVE_DOS_ENCONTROS)).filter(e => e.dia < n);
}

export function guardarEncontrosDoDia(s: ArmazemDosEncontros, n: number, encontros: readonly EncontroDaPortaria[]): void {
  const outros = normalizarEncontros(s.retomada?.(CHAVE_DOS_ENCONTROS)).filter(e => e.dia !== n);
  s.guardarRetomada?.(CHAVE_DOS_ENCONTROS, normalizarEncontros([...outros, ...encontros.filter(e => e.dia === n)]));
}

/** A última visita real prevalece, inclusive quando a mesma pessoa foi atendida duas vezes. */
export function ultimosEncontros(encontros: readonly EncontroDaPortaria[], n: number): EncontroDaPortaria[] {
  const ultimos = new Map<string, EncontroDaPortaria>();
  for (const e of [...encontros].filter(e => e.dia < n).sort((a, b) => a.dia - b.dia)) ultimos.set(identidadeDaPortaria(e), e);
  return [...ultimos.values()];
}

export function recordarChegada(v: Visitante, encontros: readonly EncontroDaPortaria[], n: number): void {
  if (!NOVOS.has(v.ficha)) return;
  const anterior = encontros.find(e => identidadeDaPortaria(e) === identidadeDaPortaria(v));
  if (!anterior) return;
  const quando = anterior.dia === n - 1 ? 'ontem' : 'da última vez';
  const nota = anterior.carimbo === 'hojeNao' ? `Vocês não me deixaram entrar ${quando}.`
    : anterior.carimbo === 'soClube' ? `Só pude ficar no clube ${quando}, sem piscina.` : `Vocês me atenderam ${quando}.`;
  const jeito = FICHAS[v.ficha].jeito;
  const frase = jeito === 'enrolado' ? `Ah, meu filho, voltei! ${nota} A gente tenta de novo, né?`
    : jeito === 'vaidoso' ? `Amores, sou eu de novo! ${nota} O penteado muda, mas eu sou a mesma!`
    : jeito === 'certinho' ? `Bom dia novamente. ${nota} Trouxe os documentos para uma nova conferência. Nos conformes.`
    : jeito === 'desencanado' ? `E aí, voltei! ${nota} Vamos de novo. Relaxa.`
    : jeito === 'apressado' ? `EU DE NOVO! ${nota} Mas a entrega não espera! Rapidinho!`
    : jeito === 'dorminhoco' ? `Ah, meus bens… eu voltei… ${nota} Eu lembro de vocês…`
    : jeito === 'brincalhao' ? `Opa, voltei! ${nota} Outra rodada de documentos! Hahaha!`
    : jeito === 'teimoso' ? `Voltei. ${nota} Vamos conferir de novo. Pode perguntar.`
    : jeito === 'sonolento' ? `(boceja) Sou eu de novo… ${nota} Dessa vez eu tento ficar acordado…`
    : jeito === 'timido' ? `(baixinho) Oi… sou eu de novo. ${nota}`
    : `Olha eu aqui de novo. ${nota} Vamos ver como vai ser hoje. Hunf.`;
  v.chegada = [frase, ...(v.chegada ?? [])];
}
