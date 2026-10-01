import type { Exercicio, Licao, Modulo, ProgressoDaApostila } from './tipos';
import { LICAO_1 } from './licoes/licao1';
import { LICAO_2 } from './licoes/licao2';
import { LICAO_3 } from './licoes/licao3';
import { LICAO_4 } from './licoes/licao4';
import { LICAO_5 } from './licoes/licao5';
import { LICAO_6 } from './licoes/licao6';
import { LICAO_7 } from './licoes/licao7';
import { LICAO_8 } from './licoes/licao8';
import { LICAO_9 } from './licoes/licao9';
import { LICAO_10 } from './licoes/licao10';
import { LICAO_11 } from './licoes/licao11';
import { LICAO_12 } from './licoes/licao12';

/**
 * ======================================= A APOSTILA DO GATITO — as regras
 *
 * Tudo aqui é LÓGICA PURA: nem DOM, nem three.js. É o que deixa o
 * `scripts/apostila.mjs` conferir as seis lições inteiras no Node, em um
 * segundo, antes de o livro abrir no navegador.
 *
 * - A NOTA: cada item de exercício vale um ponto, e só conta o que saiu certo
 *   DE PRIMEIRA. Terminar a lição já vale uma estrela; 65% de primeira, duas;
 *   90%, três. O save guarda a MELHOR vez (§6.3 do `docs/ESCOLA.md`).
 * - A TRAVA: uma lição só abre quando o Gatito a dá numa aula (`abertas`) E a
 *   anterior está concluída — "para passar para a próxima, ele precisa
 *   terminar a lição anterior" (pedido do Renan).
 * - O LIVRO: duas páginas de rosto (folha de rosto e sumário), as de cada
 *   lição, e duas de fim. Cada lição tem QUANTAS PÁGINAS O TEMA PEDIR (pedido
 *   do Renan): as de explicação, as de exercício e a de fechamento. Quando a
 *   conta dá ímpar, entra uma página de ANOTAÇÕES no fim da lição — assim toda
 *   lição começa na página da esquerda da dupla, no computador.
 */

export const MODULO_1: Modulo = {
  id: 'modulo-1',
  numero: 1,
  titulo: 'Português com o Gatito',
  subtitulo: 'Módulo 1 · Primeiros passos',
  seguinte: { nome: 'Módulo 2', pronto: true },
  parabens: 'Seis lições, dez tipos de exercício, e um professor muito orgulhoso.',
  licoes: [LICAO_1, LICAO_2, LICAO_3, LICAO_4, LICAO_5, LICAO_6],
};

/**
 * O MÓDULO 2 — "Indo mais longe" (pedido do Renan: seis lições novas, no
 * mesmo estilo, liberadas só depois do Módulo 1). É o A2 dos cursos para
 * hispanofalantes (Novo Avenida Brasil 2, Brasil Intercultural, Mano a
 * Mano): a rotina, o esporte, o corpo, a viagem planejada, a viagem contada e
 * as compras — cada tema com a pegadinha previsível de quem fala espanhol (o
 * "me levanto", o "jugar", o "tengo hambre", o "voy a viajar", o "he ido", o
 * "animales"). A numeração continua: lições 7 a 12.
 */
export const MODULO_2: Modulo = {
  id: 'modulo-2',
  numero: 2,
  titulo: 'Português com o Gatito',
  subtitulo: 'Módulo 2 · Indo mais longe',
  seguinte: { nome: 'Módulo 3', pronto: false },
  parabens: 'Doze lições no curso — da rotina ao cartão-postal — e um professor que já não cabe de orgulho.',
  licoes: [LICAO_7, LICAO_8, LICAO_9, LICAO_10, LICAO_11, LICAO_12],
};

/** O CURSO INTEIRO, na ordem: um módulo só abre depois do anterior terminado. */
export const MODULOS: readonly Modulo[] = [MODULO_1, MODULO_2];

/** o módulo de uma lição (pelo id), ou `null` */
export function moduloDaLicao(id: string): Modulo | null {
  return MODULOS.find((m) => m.licoes.some((l) => l.id === id)) ?? null;
}

