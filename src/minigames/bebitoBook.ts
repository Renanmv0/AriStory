/**
 * ================================================= O BEBITO BOOK (as regras)
 *
 * O caderninho dos planos pro futuro (pedido do Renan, outubro de 2026): na
 * barraca da clareira, deitados um de frente para o outro, os dois abrem um
 * caderno de capa de pano e escrevem as respostas — uma pergunta no alto de
 * cada página, e as linhas pautadas embaixo. Cada um escreve com A SUA LETRA
 * e a sua tinta (a caneta troca de mão), como num caderno de verdade a dois.
 *
 * Este arquivo é LÓGICA PURA — as perguntas, as páginas, a regra de escrever
 * na linha e o que vai para o save —, e por isso o `scripts/bebitoBook.mjs`
 * confere tudo sem abrir o navegador. Quem desenha é `ui/bebitoBook.ts`.
 */

/** quem escreve: o id da ficha (`characters/cast.ts`) */
export type Escritor = 'ari' | 'renan';

/** uma linha da pauta: o texto e de quem é a letra (`null` = em branco) */
export interface LinhaDoBook {
  texto: string;
  quem: Escritor | null;
}

/** uma página escrita, do jeito que vai para o save */
export interface FolhaDoBook {
  linhas: LinhaDoBook[];
  /** a data do "Data __/__/__" do alto, escrita por quem começou a página */
  data?: string;
  quemData?: Escritor;
}

export interface BebitoBookNoSave {
  /** o dia em que o caderno foi aberto pela primeira vez (a folha de rosto) */
  comecadoEm: string | null;
  /** quem estava com a caneta nesse dia: é a letra dele na folha de rosto */
  quemComecou: Escritor | null;
  /** a fitinha de marcar página: o id da página onde os dois pararam */
  marcador: string | null;
  /** as páginas escritas, pelo id da PERGUNTA — mudar a ordem não perde nada */
  folhas: Record<string, FolhaDoBook>;
}

/** o rabisco de canto de página, desenhado a caneta (`ui/bebitoBook.ts`) */
export type Rabisco =
  | 'aviao' | 'casinha' | 'patinha' | 'xicara' | 'montanha' | 'estrela' | 'coracao'
  | 'balao' | 'sol' | 'flor' | 'notas' | 'coracoes' | 'lua' | 'barraca';

export interface Pergunta {
  id: string;
  texto: string;
  rabisco: Rabisco;
}

/**
 * AS PERGUNTAS, uma por página — todas sobre o FUTURO dos dois. São
 * PROVISÓRIAS (escritas pelo Claude): o Renan pode mandar as dele, e aí
 * entram literais. As respostas ficam presas ao `id`, então trocar o texto
 * de uma pergunta ou a ordem delas não apaga o que já foi escrito.
 */
export const PERGUNTAS: readonly Pergunta[] = [
  { id: 'viagem', texto: 'Pra onde vai ser a nossa próxima viagem?', rabisco: 'aviao' },
  { id: 'casa', texto: 'Como vai ser a nossa casa um dia?', rabisco: 'casinha' },
  { id: 'bichinho', texto: 'Que bichinho vai morar com a gente?', rabisco: 'patinha' },
  { id: 'prato', texto: 'Um prato que a gente vai aprender a fazer juntos', rabisco: 'xicara' },
  { id: 'mundo', texto: 'Um lugar do mundo que a gente ainda vai conhecer', rabisco: 'montanha' },
  { id: 'sonho', texto: 'Um sonho seu que eu quero te ajudar a realizar', rabisco: 'estrela' },
  { id: 'tradicao', texto: 'Uma tradição que vai ser só nossa', rabisco: 'coracao' },
  { id: 'aventura', texto: 'Uma aventura maluca que a gente ainda vai viver', rabisco: 'balao' },
  { id: 'dez-anos', texto: 'Como a gente vai estar daqui a dez anos?', rabisco: 'sol' },
  { id: 'velhinhos', texto: 'Quando a gente for velhinho, o que vai fazer todo dia?', rabisco: 'flor' },
  { id: 'aprender', texto: 'Uma coisa que a gente vai aprender junto', rabisco: 'notas' },
  { id: 'promessa', texto: 'Uma promessa pro nosso futuro', rabisco: 'coracoes' },
];

/** a última página: sem pergunta, para o que vier */
export const ESPACO_LIVRE: Pergunta = { id: 'livre', texto: 'Espaço livre', rabisco: 'lua' };

/** quantas linhas pautadas cada página tem (a MESMA no computador e no celular) */
export const LINHAS_POR_PAGINA = 13;
/** teto de letras de uma linha no save — a largura de verdade quem mede é a tela */
export const LETRAS_POR_LINHA = 140;

