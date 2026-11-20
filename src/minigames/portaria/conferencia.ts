/**
 * A CONFERÊNCIA — o certo e o errado de um visitante, tirados dos PAPÉIS.
 *
 * O roteiro (`semana.ts`) só monta quem chega e o que ele traz; daqui sai o
 * resto: as DIFERENÇAS de verdade (cada uma com o par de pistas que a revela
 * na lupa — §7 do plano), as RESPOSTAS de cada pergunta (§6), e o CARIMBO
 * certo. Assim o teste confere que o que o roteiro espera é o que os papéis
 * dizem, e que todo visitante errado pode ser pego com as ferramentas do dia.
 */
import { FICHAS, responder, type FichaDaPortaria } from './personagens';
import {
  DESTINOS_DO_CLUBE, NOME_DO_CLUBE, NOME_DO_ITEM, PROIBIDOS, antes, escrever, mesmaData,
  type Assunto, type Carimbo, type Carteirinha, type Convite, type ConviteColetivo, type Cracha, type Data,
  type Desfecho, type Documento, type ExameDaPiscina, type Fato, type ItemDaSacola, type LinhaDaLista,
  type OrdemDeEntrega, type Pista, type Retrato,
} from './tipos';

// ================================================================ o visitante

/** os fatos que cada decisão sobre um visitante grava na semana (§9) */
export interface FatosDoVisitante {
  /** passou pela cancela (🟢 ou 🟡) */
  entrou?: readonly Fato[];
  /** 🔴 */
  barrado?: readonly Fato[];
  /** o item proibido que passou na sacola */
  passou?: Partial<Record<ItemDaSacola, readonly Fato[]>>;
  /** aceitou o agrado */
  aceitou?: readonly Fato[];
  /** recusou o agrado */
  recusou?: readonly Fato[];
  /** a diferença dele foi apontada (a confissão, o bigode caindo) */
  apontado?: readonly Fato[];
}

/** um visitante na fila, com tudo o que ele traz */
export interface Visitante {
  /** único no dia */
  id: string;
  /** a ficha do personagem (`FICHAS`) */
  ficha: string;
  /** o nome que ele DIZ (o figurante sorteia; o mentiroso diz o do papel) */
  nome: string;
  /** o rosto DE VERDADE */
  rosto: Retrato;
  /** o rosto não dá para ver até apontar (o capacete do Capy) — some com o `seCorrige` */
  tapado?: string;
  /** quem mais está junto na janela (fichas) — a turma do convite coletivo */
  grupo?: readonly string[];
  /** quem está escondido no grupo (a Luna atrás da Tia Liz) — aparece com o `seCorrige` */
  escondido?: string;
  docs: readonly Documento[];
  sacola?: readonly ItemDaSacola[];
  /** vai à PISCINA (o exame vale; do contrário, só o clube) */
  querPiscina?: boolean;
  /** respostas que NÃO saem dos papéis: a mentira, o chute, o "eu e as três" */
  respostas?: Partial<Record<Assunto, string>>;
  /** o desfecho quando é pego (no lugar do da ficha) */
  desfecho?: Desfecho;
  /** a fala de quando é pego (no lugar da da ficha) */
  pego?: readonly string[];
  /** as falas de chegada DESTE dia (no lugar das da ficha, depois do bordão) */
  chegada?: readonly string[];
  /** a fala de quando entra / é barrado, DESTE dia */
  entra?: readonly string[];
  barrado?: readonly string[];
  /** um agrado oferecido pela fresta (a casquinha do Mano) */
  oferta?: { item: string; fala: readonly string[] };
  /** o carimbo que o ROTEIRO espera (o teste cobra que bate com a conferência) */
  espera: Carimbo;
  /** errar com ele é CARO (tira a terceira estrela): a Dona Preguiça, a carne do Mania */
  caro?: boolean;
  fatos?: FatosDoVisitante;
  /** chama alguém de reserva para a fila, conforme a decisão (o Noel de verdade, o Bento sem carteirinha) */
  chama?: ChamadoDaFila;
}