/** quantas lições vêm antes deste módulo no curso (o Módulo 2 começa na 7) */
export function licoesAntesDe(m: Modulo): number {
  let n = 0;
  for (const x of MODULOS) {
    if (x.id === m.id) return n;
    n += x.licoes.length;
  }
  return 0;
}

/** todas as lições do módulo têm estrela */
export function moduloConcluido(m: Modulo, p: ProgressoDaApostila): boolean {
  return m.licoes.every((l) => concluida(p, l.id));
}

/**
 * A LIÇÃO DA PRÓXIMA AULA NO CURSO: a primeira sem estrela, módulo por
 * módulo — o Módulo 2 só tem aula da vez com o Módulo 1 inteiro. `null` é
 * o curso terminado.
 */
export function licaoDaVezNoCurso(p: ProgressoDaApostila): Licao | null {
  for (const m of MODULOS) {
    const l = licaoDaVez(m, p);
    if (l) return l;
  }
  return null;
}

/** quantas lições do curso inteiro já têm estrela */
export function licoesConcluidasNoCurso(p: ProgressoDaApostila): number {
  return MODULOS.reduce((soma, m) => soma + licoesConcluidas(m, p), 0);
}

/**
 * O MÓDULO DO LIVRO na carteira, fora da aula: o da última lição que o
 * Gatito deu (quem está no Módulo 2 estuda no livro do Módulo 2).
 */
export function moduloAtual(p: ProgressoDaApostila): Modulo {
  for (let i = MODULOS.length - 1; i >= 0; i--) {
    if (MODULOS[i].licoes.some((l) => p.abertas.includes(l.id))) return MODULOS[i];
  }
  return MODULOS[0];
}

// ------------------------------------------------------------------ a nota

/** quantos pontos um exercício vale: um por item */
export function itensDoExercicio(ex: Exercicio): number {
  switch (ex.tipo) {
    case 'conversa': return ex.turnos.length;
    case 'ligar': return ex.pares.length;
    case 'lacunas': return ex.respostas.length;
    default: return ex.itens.length;
  }
}

export function itensDaLicao(l: Licao): number {
  return l.exercicios.reduce((soma, ex) => soma + itensDoExercicio(ex), 0);
}

/** as estrelas de uma vez: terminar vale uma; 65% de primeira, duas; 90%, três */
export function estrelasPor(acertos: number, total: number): 1 | 2 | 3 {
  const r = total > 0 ? acertos / total : 1;
  if (r >= 0.9) return 3;
  if (r >= 0.65) return 2;
  return 1;
}

// ------------------------------------------------------ conferir o digitado

/**
 * O texto do jeito que a conferência compara: minúsculo, sem espaço sobrando,
 * sem pontuação nas pontas. `semAcento` tira também acento e cedilha.
 */