export type PaginaDoBook =
  /** o verso da capa e o da contracapa: o papel de guarda estampado */
  | { tipo: 'guarda'; id: 'guarda-frente' | 'guarda-tras' }
  /** a folha de rosto: de quem é o caderno, quando começou e as regras */
  | { tipo: 'rosto'; id: 'rosto' }
  | { tipo: 'pergunta'; id: string; numero: number; pergunta: Pergunta };

/**
 * O CADERNO INTEIRO, na ordem do papel: a guarda da frente (o verso da capa),
 * a folha de rosto, as perguntas, o espaço livre e a guarda de trás. São 16
 * faces — no computador, oito páginas duplas: a guarda e o rosto abrem o
 * caderno, e daí em diante duas perguntas lado a lado. No celular, uma por
 * vez, e as guardas ficam de fora (o verso da capa não é página de escrever).
 */
export function paginasDoBook(): PaginaDoBook[] {
  const lista: PaginaDoBook[] = [{ tipo: 'guarda', id: 'guarda-frente' }, { tipo: 'rosto', id: 'rosto' }];
  PERGUNTAS.forEach((p, i) => lista.push({ tipo: 'pergunta', id: p.id, numero: i + 1, pergunta: p }));
  lista.push({ tipo: 'pergunta', id: ESPACO_LIVRE.id, numero: PERGUNTAS.length + 1, pergunta: ESPACO_LIVRE });
  lista.push({ tipo: 'guarda', id: 'guarda-tras' });
  return lista;
}

export function linhasEmBranco(): LinhaDoBook[] {
  return Array.from({ length: LINHAS_POR_PAGINA }, () => ({ texto: '', quem: null }));
}