export interface ChamadoDaFila {
  seEntrar?: string;
  seBarrar?: string;
  /** quantos atendimentos depois ele aparece (0 = o próximo) */
  depois: number;
  /** quem SAI da fila no lugar dele (o Bento de sempre, quando vem o sem carteirinha) */
  tira?: string;
}

// =============================================================== o dia de hoje

/** as regras que podem valer num dia (cada dia acrescenta uma) */
export type Regra = 'validade' | 'foto' | 'lista' | 'convite' | 'entrega' | 'exame' | 'sacola' | 'coletivo';

/** as ferramentas da bancada (o dia 1 não tem a lista nem o 💬) */
export type Ferramenta = 'olhar' | 'apontar' | 'perguntar' | 'lista';

/** o que a conferência precisa saber do dia */
export interface ContextoDoDia {
  hoje: Data;
  regras: ReadonlySet<Regra>;
  ferramentas: ReadonlySet<Ferramenta>;
  lista: readonly LinhaDaLista[];
}

// =================================================================== a foto

/** a foto BATE com o rosto: espécie, cor e marca (o penteado e o enfeite não contam) */
export function fotoBate(foto: Retrato, rosto: Retrato): boolean {
  return foto.especie === rosto.especie && foto.cor === rosto.cor && foto.marca === rosto.marca;
}

// ============================================================== as respostas

const doc = <T extends Documento['tipo']>(v: Visitante, tipo: T): Extract<Documento, { tipo: T }> | undefined =>
  v.docs.find((d) => d.tipo === tipo) as Extract<Documento, { tipo: T }> | undefined;

export const fichaDe = (v: Visitante): FichaDaPortaria => FICHAS[v.ficha];

/** os ASSUNTOS do 💬 que fazem sentido com os papéis deste visitante */
export function assuntosDe(v: Visitante): Assunto[] {
  const a: Assunto[] = ['nome', 'motivo'];
  if (doc(v, 'carteirinha')) a.push('numero');
  if (doc(v, 'convite')) a.push('convidou');
  if (doc(v, 'ordem')) a.push('destino');
  if (doc(v, 'exame')) a.push('exame');
  if (v.sacola?.length) a.push('sacola');
  if (v.grupo?.length || v.escondido) a.push('quantos');
  return a;
}

/** o VALOR da resposta (o que vai para a transcrição e se compara com o papel) */
export function valorDaResposta(v: Visitante, assunto: Assunto): string {
  const dito = v.respostas?.[assunto];
  if (dito !== undefined) return dito;
  switch (assunto) {
    case 'nome': return v.nome;
    case 'numero': return doc(v, 'carteirinha')?.numero ?? '';
    case 'motivo': return fichaDe(v).motivo[0] ?? '';
    case 'convidou': return doc(v, 'convite')?.socio ?? '';
    case 'destino': return doc(v, 'ordem')?.destino ?? '';
    case 'exame': { const e = doc(v, 'exame'); return e ? escrever(e.validade) : ''; }
    case 'sacola': return (v.sacola ?? []).map((i) => NOME_DO_ITEM[i]).join(', ');
    case 'quantos': return String(1 + (v.grupo?.length ?? 0) + (v.escondido ? 1 : 0));
  }
}

/**
 * PERGUNTAR (§6): a fala (no jeito de quem responde — os balões) e o valor.
 * A segunda vez do mesmo assunto não muda a resposta: só irrita.
 */
export function perguntar(v: Visitante, assunto: Assunto, jaPerguntou: boolean): { falas: string[]; valor: string; repetida: boolean } {
  const ficha = fichaDe(v);
  const valor = valorDaResposta(v, assunto);
  if (jaPerguntou) return { falas: [ficha.irritado[0] ?? '…'], valor, repetida: true };
  return { falas: responder(ficha, assunto, valor), valor, repetida: false };
}

// ============================================================== as diferenças