export function normalizar(s: string, semAcento = false): string {
  let t = s.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
  t = t.replace(/^[¡¿"'“”«»(]+/, '').replace(/[.!?,;:"'“”«»)…]+$/, '').trim();
  if (semAcento) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t;
}

/**
 * `certo`, `acento` (certo, faltou só o acento ou a cedilha — vale, com um
 * aviso: teclado de celular esconde o acento, e a lição não é de digitação)
 * ou `errado`.
 */
export type Conferencia = 'certo' | 'acento' | 'errado';

export function conferirDigitado(resposta: string, aceitas: readonly string[]): Conferencia {
  const r = normalizar(resposta);
  if (!r) return 'errado';
  if (aceitas.some((a) => normalizar(a) === r)) return 'certo';
  const semAcento = normalizar(resposta, true);
  if (aceitas.some((a) => normalizar(a, true) === semAcento)) return 'acento';
  return 'errado';
}

// ----------------------------------------------------------------- a trava

export function concluida(p: ProgressoDaApostila, id: string): boolean {
  return (p.estrelas[id] ?? 0) > 0;
}

/** a lição `i` pode ser lida: o Gatito já a deu numa aula e a anterior está concluída */
export function licaoLiberada(m: Modulo, p: ProgressoDaApostila, i: number): boolean {
  const l = m.licoes[i];
  if (!l || !p.abertas.includes(l.id)) return false;
  return i === 0 || concluida(p, m.licoes[i - 1].id);
}

/** a lição da próxima aula: a primeira ainda não concluída; `null` é o módulo terminado */
export function licaoDaVez(m: Modulo, p: ProgressoDaApostila): Licao | null {
  return m.licoes.find((l) => !concluida(p, l.id)) ?? null;
}

export type Irma = 'luna' | 'sol' | 'estrella';

/**
 * AS IRMÃS QUE ESTÃO NO GINÁSIO, pelo tanto de lições já concluídas (pedido
 * do Renan): antes da primeira aula, só a Luna; depois da primeira, a Luna e
 * a Sol (é a Sol quem chama a segunda); depois da segunda, as três. Na aula,
 * na Sala 1, estão sempre as três.
 */
export function irmasNoGinasio(concluidas: number): Irma[] {
  if (concluidas <= 0) return ['luna'];
  if (concluidas === 1) return ['luna', 'sol'];
  return ['luna', 'sol', 'estrella'];
}

export function licoesConcluidas(m: Modulo, p: ProgressoDaApostila): number {
  return m.licoes.filter((l) => concluida(p, l.id)).length;
}

export function estrelasDoModulo(m: Modulo, p: ProgressoDaApostila): number {
  return m.licoes.reduce((soma, l) => soma + (p.estrelas[l.id] ?? 0), 0);
}

// ----------------------------------------------------------------- o livro

export type PaginaDoLivro =
  | { tipo: 'rosto' }
  | { tipo: 'sumario' }
  | { tipo: 'explicacao'; licao: number; parte: number }
  /** uma página de exercícios: os de índice `de` até antes de `ate` */
  | { tipo: 'exercicios'; licao: number; parte: number; de: number; ate: number }
  | { tipo: 'fechamento'; licao: number }
  /** a página pautada que completa a dupla quando a lição dá ímpar */
  | { tipo: 'anotacoes'; licao: number }
  | { tipo: 'fim' }
  | { tipo: 'contracapa' };

/** páginas antes da primeira lição (a folha de rosto e o sumário) */
export const PAGINAS_DE_ROSTO = 2;

/**
 * AS PÁGINAS DE EXERCÍCIO de uma lição: os exercícios em ordem, e um que
 * tenha `novaPagina` começa a página seguinte. Sem nenhum, é uma página só.
 */
export function paginasDeExercicio(l: Licao): Array<{ de: number; ate: number }> {
  const cortes = [0];
  l.exercicios.forEach((ex, k) => {
    if (k > 0 && ex.novaPagina) cortes.push(k);
  });
  return cortes.map((de, i) => ({ de, ate: cortes[i + 1] ?? l.exercicios.length }));
}

/** as páginas de UMA lição, na ordem, já com a de anotações se a conta der ímpar */
export function paginasDaLicao(l: Licao, licao: number): PaginaDoLivro[] {
  const paginas: PaginaDoLivro[] = [
    ...l.explicacao.map((_, parte) => ({ tipo: 'explicacao' as const, licao, parte })),
    ...paginasDeExercicio(l).map((p, parte) => ({ tipo: 'exercicios' as const, licao, parte, ...p })),
    { tipo: 'fechamento', licao },
  ];
  if (paginas.length % 2) paginas.push({ tipo: 'anotacoes', licao });
  return paginas;
}

export function paginasDoModulo(m: Modulo): PaginaDoLivro[] {
  const paginas: PaginaDoLivro[] = [{ tipo: 'rosto' }, { tipo: 'sumario' }];
  m.licoes.forEach((l, licao) => paginas.push(...paginasDaLicao(l, licao)));
  paginas.push({ tipo: 'fim' }, { tipo: 'contracapa' });
  return paginas;
}

/** o índice (a partir de zero) da primeira página da lição `i`; o número impresso é esse + 1 */
export function primeiraPaginaDa(m: Modulo, i: number): number {
  let p = PAGINAS_DE_ROSTO;
  for (let k = 0; k < i && k < m.licoes.length; k++) p += paginasDaLicao(m.licoes[k], k).length;
  return p;
}

/** o índice da primeira página de exercícios da lição `i` */
export function paginaDosExercicios(m: Modulo, i: number): number {
  return primeiraPaginaDa(m, i) + m.licoes[i].explicacao.length;
}

// ------------------------------------------------------------- o embaralho

/**
 * Embaralha SEMPRE DO MESMO JEITO para a mesma `semente`: a lição não muda de
 * cara entre uma abertura e outra, e o teste sabe onde cada peça está. Com
 * mais de uma peça, nunca devolve a ordem original (montar a frase já
 * montada não é exercício).
 */
export function embaralhar<T>(lista: readonly T[], semente: string): T[] {
  let s = 2166136261;
  for (let i = 0; i < semente.length; i++) {
    s ^= semente.charCodeAt(i);
    s = Math.imul(s, 16777619) >>> 0;
  }
  const sorte = (): number => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(sorte() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  if (r.length > 1 && r.every((x, i) => x === lista[i])) r.push(r.shift()!);
  return r;
}

// ------------------------------------------------------------ a conferência

/**
 * OS PROBLEMAS de um módulo, para o teste: índice fora da lista, lacuna sem
 * resposta, distrator igual a uma resposta, grupo que ninguém usa, realce
 * sem fechar… Módulo bom devolve lista vazia.
 */
export function conferirModulo(m: Modulo, antes = licoesAntesDe(m)): string[] {
  const erros: string[] = [];
  const ids = new Set<string>();
  const realceAberto = (t: string): boolean => (t.match(/\*\*/g) ?? []).length % 2 !== 0;
  m.licoes.forEach((l, i) => {
    const onde = `lição ${l.numero} (${l.id})`;
    if (ids.has(l.id)) erros.push(`${onde}: id repetido`);
    ids.add(l.id);
    // a numeração continua de um módulo para o outro
    if (l.numero !== antes + i + 1) erros.push(`${onde}: número ${l.numero} na posição ${antes + i + 1} do curso`);
    if (!l.consigo.length) erros.push(`${onde}: sem "agora eu consigo"`);
    if (!l.aula.chamada.length || !l.aula.abertura.length || !l.aula.encerramento.length) {
      erros.push(`${onde}: falta fala da aula`);
    }
    // quem chama e quem fala na chamada tem que ESTAR no ginásio naquela hora
    const noGinasio: readonly string[] = irmasNoGinasio(antes + i);
    if (l.aula.chama === 'qualquer') {
      // sem dona, a dupla fala com quem quiser: as três têm de estar lá
      if (noGinasio.length < 3) erros.push(`${onde}: qualquer uma chama, mas as três ainda não estão no ginásio`);
    } else {
      if (!noGinasio.includes(l.aula.chama)) erros.push(`${onde}: a ${l.aula.chama} chama a aula, mas não está no ginásio`);
      if (l.aula.chamada[0]?.quem !== l.aula.chama) erros.push(`${onde}: a chamada tem de começar por quem chama (${l.aula.chama})`);
    }
    for (const f of l.aula.chamada) {
      if (!noGinasio.includes(f.quem)) erros.push(`${onde}: "${f.quem}" fala na chamada, mas não está no ginásio`);
    }
    if (!l.explicacao.length) erros.push(`${onde}: sem nenhuma página de explicação`);
    l.explicacao.forEach((pagina, k) => {
      if (!pagina.length) erros.push(`${onde}: a página ${k + 1} da explicação está vazia`);
      for (const b of pagina) {
        const textos = b.tipo === 'texto' || b.tipo === 'dica' || b.tipo === 'atencao' || b.tipo === 'brasil'
          ? [b.texto]
          : b.tipo === 'exemplos' ? b.itens : [];
        for (const t of textos) if (realceAberto(t)) erros.push(`${onde}: realce ** sem fechar em "${t.slice(0, 40)}…"`);
        if (b.tipo === 'tabela') {
          for (const linha of b.linhas) {
            if (linha.length !== b.colunas.length) erros.push(`${onde}: linha da tabela "${b.titulo ?? ''}" com ${linha.length} colunas`);
          }
        }
      }
    });
    const tipos = new Set(l.exercicios.map((e) => e.tipo));
    if (l.exercicios.length < 5) erros.push(`${onde}: só ${l.exercicios.length} exercícios`);
    if (tipos.size < 5) erros.push(`${onde}: só ${tipos.size} tipos de exercício (a lição tem que variar)`);
    l.exercicios.forEach((ex, k) => {
      const aqui = `${onde}, exercício ${k + 1} (${ex.tipo})`;
      if (itensDoExercicio(ex) === 0) erros.push(`${aqui}: sem itens`);
      const conferirEscolha = (opcoes: readonly string[], certa: number, qual: string): void => {
        if (opcoes.length < 2) erros.push(`${aqui}, ${qual}: menos de duas opções`);
        if (certa < 0 || certa >= opcoes.length) erros.push(`${aqui}, ${qual}: a certa (${certa}) não existe`);
        if (new Set(opcoes).size !== opcoes.length) erros.push(`${aqui}, ${qual}: opção repetida`);
      };
      switch (ex.tipo) {
        case 'escolha':
        case 'intruso':
          ex.itens.forEach((it, j) => conferirEscolha(it.opcoes, it.certa, `item ${j + 1}`));
          break;
        case 'conversa':
          ex.turnos.forEach((t, j) => conferirEscolha(t.opcoes, t.certa, `turno ${j + 1}`));
          break;
        case 'ligar': {
          if (ex.pares.length < 3) erros.push(`${aqui}: menos de três pares`);
          const esq = ex.pares.map((p) => p[0]);
          const dir = ex.pares.map((p) => p[1]);
          if (new Set(esq).size !== esq.length || new Set(dir).size !== dir.length) erros.push(`${aqui}: lado repetido`);
          break;
        }
        case 'lacunas': {
          const marcas = [...ex.texto.matchAll(/\{(\d+)\}/g)].map((x) => Number(x[1]));
          const esperadas = ex.respostas.map((_, j) => j);
          if (marcas.length !== ex.respostas.length || !esperadas.every((j) => marcas.includes(j))) {
            erros.push(`${aqui}: as lacunas do texto (${marcas.join(',')}) não batem com as ${ex.respostas.length} respostas`);
          }
          if (ex.porque.length !== ex.respostas.length) erros.push(`${aqui}: um porquê por lacuna`);
          for (const d of ex.distratores) if (ex.respostas.includes(d)) erros.push(`${aqui}: o distrator "${d}" também é resposta`);
          break;
        }
        case 'ordenar':
          ex.itens.forEach((it, j) => {
            if (it.pedacos.length < 3) erros.push(`${aqui}, item ${j + 1}: menos de três pedaços`);
          });
          break;
        case 'digitar':
          ex.itens.forEach((it, j) => {
            if (!it.aceitas.length || it.aceitas.some((a) => !normalizar(a))) erros.push(`${aqui}, item ${j + 1}: sem resposta aceita`);
          });
          break;
        case 'classificar': {
          if (ex.grupos.length < 2) erros.push(`${aqui}: menos de dois grupos`);
          ex.itens.forEach((it, j) => {
            if (it.grupo < 0 || it.grupo >= ex.grupos.length) erros.push(`${aqui}, item ${j + 1}: grupo ${it.grupo} não existe`);
          });
          ex.grupos.forEach((g, j) => {
            if (!ex.itens.some((it) => it.grupo === j)) erros.push(`${aqui}: ninguém vai no grupo "${g}"`);
          });
          break;
        }
        case 'erro':
          ex.itens.forEach((it, j) => {
            if (it.errada < 0 || it.errada >= it.palavras.length) erros.push(`${aqui}, item ${j + 1}: a palavra errada não existe`);
            if (!it.correcao.trim()) erros.push(`${aqui}, item ${j + 1}: sem correção`);
          });
          break;
        case 'vf':
          break;
      }
    });
  });
  return erros;
}