/** a data do alto da página, do jeito que se escreve à mão: 20/10/26 */
export function dataDeHoje(d = new Date()): string {
  const dois = (n: number) => String(n).padStart(2, '0');
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${dois(d.getFullYear() % 100)}`;
}

// =================================================== escrever numa linha

/** onde o cursor fica depois de escrever: a linha e a letra */
export interface Cursor {
  linha: number;
  pos: number;
}

/**
 * A PALAVRA QUE NÃO CABE DESCE PARA A LINHA DE BAIXO, como no papel.
 *
 * `texto` é o que a linha `i` passou a ter depois da tecla (e `pos`, onde o
 * cursor ficou nela). Se cabe, só ela muda. Se não cabe, a linha quebra no
 * último espaço que cabe (ou no meio da palavra, se uma palavra sozinha não
 * couber) e o resto desce:
 *
 * - para a linha de baixo, se ela está em branco ou é da MESMA pessoa (o
 *   resto entra na frente do que já estava lá, e ela é conferida de novo —
 *   um parágrafo inteiro anda junto);
 * - se a linha de baixo é da OUTRA pessoa, abre-se uma linha em branco antes
 *   dela, empurrando o resto da página para baixo — desde que a última linha
 *   da página esteja em branco;
 * - se não tem para onde descer, a página acabou: devolve `null`, e a tecla
 *   não entra.
 *
 * `cabe(texto, quem)` é quem mede: a tela sabe a largura da linha e o
 * tamanho da letra de cada um. O cursor acompanha a letra digitada — se ela
 * desceu, ele desce junto.
 *
 * Escrever numa linha que é da outra pessoa não vale (devolve `null`): cada
 * um com a sua letra.
 */
export function escreverNaLinha(
  linhas: readonly LinhaDoBook[],
  i: number,
  texto: string,
  pos: number,
  quem: Escritor,
  cabe: (texto: string, quem: Escritor) => boolean,
): { linhas: LinhaDoBook[]; cursor: Cursor } | null {
  const atual = linhas[i];
  if (!atual) return null;
  if (atual.texto && atual.quem && atual.quem !== quem) return null;
  const nova = linhas.map((l) => ({ ...l }));
  let cursor: Cursor = { linha: i, pos: Math.max(0, Math.min(pos, texto.length)) };
  let k = i;
  let resto = texto.slice(0, LETRAS_POR_LINHA * LINHAS_POR_PAGINA);
  for (;;) {
    if (cabe(resto, quem) && resto.length <= LETRAS_POR_LINHA) {
      nova[k] = { texto: resto, quem: resto ? quem : null };
      return { linhas: nova, cursor };
    }
    const corte = pontoDeCorte(resto, quem, cabe);
    const cabeca = resto.slice(0, corte).replace(/\s+$/, '');
    // o espaço do corte some: ele vira a quebra de linha
    const pulo = resto[corte] === ' ' ? 1 : 0;
    const cauda = resto.slice(corte + pulo);
    nova[k] = { texto: cabeca, quem: cabeca ? quem : null };
    // para onde vai o resto
    const abaixo = k + 1;
    if (abaixo >= nova.length) return null;
    const vizinha = nova[abaixo];
    let emenda = '';
    if (!vizinha.texto || vizinha.quem === quem) {
      emenda = vizinha.texto;
    } else {
      // a linha de baixo é do outro: abre espaço antes dela, se a página tiver
      if (nova[nova.length - 1].texto) return null;
      nova.splice(nova.length - 1, 1);
      nova.splice(abaixo, 0, { texto: '', quem: null });
    }
    // o cursor que estava no pedaço que desceu desce junto
    if (cursor.linha === k && cursor.pos > corte) {
      cursor = { linha: abaixo, pos: Math.max(0, cursor.pos - corte - pulo) };
    } else if (cursor.linha === k && cursor.pos > cabeca.length) {
      cursor = { linha: k, pos: cabeca.length };
    }
    resto = emenda ? `${cauda} ${emenda}` : cauda;
    k = abaixo;
  }
}

/** quantas letras do começo cabem: no último espaço, ou no meio da palavra */
function pontoDeCorte(texto: string, quem: Escritor, cabe: (t: string, q: Escritor) => boolean): number {
  // a maior ponta que cabe (busca binária: a medida é monotônica)
  let lo = 0;
  let hi = Math.min(texto.length, LETRAS_POR_LINHA);
  while (lo < hi) {
    const meio = Math.ceil((lo + hi) / 2);
    if (cabe(texto.slice(0, meio), quem)) lo = meio;
    else hi = meio - 1;
  }
  const max = Math.max(1, lo);
  // a palavra que estava sendo escrita desce inteira
  const espaco = texto.lastIndexOf(' ', max);
  return espaco > 0 ? espaco : max;
}

// =========================================================== o que salva

/** a folha que tem alguma coisa escrita */
export function folhaEscrita(f: FolhaDoBook | undefined): boolean {
  return !!f && f.linhas.some((l) => l.texto.trim() !== '');
}

/** quantas perguntas já têm resposta (o espaço livre não conta) */
export function perguntasRespondidas(save: BebitoBookNoSave): number {
  return PERGUNTAS.filter((p) => folhaEscrita(save.folhas[p.id])).length;
}

const ESCRITORES: readonly Escritor[] = ['ari', 'renan'];
const ehEscritor = (v: unknown): v is Escritor => ESCRITORES.includes(v as Escritor);

/** uma folha do save, conferida: sempre com as 13 linhas, cada uma com dono certo */
export function normalizarFolha(bruto: unknown): FolhaDoBook | null {
  const f = (bruto ?? {}) as Partial<FolhaDoBook>;
  if (!Array.isArray(f.linhas)) return null;
  const linhas = linhasEmBranco();
  f.linhas.slice(0, LINHAS_POR_PAGINA).forEach((l, i) => {
    const texto = typeof l?.texto === 'string' ? l.texto.replace(/[\r\n\t]+/g, ' ').slice(0, LETRAS_POR_LINHA) : '';
    linhas[i] = { texto, quem: texto && ehEscritor(l?.quem) ? l.quem : null };
    // texto sem dono não tem letra para ser desenhado: some
    if (!linhas[i].quem) linhas[i].texto = '';
  });
  const folha: FolhaDoBook = { linhas };
  if (typeof f.data === 'string' && /^\d{2}\/\d{2}\/\d{2}$/.test(f.data) && ehEscritor(f.quemData)) {
    folha.data = f.data;
    folha.quemData = f.quemData;
  }
  return folha;
}

/** Save antigo não tem caderno; o que não for texto, ou não tiver dono, some. */
export function normalizarBebitoBook(bruto: unknown): BebitoBookNoSave {
  const b = (bruto ?? {}) as Partial<BebitoBookNoSave>;
  const folhas: Record<string, FolhaDoBook> = {};
  if (b.folhas && typeof b.folhas === 'object' && !Array.isArray(b.folhas)) {
    for (const [id, f] of Object.entries(b.folhas)) {
      const folha = normalizarFolha(f);
      if (folha && (folhaEscrita(folha) || folha.data)) folhas[id] = folha;
    }
  }
  return {
    comecadoEm: typeof b.comecadoEm === 'string' && /^\d{2}\/\d{2}\/\d{2}$/.test(b.comecadoEm) ? b.comecadoEm : null,
    quemComecou: ehEscritor(b.quemComecou) ? b.quemComecou : null,
    marcador: typeof b.marcador === 'string' && b.marcador.length <= 40 ? b.marcador : null,
    folhas,
  };
}