/** o que pode estar errado (§8) */
export type Problema =
  | 'vencida' | 'fotoNaoBate' | 'rostoTapado' | 'outroClube' | 'foraDaLista' | 'numeroTrocado' | 'suspenso'
  | 'respostaNaoBate' | 'conviteDeOutroDia' | 'conviteDeSiMesmo' | 'socioDoConviteSuspenso' | 'socioDoConviteInexistente'
  | 'naoEstaNoConvite' | 'alguemEscondido' | 'empresaTrocada' | 'destinoInexistente' | 'semDocumento' | 'exameVencido';

/** uma diferença de verdade e o par de pistas que a revela */
export interface Diferenca {
  problema: Problema;
  pistas: readonly [Pista, Pista];
  /** só PARECE errado: apontada, se corrige (o capacete, a Luna) — o carimbo certo é o da verdade */
  aparente?: boolean;
}

/** as diferenças que NÃO barram: o exame vencido dá 🟡; as aparentes se corrigem */
const NAO_BARRA: ReadonlySet<Problema> = new Set(['exameVencido']);

function naLista(ctx: ContextoDoDia, numero: string): LinhaDaLista | undefined {
  return ctx.lista.find((l) => l.numero === numero);
}

/** os nomes de quem está na janela (o visitante e o grupo, e o escondido) */
function nomesNaJanela(v: Visitante): string[] {
  return [v.nome, ...(v.grupo ?? []).map((f) => FICHAS[f]?.nome ?? f), ...(v.escondido ? [FICHAS[v.escondido]?.nome ?? v.escondido] : [])];
}

/**
 * TODAS AS DIFERENÇAS de verdade deste visitante, com as regras de hoje. Uma
 * diferença só existe se a regra dela já vale (a lista, do dia 2; o convite,
 * do 3…). A carteirinha de OUTRO clube não é conferida campo a campo: o
 * problema é um só, e a lupa o acha pelo escudo ou pela lista.
 */
export function diferencas(v: Visitante, ctx: ContextoDoDia): Diferenca[] {
  const r = ctx.regras;
  const ds: Diferenca[] = [];
  const add = (problema: Problema, a: Pista, b: Pista, aparente = false): void => {
    ds.push({ problema, pistas: [a, b], ...(aparente ? { aparente } : {}) });
  };
  const respostaDiferente = (assunto: Assunto, papel: string | undefined): boolean =>
    v.respostas?.[assunto] !== undefined && papel !== undefined && v.respostas[assunto] !== papel;

  const c: Carteirinha | undefined = doc(v, 'carteirinha');
  const cv: Convite | undefined = doc(v, 'convite');
  const cc: ConviteColetivo | undefined = doc(v, 'conviteColetivo');
  const cr: Cracha | undefined = doc(v, 'cracha');
  const or: OrdemDeEntrega | undefined = doc(v, 'ordem');
  const ex: ExameDaPiscina | undefined = doc(v, 'exame');

  // ---- sem documento nenhum que deixe entrar
  if (!c && !cv && !cc && !cr) add('semDocumento', 'bancada', 'manual:documentos');

  // ---- a carteirinha
  if (c) {
    if (c.clube !== NOME_DO_CLUBE) {
      add('outroClube', 'doc:carteirinha:escudo', 'manual:escudo');
      if (r.has('lista')) add('outroClube', 'doc:carteirinha:numero', 'lista');
    } else {
      if (r.has('validade') && antes(c.validade, ctx.hoje)) add('vencida', 'doc:carteirinha:validade', 'calendario');
      if (r.has('foto')) {
        if (v.tapado) add('rostoTapado', 'doc:carteirinha:foto', 'rosto', true);
        else if (!fotoBate(c.foto, v.rosto)) add('fotoNaoBate', 'doc:carteirinha:foto', 'rosto');
      }
      if (r.has('lista')) {
        const linha = naLista(ctx, c.numero);
        const doNome = ctx.lista.find((l) => l.nome === c.nome);
        if (!linha && !doNome) add('foraDaLista', 'doc:carteirinha:numero', 'lista');
        else if (!linha || linha.nome !== c.nome) add('numeroTrocado', 'doc:carteirinha:numero', 'lista');
        else if (linha.suspenso) add('suspenso', 'doc:carteirinha:numero', 'lista');
      }
      if (respostaDiferente('numero', c.numero)) add('respostaNaoBate', 'transcricao:numero', 'doc:carteirinha:numero');
      if (respostaDiferente('nome', c.nome)) add('respostaNaoBate', 'transcricao:nome', 'doc:carteirinha:nome');
    }
  }

  // ---- o convite de um convidado
  if (cv && r.has('convite')) {
    if (!mesmaData(cv.data, ctx.hoje)) add('conviteDeOutroDia', 'doc:convite:data', 'calendario');
    if (cv.convidado === cv.socio) add('conviteDeSiMesmo', 'doc:convite:convidado', 'doc:convite:socio');
    const linha = naLista(ctx, cv.numeroDoSocio);
    if (!linha || linha.nome !== cv.socio) add('socioDoConviteInexistente', 'doc:convite:numeroDoSocio', 'lista');
    else if (linha.suspenso) add('socioDoConviteSuspenso', 'doc:convite:numeroDoSocio', 'lista');
    // o convidado é quem está na janela (ou alguém do grupo dele)
    const naJanela = nomesNaJanela(v);
    if (!naJanela.includes(cv.convidado)) add('respostaNaoBate', 'transcricao:nome', 'doc:convite:convidado');
    if (respostaDiferente('convidou', cv.socio)) add('respostaNaoBate', 'transcricao:convidou', 'doc:convite:socio');
  }

  // ---- o convite coletivo da turma (dia 6)
  if (cc && r.has('coletivo')) {
    if (!mesmaData(cc.data, ctx.hoje)) add('conviteDeOutroDia', 'doc:conviteColetivo:data', 'calendario');
    const linha = naLista(ctx, cc.numeroDoSocio);
    if (!linha || linha.nome !== cc.socio) add('socioDoConviteInexistente', 'doc:conviteColetivo:numeroDoSocio', 'lista');
    else if (linha.suspenso) add('socioDoConviteSuspenso', 'doc:conviteColetivo:numeroDoSocio', 'lista');
    const fora = nomesNaJanela(v).filter((n) => !cc.nomes.includes(n));
    if (fora.length) {
      add('naoEstaNoConvite', 'doc:conviteColetivo:nomes', 'rosto');
      add('naoEstaNoConvite', 'transcricao:nome', 'doc:conviteColetivo:nomes');
    }
    if (v.escondido) add('alguemEscondido', 'transcricao:quantos', 'rosto', true);
  }

  // ---- a entrega
  if (cr && r.has('entrega')) {
    if (!fotoBate(cr.foto, v.rosto)) add('fotoNaoBate', 'doc:cracha:foto', 'rosto');
    if (or && cr.empresa !== or.empresa) add('empresaTrocada', 'doc:cracha:empresa', 'doc:ordem:empresa');
    if (respostaDiferente('nome', cr.nome)) add('respostaNaoBate', 'transcricao:nome', 'doc:cracha:nome');
  }
  if (or && r.has('entrega')) {
    if (!DESTINOS_DO_CLUBE.includes(or.destino)) add('destinoInexistente', 'doc:ordem:destino', 'manual:destinos');
    if (respostaDiferente('destino', or.destino)) add('respostaNaoBate', 'transcricao:destino', 'doc:ordem:destino');
  }

  // ---- o exame da piscina (só barra a piscina)
  if (ex && r.has('exame') && v.querPiscina && antes(ex.validade, ctx.hoje)) {
    add('exameVencido', 'doc:exame:validade', 'calendario');
  }
  return ds;
}

/** os itens da sacola que não podem entrar hoje */
export function proibidosNaSacola(v: Visitante, ctx: ContextoDoDia): ItemDaSacola[] {
  if (!ctx.regras.has('sacola')) return [];
  return (v.sacola ?? []).filter((i) => PROIBIDOS[i] !== undefined);
}

/**
 * O CARIMBO CERTO, pela VERDADE (as aparentes já corrigidas): qualquer
 * diferença que barra → 🔴; só o exame vencido de quem quer a piscina → 🟡;
 * nada → 🟢. A sacola não muda o carimbo: o proibido vai para os achados.
 */
export function carimboCerto(v: Visitante, ctx: ContextoDoDia): Carimbo {
  const reais = diferencas(v, ctx).filter((d) => !d.aparente);
  if (reais.some((d) => !NAO_BARRA.has(d.problema))) return 'hojeNao';
  if (reais.some((d) => d.problema === 'exameVencido')) return 'soClube';
  return 'entra';
}

// ================================================================== apontar

/** a pista existe hoje? (a lista só com a prancheta; a transcrição só do que foi perguntado) */
export function pistaDisponivel(p: Pista, ctx: ContextoDoDia, perguntados: ReadonlySet<Assunto>): boolean {
  if (p === 'lista') return ctx.ferramentas.has('lista');
  if (p.startsWith('transcricao:')) return ctx.ferramentas.has('perguntar') && perguntados.has(p.slice('transcricao:'.length) as Assunto);
  return true;
}

export interface ResultadoDoApontar {
  diferenca: Diferenca | null;
  /** o que o visitante faz (o da diferença aparente é sempre `seCorrige`) */
  desfecho: Desfecho | null;
  /** a fala dele */
  falas: readonly string[];
}

/**
 * APONTAR (§7): as duas pistas, em qualquer ordem. Se elas formam uma
 * diferença de verdade (e as duas estão disponíveis), o visitante reage com o
 * desfecho dele; senão, "Hm… isso bate" e ele reage do jeito de quem foi
 * apontado à toa.
 */
export function apontar(v: Visitante, ctx: ContextoDoDia, a: Pista, b: Pista, perguntados: ReadonlySet<Assunto>): ResultadoDoApontar {
  const ficha = fichaDe(v);
  const d = (pistaDisponivel(a, ctx, perguntados) && pistaDisponivel(b, ctx, perguntados))
    ? diferencas(v, ctx).find((x) => (x.pistas[0] === a && x.pistas[1] === b) || (x.pistas[0] === b && x.pistas[1] === a)) ?? null
    : null;
  if (!d) return { diferenca: null, desfecho: null, falas: [ficha.aToa[0] ?? '…'] };
  if (d.aparente) {
    const quem = d.problema === 'alguemEscondido' && v.escondido ? FICHAS[v.escondido] : ficha;
    return { diferenca: d, desfecho: 'seCorrige', falas: v.pego ?? quem.pego };
  }
  return { diferenca: d, desfecho: v.desfecho ?? ficha.desfecho, falas: v.pego ?? ficha.pego };
}

/**
 * O QUE PODE PEGAR esta diferença com as ferramentas de hoje — o teste cobra
 * que todo visitante errado tenha pelo menos um caminho.
 */
export function ferramentasQuePegam(d: Diferenca, ctx: ContextoDoDia): Ferramenta[] {
  const fs: Ferramenta[] = [];
  const precisa = (p: Pista): Ferramenta | null =>
    p === 'lista' ? 'lista' : p.startsWith('transcricao:') ? 'perguntar' : null;
  const extras = d.pistas.map(precisa).filter((f): f is Ferramenta => f !== null);
  if (extras.every((f) => ctx.ferramentas.has(f)) && ctx.ferramentas.has('apontar')) fs.push('apontar', ...extras);
  // a bancada vazia, o calendário e o manual se veem sem a lupa
  if (d.problema === 'semDocumento' || d.problema === 'vencida' || d.problema === 'conviteDeOutroDia'
    || d.problema === 'exameVencido' || d.problema === 'destinoInexistente' || d.problema === 'outroClube') fs.push('olhar');
  return [...new Set(fs)];
}
