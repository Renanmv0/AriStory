import type { SomNome } from '../audio/efeitos';
import {
  concluida, conferirDigitado, embaralhar, estrelasDoModulo, estrelasPor, itensDaLicao,
  licaoLiberada, normalizar, paginasDoModulo, primeiraPaginaDa, type PaginaDoLivro,
} from '../minigames/aula/apostila';
import type {
  Bloco, Exercicio, Falante, Figura, ItemDeEscolha, Licao, Modulo, ProgressoDaApostila, ResultadoDaApostila,
} from '../minigames/aula/tipos';
import { escapar } from './telaDeCartas';

/**
 * ==================================================== A APOSTILA DO GATITO
 *
 * O LIVRO da aula de português (pedido do Renan: "como se fosse um livro onde
 * ele vai poder folhear as páginas"). Encadernado em ESPIRAL, como apostila de
 * curso: no computador, duas páginas abertas lado a lado; no celular, uma.
 *
 * - FOLHEAR: ◀ ▶, as setas do teclado, arrastar o dedo para o lado, ou o
 *   sumário. A folha vira em 3D em volta da espiral (`virar`).
 * - A TRAVA: a página de uma lição que o Gatito ainda não deu, ou cuja
 *   anterior não foi concluída, não abre — o livro avisa o porquê.
 * - OS EXERCÍCIOS respondem na hora e uma vez só: certo, um elogio; errado, a
 *   resposta certa e o porquê, com o retrato do Gatito. Terminou o último
 *   item, a lição conclui e o save guarda na hora (`aoConcluir`), sem esperar
 *   o livro fechar.
 * - Lição concluída de outra vez abre em GABARITO: as respostas certas
 *   preenchidas, e um "refazer" para tentar mais estrelas.
 *
 * O conteúdo inteiro vem de dados (`minigames/aula/`); este arquivo só
 * desenha e confere. Nenhuma imagem de arquivo: os retratos são os modelos 3D
 * fotografados na hora (quem passa é o `Game`), e o resto é CSS e emoji.
 */

export interface PedidoDaApostila {
  modulo: Modulo;
  progresso: ProgressoDaApostila;
  /** abre direto nesta lição (a aula); sem ela, onde o livro parou */
  licao?: string;
  /** os nomes de quem fala; o do Ari também assina a folha de rosto */
  nomes: Readonly<Record<Falante, string>>;
  /** o retrato de quem fala; sem ele, o livro usa emoji */
  retrato?: (quem: Falante) => string;
  /** salva na hora: a lição concluída e as estrelas desta vez */
  aoConcluir: (id: string, estrelas: number) => void;
}

/** a resposta de um item: saiu certa de primeira? e o que foi respondido */
interface Resposta {
  certo: boolean;
  valor: string;
  /** digitado sem acento: vale, com aviso */
  acento?: boolean;
}

interface EstadoDaLicao {
  respostas: Map<string, Resposta>;
  /** lição concluída antes, aberta de novo: o livro mostra as respostas certas */
  gabarito: boolean;
  /** as peças já postas na frase (ordenar), por item */
  montagem: Map<string, number[]>;
  /** o que já foi digitado e ainda não conferido */
  rascunho: Map<string, string>;
  /** o lado tocado primeiro no "ligar", por exercício */
  selecao: Map<number, { lado: 'e' | 'd'; i: number }>;
  /** a lacuna escolhida, por exercício */
  lacunaAtiva: Map<number, number>;
  /** as fichas do banco já gastas, por exercício */
  fichasUsadas: Map<number, Set<number>>;
  /** as estrelas que a lição acabou de ganhar nesta abertura (o carimbo anima) */
  agora: number | null;
}

const ICONE: Record<Falante, string> = {
  gatito: '🐱', luna: '🐰', sol: '🌞', estrella: '⭐', ari: '🙂', renan: '😄', walter: '🐶', josefina: '🐢',
};

const ELOGIOS = ['Isso!', 'Muito bem!', 'Perfeito!', 'Arrasou!', 'Acertou!', 'Miau, que beleza!', 'Mandou bem!', 'É isso aí!'];

const BILHETE: Record<number, string> = {
  3: 'Três estrelinhas! Você mandou muito bem, {aluno}. Estou orgulhoso.',
  2: 'Duas estrelinhas, {aluno}! Muito bem. Se quiser, refaça os exercícios: a apostila guarda a melhor nota.',
  1: 'Uma estrelinha, e muita coragem! Errar faz parte: é errando que a gente aprende. Quer tentar de novo?',
};

/** `**negrito**` e `*itálico*` — os dois únicos realces do texto das lições */
function realce(t: string): string {
  return escapar(t)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.+?)\*/g, '<i>$1</i>');
}

function estrelas(n: number, de = 3): string {
  return `<span class="estrelinhas" aria-label="${n} de ${de} estrelas">${'★'.repeat(n)}<i>${'★'.repeat(Math.max(0, de - n))}</i></span>`;
}

export class Apostila {
  private readonly raiz: HTMLDivElement;
  private readonly livro: HTMLDivElement;
  private readonly folhas: HTMLDivElement;
  private readonly esq: HTMLElement;
  private readonly dir: HTMLElement;
  private readonly onde: HTMLElement;
  private readonly antes: HTMLButtonElement;
  private readonly depois: HTMLButtonElement;
  private readonly aviso: HTMLDivElement;
  private pedido: PedidoDaApostila | null = null;
  private paginas: PaginaDoLivro[] = [];
  /** as estrelas de cada lição, atualizadas na hora (o save recebe pelo `aoConcluir`) */
  private estrelasDe: Record<string, number> = {};
  private readonly estados = new Map<string, EstadoDaLicao>();
  /** a página aberta (no computador, a da esquerda da dupla) */
  private pagina = 0;
  /** onde o livro parou, para abrir ali de novo */
  private ultima = 1;
  private duplo = true;
  private virando = false;
  private resultado: ResultadoDaApostila = { concluidas: [] };
  private resolver: ((r: ResultadoDaApostila) => void) | null = null;
  private avisoTimer = 0;
  private dedo: { x: number; y: number; t: number } | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="livro-apostila duplo">
        <div class="folhas">
          <section class="pagina esq"></section>
          <div class="espiral" aria-hidden="true"></div>
          <section class="pagina dir"></section>
        </div>
        <div class="aviso-trava" role="status"></div>
      </div>
      <nav class="navegacao">
        <button class="virar antes" aria-label="página anterior">◀</button>
        <button class="ir-sumario" aria-label="sumário">☰<span class="largo"> Sumário</span></button>
        <span class="onde"></span>
        <button class="virar depois" aria-label="próxima página">▶</button>
        <button class="fechar-apostila" aria-label="fechar a apostila"><span class="largo">fechar </span>✕</button>
      </nav>
    `;
    this.livro = raiz.querySelector('.livro-apostila')!;
    this.folhas = raiz.querySelector('.folhas')!;
    this.esq = raiz.querySelector('.pagina.esq')!;
    this.dir = raiz.querySelector('.pagina.dir')!;
    this.onde = raiz.querySelector('.onde')!;
    this.antes = raiz.querySelector('.virar.antes')!;
    this.depois = raiz.querySelector('.virar.depois')!;
    this.aviso = raiz.querySelector('.aviso-trava')!;

    raiz.querySelector('.fechar-apostila')!.addEventListener('click', () => this.fechar());
    this.antes.addEventListener('click', () => this.folhear(-1));
    this.depois.addEventListener('click', () => this.folhear(1));
    raiz.querySelector('.ir-sumario')!.addEventListener('click', () => this.irPara(1));
    this.folhas.addEventListener('click', (e) => this.aoClicar(e));
    this.folhas.addEventListener('input', (e) => {
      const campo = e.target as HTMLInputElement;
      const chave = campo.dataset.dig;
      const l = this.licaoDoCampo(campo);
      if (chave && l) this.estado(l).rascunho.set(chave, campo.value);
    });
    this.folhas.addEventListener('keydown', (e) => {
      const campo = e.target as HTMLInputElement;
      if (e.key === 'Enter' && campo.dataset.dig) {
        e.preventDefault();
        this.conferirCampo(campo);
      }
    });
    // arrastar para o lado vira a página (no celular é o gesto natural)
    this.folhas.addEventListener('pointerdown', (e) => {
      this.dedo = { x: e.clientX, y: e.clientY, t: performance.now() };
    });
    this.folhas.addEventListener('pointerup', (e) => {
      const d = this.dedo;
      this.dedo = null;
      if (!d || (e.target as HTMLElement).closest('input')) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6 && performance.now() - d.t < 700) {
        this.folhear(dx < 0 ? 1 : -1);
      }
    });
    window.addEventListener('keydown', (e) => {
      if (!this.aberto || (e.target as HTMLElement)?.closest?.('input, textarea')) return;
      if (e.key === 'ArrowRight') this.folhear(1);
      if (e.key === 'ArrowLeft') this.folhear(-1);
    });
    window.addEventListener('resize', () => {
      if (!this.aberto) return;
      const antes = this.duplo;
      this.medirTela();
      if (antes === this.duplo) return;
      // de uma página para duas, a dupla tem que começar numa página par
      this.pagina = this.alinhar(this.pagina);
      this.pintarTudo();
    });
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  /** Abre o livro e resolve quando ele fecha, com as lições concluídas nesta vez. */
  abrir(pedido: PedidoDaApostila): Promise<ResultadoDaApostila> {
    return new Promise((resolve) => {
      this.pedido = pedido;
      this.paginas = paginasDoModulo(pedido.modulo);
      this.estrelasDe = { ...pedido.progresso.estrelas };
      this.resultado = { concluidas: [] };
      this.medirTela();
      const i = pedido.licao ? pedido.modulo.licoes.findIndex((l) => l.id === pedido.licao) : -1;
      let alvo = i >= 0 ? primeiraPaginaDa(i) : this.ultima;
      if (!this.acessivel(alvo)) alvo = 1;
      this.pagina = this.alinhar(alvo);
      this.pintarTudo();
      this.livro.classList.remove('abrindo');
      void this.livro.offsetWidth;
      this.livro.classList.add('abrindo');
      this.raiz.classList.add('show');
      this.som?.('diario');
      this.resolver = resolve;
    });
  }

  fechar(): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.ultima = this.pagina;
    this.som?.('menu');
    const r = this.resolver;
    this.resolver = null;
    r?.(this.resultado);
  }

  // =============================================================== folhear

  private medirTela(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.duplo = w >= 900 && w > h * 1.15;
    this.livro.classList.toggle('duplo', this.duplo);
    this.livro.classList.toggle('simples', !this.duplo);
  }

  /** no computador a dupla começa sempre numa página par (a da esquerda) */
  private alinhar(p: number): number {
    return this.duplo ? p - (p % 2) : p;
  }

  private progresso(): ProgressoDaApostila {
    return { estrelas: this.estrelasDe, abertas: this.pedido?.progresso.abertas ?? [] };
  }

  private acessivel(p: number): boolean {
    const pg = this.paginas[p];
    if (!pg || !this.pedido) return false;
    const m = this.pedido.modulo;
    if (pg.tipo === 'rosto' || pg.tipo === 'sumario') return true;
    if (pg.tipo === 'fim' || pg.tipo === 'contracapa') {
      return m.licoes.every((l) => concluida(this.progresso(), l.id));
    }
    return licaoLiberada(m, this.progresso(), pg.licao);
  }

  /** por que a página `p` está trancada, na voz do livro */
  private porQueTrancada(p: number): string {
    const pg = this.paginas[p];
    const m = this.pedido!.modulo;
    if (!pg || pg.tipo === 'fim' || pg.tipo === 'contracapa') {
      return `🔒 Termine as ${m.licoes.length} lições para ver o fim do módulo.`;
    }
    if (pg.tipo === 'rosto' || pg.tipo === 'sumario') return '';
    const i = pg.licao;
    if (i > 0 && !concluida(this.progresso(), m.licoes[i - 1].id)) {
      return `🔒 Termine a lição ${i} para virar a página.`;
    }
    return `🔔 A lição ${i + 1} abre na próxima aula do Gatito.`;
  }

  private folhear(sentido: 1 | -1): void {
    if (!this.aberto || this.virando) return;
    const passo = this.duplo ? 2 : 1;
    const alvo = this.pagina + sentido * passo;
    if (alvo < 0 || alvo >= this.paginas.length) return;
    if (sentido > 0 && !this.acessivel(alvo)) {
      this.avisar(this.porQueTrancada(alvo));
      return;
    }
    this.virar(alvo);
  }

  /** vai direto a uma página (o sumário, o "próxima lição"), virando a folha */
  private irPara(p: number): void {
    const alvo = this.alinhar(p);
    if (!this.aberto || this.virando || alvo === this.pagina) return;
    if (!this.acessivel(p)) {
      this.avisar(this.porQueTrancada(p));
      return;
    }
    this.virar(alvo);
  }

  private avisar(texto: string): void {
    if (!texto) return;
    this.aviso.textContent = texto;
    this.aviso.classList.add('show');
    this.som?.('errou');
    window.clearTimeout(this.avisoTimer);
    this.avisoTimer = window.setTimeout(() => this.aviso.classList.remove('show'), 2400);
  }

  /**
   * A FOLHA VIRA EM 3D em volta da espiral. Por baixo dela, a página nova já
   * está pintada; a folha leva, na frente, a cópia da página que sai e, no
   * verso, a página que chega do outro lado. Acabou o giro, a cópia some e a
   * página de verdade toma o lugar — os exercícios nunca vivem na cópia.
   */
  private virar(alvo: number): void {
    const de = this.pagina;
    const frente = alvo > de;
    this.pagina = alvo;
    this.som?.('folhear');
    const semAnimacao = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (semAnimacao) {
      this.pintarTudo();
      return;
    }
    this.virando = true;
    const folha = document.createElement('div');
    folha.className = `folha-virando ${frente ? 'pra-frente' : 'pra-tras'}`;
    const faceA = document.createElement('div');
    faceA.className = 'face frente';
    const faceB = document.createElement('div');
    faceB.className = 'face verso';
    folha.append(faceA, faceB);

    const copiar = (el: HTMLElement): HTMLElement => {
      const c = el.cloneNode(true) as HTMLElement;
      c.classList.add('copia');
      c.removeAttribute('data-pagina');
      return c;
    };
    const rolagem = (el: HTMLElement): number => el.querySelector<HTMLElement>('.miolo')?.scrollTop ?? 0;
    const repor = (copia: HTMLElement, y: number): void => {
      const m = copia.querySelector<HTMLElement>('.miolo');
      if (m) m.scrollTop = y;
    };

    let apos: () => void;
    if (this.duplo) {
      if (frente) {
        // a folha é a página da DIREITA indo para a esquerda
        const y = rolagem(this.dir);
        const saindo = copiar(this.dir);
        faceA.appendChild(saindo);
        faceB.appendChild(this.montarPagina(alvo, 'esq', true));
        this.pintarNo(this.dir, alvo + 1, 'dir');
        this.folhas.appendChild(folha);
        repor(saindo, y);
        apos = () => this.pintarNo(this.esq, alvo, 'esq');
      } else {
        const y = rolagem(this.esq);
        const saindo = copiar(this.esq);
        faceA.appendChild(saindo);
        faceB.appendChild(this.montarPagina(alvo + 1, 'dir', true));
        this.pintarNo(this.esq, alvo, 'esq');
        this.folhas.appendChild(folha);
        repor(saindo, y);
        apos = () => this.pintarNo(this.dir, alvo + 1, 'dir');
      }
    } else if (frente) {
      // uma página só: a folha de cima vira e mostra a de baixo
      const y = rolagem(this.esq);
      const saindo = copiar(this.esq);
      faceA.appendChild(saindo);
      faceB.appendChild(this.montarPagina(alvo, 'esq', true));
      this.pintarNo(this.esq, alvo, 'esq');
      this.folhas.appendChild(folha);
      repor(saindo, y);
      apos = () => undefined;
    } else {
      // voltando, a página anterior vem de trás da espiral e cobre a atual
      folha.classList.add('volta');
      faceA.appendChild(this.montarPagina(alvo, 'esq', true));
      this.folhas.appendChild(folha);
      apos = () => this.pintarNo(this.esq, alvo, 'esq');
    }
    this.pintarNavegacao();

    let feito = false;
    const terminar = (): void => {
      if (feito) return;
      feito = true;
      apos();
      folha.remove();
      this.virando = false;
      this.pintarNavegacao();
    };
    requestAnimationFrame(() => requestAnimationFrame(() => folha.classList.add('vai')));
    folha.addEventListener('transitionend', terminar, { once: true });
    // se a transição não disparar (aba escondida), não deixa o livro travado
    window.setTimeout(terminar, 900);
  }

  // ================================================================ pintar

  private pintarTudo(): void {
    this.pintarNo(this.esq, this.pagina, 'esq');
    if (this.duplo) this.pintarNo(this.dir, this.pagina + 1, 'dir');
    else this.dir.innerHTML = '';
    this.pintarNavegacao();
  }

  private pintarNavegacao(): void {
    const n = this.paginas.length;
    const passo = this.duplo ? 2 : 1;
    this.antes.disabled = this.pagina <= 0;
    const proxima = this.pagina + passo;
    this.depois.disabled = proxima >= n;
    this.depois.classList.toggle('trancado', proxima < n && !this.acessivel(proxima));
    this.onde.textContent = this.duplo
      ? `p. ${this.pagina + 1}–${Math.min(n, this.pagina + 2)} de ${n}`
      : `p. ${this.pagina + 1} de ${n}`;
  }

  /** troca o conteúdo de um lado do livro pela página `p` */
  private pintarNo(el: HTMLElement, p: number, lado: 'esq' | 'dir'): void {
    const nova = this.montarPagina(p, lado, false);
    el.className = nova.className;
    el.innerHTML = nova.innerHTML;
    if (nova.dataset.pagina) el.dataset.pagina = nova.dataset.pagina;
    else delete el.dataset.pagina;
    el.dataset.licao = nova.dataset.licao ?? '';
  }

  private montarPagina(p: number, lado: 'esq' | 'dir', copia: boolean): HTMLElement {
    const el = document.createElement('section');
    el.className = `pagina ${lado}`;
    const pg = this.paginas[p];
    if (!pg || !this.pedido) {
      el.classList.add('em-branco');
      return el;
    }
    if (!copia) el.dataset.pagina = String(p);
    const m = this.pedido.modulo;
    const pe = `<footer class="pe"><span>${escapar(m.titulo)}</span><b>${p + 1}</b></footer>`;
    if (pg.tipo === 'rosto') {
      // `folha-de-rosto`, e não `rosto`: `.rosto` é o retrato redondo de quem fala
      el.classList.add('folha-de-rosto');
      el.innerHTML = `<div class="miolo">${this.folhaDeRosto()}</div>${pe}`;
      return el;
    }
    if (pg.tipo === 'sumario') {
      el.innerHTML = `<header class="topo"><span class="secao">☰ Sumário</span></header><div class="miolo">${this.sumario()}</div>${pe}`;
      return el;
    }
    if (pg.tipo === 'fim' || pg.tipo === 'contracapa') {
      const aberta = this.acessivel(p);
      el.classList.add(pg.tipo);
      el.innerHTML = pg.tipo === 'fim'
        ? `<div class="miolo">${aberta ? this.fimDoModulo() : this.trancada(p)}</div>${pe}`
        : `<div class="miolo">${this.contracapa()}</div>`;
      return el;
    }
    const l = m.licoes[pg.licao];
    el.classList.add(`cor-${l.cor}`);
    el.dataset.licao = l.id;
    if (!this.acessivel(p)) {
      el.innerHTML = `<div class="miolo">${this.trancada(p)}</div>${pe}`;
      return el;
    }
    const secao = pg.tipo === 'explicacao'
      ? (pg.parte === 0 ? '💬 Para começar' : '📐 Como funciona')
      : pg.tipo === 'exercicios' ? '✏️ Mãos à obra!' : '✅ Agora eu consigo…';
    const extra = pg.tipo === 'exercicios' ? `<span class="placar-da-licao">${this.placar(l)}</span>` : '';
    let miolo = '';
    if (pg.tipo === 'explicacao') {
      miolo = (pg.parte === 0 ? this.aberturaDaLicao(l) : '') + l.explicacao[pg.parte].map((b) => this.bloco(b)).join('');
    } else if (pg.tipo === 'exercicios') {
      miolo = this.paginaDeExercicios(l);
    } else {
      miolo = this.fechamento(l, pg.licao);
    }
    el.innerHTML = `
      <header class="topo"><span class="rotulo">Lição ${l.numero}</span><span class="secao">${secao}</span>${extra}</header>
      <div class="miolo">${miolo}</div>${pe}`;
    return el;
  }

  // ----------------------------------------------------- páginas de fora

  private rosto(quem: Falante, classe = 'rosto'): string {
    const url = this.pedido?.retrato?.(quem) ?? '';
    const nome = escapar(this.pedido?.nomes[quem] ?? quem);
    return url
      ? `<img class="${classe}" src="${url}" alt="${nome}">`
      : `<span class="${classe} emoji" aria-label="${nome}">${ICONE[quem]}</span>`;
  }

  private folhaDeRosto(): string {
    const p = this.pedido!;
    return `
      <p class="escola">🏫 Escola do Gatito</p>
      <div class="retrato-da-capa">${this.rosto('gatito', 'gatito-da-capa')}</div>
      <h1>${escapar(p.modulo.titulo)}</h1>
      <p class="modulo">${escapar(p.modulo.subtitulo)} · Apostila do aluno</p>
      <p class="dono">Este livro pertence a: <span class="caligrafia">${escapar(p.nomes.ari)}</span></p>
      <div class="legenda">
        <h3>Como usar a apostila</h3>
        <ul>
          <li><b>💬 Para começar</b> — a situação da lição, em quadrinhos</li>
          <li><b>📐 Como funciona</b> — a explicação, com o espanhol do lado</li>
          <li><b>✏️ Mãos à obra!</b> — os exercícios</li>
          <li><b>✅ Agora eu consigo…</b> — a revisão e as estrelinhas</li>
          <li><b>🐾 Dica do Gatito</b> · <b>⚠️ Fique de olho!</b> · <b>🇧🇷 Cantinho do Brasil</b></li>
        </ul>
        <p>Errar não tira ponto de ninguém: o Gatito mostra a resposta certa e explica. A lição seguinte abre na próxima aula.</p>
      </div>`;
  }

  private sumario(): string {
    const p = this.pedido!;
    const prog = this.progresso();
    const itens = p.modulo.licoes.map((l, i) => {
      const pagina = primeiraPaginaDa(i);
      const liberada = licaoLiberada(p.modulo, prog, i);
      const feita = concluida(prog, l.id);
      const estado = feita
        ? estrelas(this.estrelasDe[l.id] ?? 0)
        : liberada
          ? '<span class="andamento">▶ em andamento</span>'
          : i > 0 && !concluida(prog, p.modulo.licoes[i - 1].id)
            ? '<span class="cadeado">🔒</span>'
            : '<span class="cadeado">🔔 na próxima aula</span>';
      return `
        <li class="cor-${l.cor} ${liberada ? 'liberada' : 'trancada'} ${feita ? 'feita' : ''}" data-ir="${pagina}">
          <span class="num">${l.numero}</span>
          <span class="emoji">${l.emoji}</span>
          <span class="titulos"><b>${escapar(l.titulo)}</b><small>${escapar(l.subtitulo)} · <i>${escapar(l.assunto)}</i></small></span>
          <span class="estado">${estado}</span>
          <span class="pag">p. ${pagina + 1}</span>
        </li>`;
    }).join('');
    const total = estrelasDoModulo(p.modulo, prog);
    return `
      <h2 class="titulo-sumario">${escapar(p.modulo.subtitulo)}</h2>
      <ol class="indice">${itens}</ol>
      <p class="total-de-estrelas">⭐ ${total} de ${p.modulo.licoes.length * 3} estrelinhas</p>`;
  }

  private trancada(p: number): string {
    return `<div class="pagina-trancada"><span class="icone">🔒</span><p>${escapar(this.porQueTrancada(p))}</p></div>`;
  }

  private fimDoModulo(): string {
    const p = this.pedido!;
    const total = estrelasDoModulo(p.modulo, this.progresso());
    return `
      <div class="fim-do-modulo">
        <p class="selo-fim">🎓 Módulo 1 concluído!</p>
        <div class="retrato-da-capa">${this.rosto('gatito', 'gatito-da-capa')}</div>
        <p class="total">${estrelas(total, p.modulo.licoes.length * 3)}</p>
        <p>Parabéns, <b>${escapar(p.nomes.ari)}</b>! Seis lições, dez tipos de exercício, e um professor muito orgulhoso.</p>
        <p class="em-breve">Em breve: <b>Módulo 2</b>. Fica a dica! 🐾</p>
      </div>`;
  }

  private contracapa(): string {
    return `
      <div class="contracapa-miolo">
        <p class="escola">🏫 Escola do Gatito</p>
        <p>Português para quem já fala espanhol — com carinho, paciência e muito cafuné.</p>
        <p class="edicao">1ª edição · tiragem de 67 exemplares</p>
      </div>`;
  }

  // ---------------------------------------------------- a explicação

  private aberturaDaLicao(l: Licao): string {
    return `
      <div class="abertura-da-licao">
        <span class="numero-grande">${l.numero}</span>
        <div>
          <h2><span class="emoji">${l.emoji}</span> ${escapar(l.titulo)}</h2>
          <p>${escapar(l.subtitulo)} · <i>${escapar(l.assunto)}</i></p>
        </div>
      </div>`;
  }

  private bloco(b: Bloco): string {
    const nomes = this.pedido!.nomes;
    const titulo = (t?: string): string => (t ? `<h4>${escapar(t)}</h4>` : '');
    switch (b.tipo) {
      case 'objetivos':
        return `<div class="objetivos"><h4>Nesta lição você vai…</h4><ul>${b.itens.map((t) => `<li>${realce(t)}</li>`).join('')}</ul></div>`;
      case 'cena':
        return `
          <div class="cena">
            <div class="cena-titulo"><b>${escapar(b.titulo)}</b><small>📍 ${escapar(b.lugar)}</small></div>
            <div class="falas">${b.falas.map((f) => `
              <div class="fala f-${f.quem}${f.quem === 'ari' ? ' minha' : ''}">
                ${this.rosto(f.quem)}
                <div class="balao"><b>${escapar(nomes[f.quem])}</b>${realce(f.texto)}</div>
              </div>`).join('')}
            </div>
          </div>`;
      case 'palavras':
        return `
          <div class="palavras">${titulo(b.titulo)}
            <div class="grade-palavras">${b.itens.map((p) => `
              <div class="palavra${p.nota && !p.es ? ' larga' : ''}">
                ${p.emoji ? `<span class="emoji">${p.emoji}</span>` : ''}
                <span class="texto"><b>${escapar(p.pt)}</b>${p.es ? `<small>🇻🇪 ${escapar(p.es)}</small>` : ''}${p.nota ? `<em>${realce(p.nota)}</em>` : ''}</span>
              </div>`).join('')}
            </div>
          </div>`;
      case 'texto':
        return `<div class="texto">${titulo(b.titulo)}<p>${realce(b.texto)}</p></div>`;
      case 'tabela':
        return `
          <div class="tabela">${titulo(b.titulo)}
            <table>
              <thead><tr>${b.colunas.map((c) => `<th>${escapar(c)}</th>`).join('')}</tr></thead>
              <tbody>${b.linhas.map((linha) => `<tr>${linha.map((c) => `<td>${realce(c)}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
            ${b.nota ? `<p class="nota">${realce(b.nota)}</p>` : ''}
          </div>`;
      case 'contraste':
        return `
          <div class="contraste">${titulo(b.titulo)}
            <table>
              <thead><tr><th>🇻🇪 Em espanhol</th><th aria-hidden="true"></th><th>🇧🇷 Em português</th></tr></thead>
              <tbody>${b.pares.map((p) => `<tr><td>${realce(p.es)}</td><td class="seta" aria-hidden="true">→</td><td>${realce(p.pt)}</td></tr>`).join('')}</tbody>
            </table>
          </div>`;
      case 'exemplos':
        return `<div class="exemplos">${titulo(b.titulo)}<ul>${b.itens.map((t) => `<li>${realce(t)}</li>`).join('')}</ul></div>`;
      case 'dica':
        return `<div class="dica">${this.rosto('gatito')}<div><b>🐾 Dica do Gatito</b><p>${realce(b.texto)}</p></div></div>`;
      case 'atencao':
        return `<div class="atencao"><b>⚠️ Fique de olho!</b><p>${realce(b.texto)}</p></div>`;
      case 'brasil':
        return `<div class="brasil"><b>🇧🇷 Cantinho do Brasil · ${escapar(b.titulo)}</b><p>${realce(b.texto)}</p></div>`;
    }
  }

  // ------------------------------------------------------ os exercícios

  private estado(l: Licao): EstadoDaLicao {
    let e = this.estados.get(l.id);
    if (!e) {
      e = {
        respostas: new Map(),
        gabarito: concluida(this.progresso(), l.id),
        montagem: new Map(),
        rascunho: new Map(),
        selecao: new Map(),
        lacunaAtiva: new Map(),
        fichasUsadas: new Map(),
        agora: null,
      };
      this.estados.set(l.id, e);
    }
    return e;
  }

  /** a resposta de um item — no gabarito, a certa */
  private resposta(l: Licao, k: number, i: number): Resposta | undefined {
    const e = this.estado(l);
    if (e.gabarito) return { certo: true, valor: this.valorCerto(l.exercicios[k], i) };
    return e.respostas.get(`${k}:${i}`);
  }

  /** o que conta como a resposta certa de um item, no formato do `valor` */
  private valorCerto(ex: Exercicio, i: number): string {
    switch (ex.tipo) {
      case 'escolha':
      case 'intruso': return String(ex.itens[i].certa);
      case 'conversa': return String(ex.turnos[i].certa);
      case 'vf': return String(ex.itens[i].verdade);
      case 'ligar': return String(i);
      case 'lacunas': return ex.respostas[i];
      case 'ordenar': return ex.itens[i].pedacos.map((_, j) => j).join('|');
      case 'digitar': return ex.itens[i].aceitas[0];
      case 'classificar': return String(ex.itens[i].grupo);
      case 'erro': return String(ex.itens[i].errada);
    }
  }

  private acertos(l: Licao): { feitos: number; certos: number; total: number } {
    const e = this.estado(l);
    const total = itensDaLicao(l);
    if (e.gabarito) return { feitos: total, certos: total, total };
    let certos = 0;
    for (const r of e.respostas.values()) if (r.certo) certos += 1;
    return { feitos: e.respostas.size, certos, total };
  }

  private placar(l: Licao): string {
    const e = this.estado(l);
    if (e.gabarito) return `✓ ${estrelas(this.estrelasDe[l.id] ?? 0)}`;
    const a = this.acertos(l);
    return `<span class="barra"><i style="width:${Math.round((a.feitos / a.total) * 100)}%"></i></span> ${a.feitos}/${a.total}`;
  }

  private paginaDeExercicios(l: Licao): string {
    const e = this.estado(l);
    const aviso = e.gabarito
      ? `<div class="aviso-gabarito">📗 Lição concluída: estas são as respostas certas. <button class="refazer" data-refazer="${l.id}">↺ Refazer os exercícios</button></div>`
      : '';
    return aviso + l.exercicios.map((_, k) => this.exercicio(l, k)).join('');
  }

  private exercicio(l: Licao, k: number): string {
    const ex = l.exercicios[k];
    let corpo = '';
    switch (ex.tipo) {
      case 'escolha':
      case 'intruso':
        corpo = ex.itens.map((it, i) => this.itemDeEscolha(l, k, i, it, ex.tipo === 'intruso')).join('');
        break;
      case 'conversa': corpo = this.conversa(l, k, ex); break;
      case 'vf': corpo = this.verdadeiroOuFalso(l, k, ex); break;
      case 'ligar': corpo = this.ligar(l, k, ex); break;
      case 'lacunas': corpo = this.lacunas(l, k, ex); break;
      case 'ordenar': corpo = this.ordenar(l, k, ex); break;
      case 'digitar': corpo = this.digitar(l, k, ex); break;
      case 'classificar': corpo = this.classificar(l, k, ex); break;
      case 'erro': corpo = this.acheOErro(l, k, ex); break;
    }
    return `
      <section class="exercicio ex-${ex.tipo}" data-ex="${k}">
        <h4><span class="n">${k + 1}</span>${escapar(ex.enunciado)}</h4>
        ${corpo}
      </section>`;
  }

  /** o retorno de um item respondido: o elogio, ou a certa e o porquê */
  private retorno(r: Resposta | undefined, certa: string, porque: string, semente: string, sempre = false): string {
    if (!r) return '';
    const e = this.pedido && this.estadoPorSemente(semente);
    if (e?.gabarito && !sempre) return '';
    if (r.certo) {
      // o elogio sai da semente do item: muda de um item para o outro, mas não a cada repintura
      const h = [...semente].reduce((acc, c) => (Math.imul(acc, 31) + c.charCodeAt(0)) >>> 0, 7);
      const elogio = ELOGIOS[h % ELOGIOS.length];
      const acento = r.acento ? ` Só faltou o acento: <b>${escapar(certa)}</b>.` : '';
      return `<p class="retorno certo">✓ ${elogio}${acento}</p>`;
    }
    const ponto = /[.!?…]$/.test(certa) ? '' : '.';
    return `<p class="retorno errado"><span>✗ A certa é <b>${escapar(certa)}</b>${ponto}</span> <span class="porque">🐾 ${realce(porque)}</span></p>`;
  }

  private estadoPorSemente(semente: string): EstadoDaLicao | undefined {
    return this.estados.get(semente.split(':')[0]);
  }

  private itemDeEscolha(l: Licao, k: number, i: number, it: ItemDeEscolha, intruso: boolean): string {
    const r = this.resposta(l, k, i);
    const ops = it.opcoes.map((op, j) => {
      const classe = !r ? '' : j === it.certa ? 'certa' : String(j) === r.valor ? 'errada' : 'apagada';
      return `<button class="op ${classe}" data-op="${j}" ${r ? 'disabled' : ''}>${escapar(op)}</button>`;
    }).join('');
    return `
      <div class="item${intruso ? ' intruso' : ''}" data-item="${i}">
        ${it.figura ? this.figura(it.figura) : ''}
        <p class="pergunta">${realce(it.pergunta)}</p>
        <div class="opcoes">${ops}</div>
        ${this.retorno(r, it.opcoes[it.certa], it.porque, `${l.id}:${k}:${i}`)}
      </div>`;
  }

  /** o desenho do "onde está?": a caixa (ou a mesa) e o novelo em volta */
  private figura(f: Figura): string {
    return `
      <div class="figura base-${f.base} lugar-${f.lugar}" aria-hidden="true">
        <span class="chao"></span>
        <span class="base">${f.base === 'caixa' ? '<i class="tampa"></i>' : '<i class="perna e"></i><i class="perna d"></i>'}</span>
        <span class="objeto">${f.objeto}</span>
      </div>`;
  }

  private conversa(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'conversa' }>): string {
    const nomes = this.pedido!.nomes;
    let html = '';
    for (let t = 0; t < ex.turnos.length; t++) {
      const turno = ex.turnos[t];
      const r = this.resposta(l, k, t);
      html += `
        <div class="msg dele">${this.rosto(ex.com)}<div class="bolha">${turno.contexto ? `<i class="contexto">${escapar(turno.contexto)}</i>` : ''}<b>${escapar(nomes[ex.com])}</b>${escapar(turno.fala)}</div></div>`;
      if (r) {
        const dito = turno.opcoes[Number(r.valor)] ?? '';
        html += `<div class="msg minha${r.certo ? '' : ' errada'}"><div class="bolha">${escapar(dito)}</div></div>`;
        html += this.retorno(r, turno.opcoes[turno.certa], turno.porque, `${l.id}:${k}:${t}`);
        continue;
      }
      html += `
        <div class="responder" data-item="${t}">
          <small>${escapar(nomes.ari)} responde:</small>
          <div class="opcoes">${turno.opcoes.map((op, j) => `<button class="op" data-op="${j}">${escapar(op)}</button>`).join('')}</div>
        </div>`;
      break;
    }
    return `<div class="chat">${html}</div>`;
  }

  private verdadeiroOuFalso(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'vf' }>): string {
    return ex.itens.map((it, i) => {
      const r = this.resposta(l, k, i);
      const botao = (v: boolean, rotulo: string): string => {
        const classe = !r ? '' : v === it.verdade ? 'certa' : String(v) === r.valor ? 'errada' : 'apagada';
        return `<button class="op ${classe}" data-vf="${v}" ${r ? 'disabled' : ''}>${rotulo}</button>`;
      };
      return `
        <div class="item vf" data-item="${i}">
          <p class="pergunta">${realce(it.frase)}</p>
          <div class="opcoes">${botao(true, 'Verdadeiro')}${botao(false, 'Falso')}</div>
          ${this.retorno(r, it.verdade ? 'Verdadeiro' : 'Falso', it.porque, `${l.id}:${k}:${i}`)}
        </div>`;
    }).join('');
  }

  private ordemDaDireita(l: Licao, k: number, n: number): number[] {
    return embaralhar(Array.from({ length: n }, (_, i) => i), `${l.id}:${k}:direita`);
  }

  private ligar(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'ligar' }>): string {
    const e = this.estado(l);
    const sel = e.gabarito ? undefined : e.selecao.get(k);
    const ordem = this.ordemDaDireita(l, k, ex.pares.length);
    const esquerda = ex.pares.map((p, i) => {
      const r = this.resposta(l, k, i);
      const classe = r ? (r.certo ? 'ligada certa' : 'ligada errada') : sel?.lado === 'e' && sel.i === i ? 'marcada' : '';
      return `<button class="lado ${classe}" data-esq="${i}" ${r ? 'disabled' : ''}>${r ? `<span class="par">${i + 1}</span>` : ''}${escapar(p[0])}</button>`;
    }).join('');
    const direita = ordem.map((orig, j) => {
      const feito = this.resposta(l, k, orig);
      const classe = feito ? 'ligada' : sel?.lado === 'd' && sel.i === j ? 'marcada' : '';
      return `<button class="lado ${classe}" data-dir="${j}" data-orig="${orig}" ${feito ? 'disabled' : ''}>${feito ? `<span class="par">${orig + 1}</span>` : ''}${escapar(ex.pares[orig][1])}</button>`;
    }).join('');
    const erradas = ex.pares
      .map((p, i) => ({ p, i, r: e.gabarito ? undefined : e.respostas.get(`${k}:${i}`) }))
      .filter((x) => x.r && !x.r.certo)
      .map((x) => `<li><b>${escapar(x.p[0])}</b> → ${escapar(x.p[1])} <s>${escapar(ex.pares[Number(x.r!.valor)]?.[1] ?? '')}</s></li>`)
      .join('');
    const feitos = ex.pares.filter((_, i) => this.resposta(l, k, i)).length;
    const fim = !e.gabarito && feitos === ex.pares.length
      ? (erradas
        ? `<div class="retorno errado"><span>✗ Os pares certos:</span><ul>${erradas}</ul><span class="porque">🐾 ${realce(ex.porque)}</span></div>`
        : '<p class="retorno certo">✓ Todos os pares certos!</p>')
      : '';
    return `
      <p class="instrucao">Toque numa palavra de cada lado.</p>
      <div class="colunas-de-ligar"><div class="coluna">${esquerda}</div><div class="coluna">${direita}</div></div>
      ${fim}`;
  }

  private fichasDoBanco(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'lacunas' }>): string[] {
    return embaralhar([...ex.respostas, ...ex.distratores], `${l.id}:${k}:banco`);
  }

  private lacunas(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'lacunas' }>): string {
    const e = this.estado(l);
    const fichas = this.fichasDoBanco(l, k, ex);
    const usadas = e.gabarito
      ? new Set(fichas.map((_, j) => j).filter((j) => ex.respostas.includes(fichas[j])))
      : e.fichasUsadas.get(k) ?? new Set<number>();
    const ativa = this.lacunaDaVez(l, k, ex);
    const partes = ex.texto.split(/\{(\d+)\}/);
    let texto = '';
    partes.forEach((parte, j) => {
      if (j % 2 === 0) {
        texto += escapar(parte);
        return;
      }
      const g = Number(parte);
      const r = this.resposta(l, k, g);
      if (r) {
        texto += r.certo
          ? `<span class="lacuna preenchida certa">${escapar(ex.respostas[g])}</span>`
          : `<span class="lacuna preenchida errada"><s>${escapar(r.valor)}</s> ${escapar(ex.respostas[g])}</span>`;
      } else {
        texto += `<button class="lacuna${g === ativa ? ' ativa' : ''}" data-lac="${g}" aria-label="lacuna ${g + 1}">${g + 1}</button>`;
      }
    });
    const banco = fichas.map((f, j) =>
      `<button class="ficha${usadas.has(j) ? ' usada' : ''}" data-ficha="${j}" ${usadas.has(j) || e.gabarito ? 'disabled' : ''}>${escapar(f)}</button>`,
    ).join('');
    const erradas = ex.respostas
      .map((resp, g) => ({ resp, g, r: e.gabarito ? undefined : e.respostas.get(`${k}:${g}`) }))
      .filter((x) => x.r && !x.r.certo)
      .map((x) => `<li><b>${x.g + 1}.</b> ${escapar(x.resp)} — ${realce(ex.porque[x.g])}</li>`)
      .join('');
    const acertosAqui = ex.respostas.filter((_, g) => e.respostas.get(`${k}:${g}`)?.certo).length;
    const tudo = ex.respostas.every((_, g) => this.resposta(l, k, g));
    const fim = !e.gabarito && tudo
      ? (erradas
        ? `<div class="retorno errado"><span>🐾 As lacunas que escaparam:</span><ul>${erradas}</ul></div>`
        : `<p class="retorno certo">✓ ${acertosAqui} de ${ex.respostas.length}: o texto está perfeito!</p>`)
      : '';
    return `
      <div class="bilhete">${ex.titulo ? `<p class="titulo-bilhete">${escapar(ex.titulo)}</p>` : ''}<p class="texto-lacunas">${texto}</p></div>
      ${tudo ? '' : '<p class="instrucao">Toque numa palavra do banco para pôr na lacuna marcada.</p>'}
      <div class="banco">${banco}</div>
      ${fim}`;
  }

  /** a lacuna que a próxima ficha preenche: a escolhida, ou a primeira vazia */
  private lacunaDaVez(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'lacunas' }>): number {
    const e = this.estado(l);
    const escolhida = e.lacunaAtiva.get(k);
    if (escolhida !== undefined && !this.resposta(l, k, escolhida)) return escolhida;
    return ex.respostas.findIndex((_, g) => !this.resposta(l, k, g));
  }

  private ordemDasPecas(l: Licao, k: number, i: number, n: number): number[] {
    return embaralhar(Array.from({ length: n }, (_, j) => j), `${l.id}:${k}:${i}:pecas`);
  }

  private ordenar(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'ordenar' }>): string {
    const e = this.estado(l);
    return ex.itens.map((it, i) => {
      const r = this.resposta(l, k, i);
      const certa = it.pedacos.join(' ');
      if (r) {
        const dita = r.valor.split('|').map((j) => it.pedacos[Number(j)] ?? '').join(' ');
        return `
          <div class="item ordenar" data-item="${i}">
            <p class="frase-montada ${r.certo ? 'certa' : 'errada'}">${escapar(r.certo ? certa : dita)}</p>
            ${this.retorno(r, certa, it.porque, `${l.id}:${k}:${i}`)}
          </div>`;
      }
      const posta = e.montagem.get(`${k}:${i}`) ?? [];
      const ordem = this.ordemDasPecas(l, k, i, it.pedacos.length);
      const montada = posta.length
        ? posta.map((j, pos) => `<button class="peca posta" data-tirar="${pos}">${escapar(it.pedacos[j])}</button>`).join('')
        : '<span class="vazia">toque nas palavras, na ordem</span>';
      const soltas = ordem.map((j) =>
        `<button class="peca${posta.includes(j) ? ' usada' : ''}" data-peca="${j}" ${posta.includes(j) ? 'disabled' : ''}>${escapar(it.pedacos[j])}</button>`,
      ).join('');
      const pronta = posta.length === it.pedacos.length;
      return `
        <div class="item ordenar" data-item="${i}">
          <div class="montagem">${montada}</div>
          <div class="pecas">${soltas}</div>
          ${pronta ? '<button class="conferir" data-conferir-frase="1">Conferir ✓</button>' : ''}
        </div>`;
    }).join('');
  }

  private digitar(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'digitar' }>): string {
    const e = this.estado(l);
    return ex.itens.map((it, i) => {
      const r = this.resposta(l, k, i);
      const chave = `${k}:${i}`;
      const valor = r ? r.valor : e.rascunho.get(chave) ?? '';
      const classe = r ? (r.certo ? 'certo' : 'errado') : '';
      return `
        <div class="item digitar" data-item="${i}">
          <label class="linha-de-digitar">
            <span>${realce(it.antes)}</span>
            <input class="campo ${classe}" data-dig="${chave}" value="${escapar(valor)}" ${r ? 'disabled' : ''}
              autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="resposta">
            ${it.depois ? `<span>${realce(it.depois)}</span>` : ''}
            ${r ? '' : `<button class="conferir" data-conferir="${chave}">Conferir</button>`}
          </label>
          ${this.retorno(r, it.aceitas[0], it.porque, `${l.id}:${k}:${i}`)}
        </div>`;
    }).join('');
  }

  private classificar(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'classificar' }>): string {
    return ex.itens.map((it, i) => {
      const r = this.resposta(l, k, i);
      const botoes = ex.grupos.map((g, j) => {
        const classe = !r ? '' : j === it.grupo ? 'certa' : String(j) === r.valor ? 'errada' : 'apagada';
        return `<button class="op ${classe}" data-grupo="${j}" ${r ? 'disabled' : ''}>${escapar(g)}</button>`;
      }).join('');
      return `
        <div class="item classificar" data-item="${i}">
          <span class="frase">${realce(it.texto)}</span>
          <span class="opcoes">${botoes}</span>
          ${this.retorno(r, ex.grupos[it.grupo], it.porque, `${l.id}:${k}:${i}`)}
        </div>`;
    }).join('');
  }

  private acheOErro(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'erro' }>): string {
    return ex.itens.map((it, i) => {
      const r = this.resposta(l, k, i);
      const palavras = it.palavras.map((p, j) => {
        if (!r) return `<button class="palavra-da-frase" data-palavra="${j}">${escapar(p)}</button>`;
        if (j === it.errada) return `<span class="palavra-da-frase corrigida"><s>${escapar(p)}</s> <b>${escapar(it.correcao)}</b></span>`;
        const tocada = String(j) === r.valor && !r.certo;
        return `<span class="palavra-da-frase${tocada ? ' tocada' : ''}">${escapar(p)}</span>`;
      }).join(' ');
      const certa = `${it.palavras[it.errada]} → ${it.correcao}`;
      return `
        <div class="item erro" data-item="${i}">
          <p class="frase-erro">${palavras}</p>
          ${this.retorno(r, certa, it.porque, `${l.id}:${k}:${i}`)}
          ${r?.certo && !this.estado(l).gabarito ? `<p class="porque solto">🐾 ${realce(it.porque)}</p>` : ''}
        </div>`;
    }).join('');
  }

  // ---------------------------------------------------- o fechamento

  private fechamento(l: Licao, i: number): string {
    const e = this.estado(l);
    const feita = concluida(this.progresso(), l.id);
    const consigo = `<ul class="consigo">${l.consigo.map((c) => `<li>${realce(c)}</li>`).join('')}</ul>`;
    if (!feita) {
      return `
        <div class="fechamento esperando">
          ${consigo}
          <div class="pagina-trancada leve"><span class="icone">✏️</span><p>Termine os exercícios ${this.duplo ? 'da página ao lado' : 'da página anterior'} para fechar a lição.</p></div>
        </div>`;
    }
    const m = this.pedido!.modulo;
    const melhor = this.estrelasDe[l.id] ?? 1;
    const agora = e.agora;
    const nota = agora ?? melhor;
    const a = this.acertos(l);
    const detalhe = agora !== null
      ? `<p class="de-primeira">${a.certos} de ${a.total} de primeira${agora < melhor ? ` · a melhor nota continua ${estrelas(melhor)}` : ''}</p>`
      : '<p class="de-primeira">a melhor nota desta lição</p>';
    const proxima = m.licoes[i + 1];
    let seguir = '';
    if (proxima) {
      seguir = licaoLiberada(m, this.progresso(), i + 1)
        ? `<button class="seguir" data-ir="${primeiraPaginaDa(i + 1)}">Lição ${proxima.numero}: ${escapar(proxima.titulo)} ▶</button>`
        : `<p class="proxima-aula">🔔 A lição ${proxima.numero}, <b>${escapar(proxima.titulo)}</b>, abre na próxima aula do Gatito.</p>`;
    } else {
      seguir = `<button class="seguir" data-ir="${this.paginas.length - 2}">🎓 O fim do módulo ▶</button>`;
    }
    const bilhete = BILHETE[nota].replace('{aluno}', escapar(this.pedido!.nomes.ari));
    return `
      <div class="fechamento">
        ${consigo}
        <div class="nota-da-licao${agora !== null ? ' agora' : ''}">
          <span class="carimbo">Concluída!</span>
          ${estrelas(nota)}
          ${detalhe}
        </div>
        <div class="bilhete-do-gatito">${this.rosto('gatito')}<p>${bilhete}<span class="assinatura">— Prof. Gatito 🐾</span></p></div>
        <div class="botoes-do-fim">
          <button class="refazer" data-refazer="${l.id}">↺ Refazer os exercícios</button>
          ${seguir}
        </div>
      </div>`;
  }

  // =========================================================== responder

  private licaoDoCampo(el: HTMLElement): Licao | null {
    const id = el.closest<HTMLElement>('.pagina')?.dataset.licao;
    return this.pedido?.modulo.licoes.find((l) => l.id === id) ?? null;
  }

  private aoClicar(e: MouseEvent): void {
    if (this.virando) return;
    const alvo = e.target as HTMLElement;
    const ir = alvo.closest<HTMLElement>('[data-ir]');
    if (ir && !alvo.closest('.copia')) {
      this.irPara(Number(ir.dataset.ir));
      return;
    }
    const refazer = alvo.closest<HTMLElement>('[data-refazer]');
    if (refazer) {
      this.refazer(refazer.dataset.refazer!);
      return;
    }
    const secao = alvo.closest<HTMLElement>('[data-ex]');
    const l = this.licaoDoCampo(alvo);
    if (!secao || !l) return;
    const k = Number(secao.dataset.ex);
    const ex = l.exercicios[k];
    const est = this.estado(l);
    if (est.gabarito) return;
    const item = alvo.closest<HTMLElement>('[data-item]');
    const i = item ? Number(item.dataset.item) : -1;
    const botao = alvo.closest<HTMLElement>('button');
    if (!botao || (botao as HTMLButtonElement).disabled) return;

    switch (ex.tipo) {
      case 'escolha':
      case 'intruso':
      case 'conversa': {
        if (botao.dataset.op === undefined || i < 0) return;
        const certa = ex.tipo === 'conversa' ? ex.turnos[i].certa : ex.itens[i].certa;
        this.responder(l, k, i, Number(botao.dataset.op) === certa, botao.dataset.op);
        break;
      }
      case 'vf': {
        if (botao.dataset.vf === undefined || i < 0) return;
        this.responder(l, k, i, (botao.dataset.vf === 'true') === ex.itens[i].verdade, botao.dataset.vf);
        break;
      }
      case 'classificar': {
        if (botao.dataset.grupo === undefined || i < 0) return;
        this.responder(l, k, i, Number(botao.dataset.grupo) === ex.itens[i].grupo, botao.dataset.grupo);
        break;
      }
      case 'erro': {
        if (botao.dataset.palavra === undefined || i < 0) return;
        this.responder(l, k, i, Number(botao.dataset.palavra) === ex.itens[i].errada, botao.dataset.palavra);
        break;
      }
      case 'ligar': this.tocarNoLigar(l, k, ex, botao); break;
      case 'lacunas': this.tocarNaLacuna(l, k, ex, botao); break;
      case 'ordenar': this.tocarNaFrase(l, k, ex, i, botao); break;
      case 'digitar': {
        const chave = botao.dataset.conferir;
        const campo = chave ? secao.querySelector<HTMLInputElement>(`input[data-dig="${chave}"]`) : null;
        if (campo) this.conferirCampo(campo);
        break;
      }
    }
  }

  private tocarNoLigar(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'ligar' }>, botao: HTMLElement): void {
    const est = this.estado(l);
    const lado: 'e' | 'd' | null = botao.dataset.esq !== undefined ? 'e' : botao.dataset.dir !== undefined ? 'd' : null;
    if (!lado) return;
    const i = Number(lado === 'e' ? botao.dataset.esq : botao.dataset.dir);
    const sel = est.selecao.get(k);
    if (!sel || sel.lado === lado) {
      // primeiro toque (ou troca de ideia do mesmo lado): só marca
      est.selecao.set(k, { lado, i });
      this.som?.('escolha');
      this.repintarExercicio(l, k);
      return;
    }
    est.selecao.delete(k);
    const ordem = this.ordemDaDireita(l, k, ex.pares.length);
    const esq = lado === 'e' ? i : sel.i;
    const dirOrig = ordem[lado === 'd' ? i : sel.i];
    this.responder(l, k, esq, dirOrig === esq, String(dirOrig));
  }

  private tocarNaLacuna(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'lacunas' }>, botao: HTMLElement): void {
    const est = this.estado(l);
    if (botao.dataset.lac !== undefined) {
      est.lacunaAtiva.set(k, Number(botao.dataset.lac));
      this.som?.('escolha');
      this.repintarExercicio(l, k);
      return;
    }
    if (botao.dataset.ficha === undefined) return;
    const g = this.lacunaDaVez(l, k, ex);
    if (g < 0) return;
    const fichas = this.fichasDoBanco(l, k, ex);
    const j = Number(botao.dataset.ficha);
    const usadas = est.fichasUsadas.get(k) ?? new Set<number>();
    est.fichasUsadas.set(k, usadas);
    const certo = normalizar(fichas[j]) === normalizar(ex.respostas[g]);
    // gasta a ficha da resposta CERTA: a errada volta para o banco (pode ser de outra lacuna)
    const gasta = certo ? j : fichas.findIndex((f, x) => !usadas.has(x) && normalizar(f) === normalizar(ex.respostas[g]));
    if (gasta >= 0) usadas.add(gasta);
    est.lacunaAtiva.delete(k);
    this.responder(l, k, g, certo, fichas[j]);
  }

  private tocarNaFrase(l: Licao, k: number, ex: Extract<Exercicio, { tipo: 'ordenar' }>, i: number, botao: HTMLElement): void {
    if (i < 0) return;
    const est = this.estado(l);
    const chave = `${k}:${i}`;
    const posta = est.montagem.get(chave) ?? [];
    const it = ex.itens[i];
    if (botao.dataset.peca !== undefined) {
      const j = Number(botao.dataset.peca);
      if (!posta.includes(j)) posta.push(j);
      est.montagem.set(chave, posta);
      this.som?.('escolha');
      this.repintarExercicio(l, k);
      return;
    }
    if (botao.dataset.tirar !== undefined) {
      posta.splice(Number(botao.dataset.tirar), 1);
      est.montagem.set(chave, posta);
      this.repintarExercicio(l, k);
      return;
    }
    if (botao.dataset.conferirFrase !== undefined && posta.length === it.pedacos.length) {
      // compara o TEXTO: peça repetida ("o" duas vezes) vale em qualquer das duas vagas
      const certo = posta.map((j) => it.pedacos[j]).join(' ') === it.pedacos.join(' ');
      this.responder(l, k, i, certo, posta.join('|'));
    }
  }

  private conferirCampo(campo: HTMLInputElement): void {
    const l = this.licaoDoCampo(campo);
    const chave = campo.dataset.dig;
    if (!l || !chave || campo.disabled) return;
    const [k, i] = chave.split(':').map(Number);
    const ex = l.exercicios[k];
    if (ex.tipo !== 'digitar') return;
    const valor = campo.value.trim();
    if (!valor) {
      campo.focus();
      return;
    }
    const c = conferirDigitado(valor, ex.itens[i].aceitas);
    this.estado(l).rascunho.delete(chave);
    this.responder(l, k, i, c !== 'errado', valor, c === 'acento');
    // o cursor pula para o próximo campo do mesmo exercício, como num formulário
    const proximo = [this.esq, this.dir]
      .map((el) => el.querySelector<HTMLInputElement>(`input[data-dig="${k}:${i + 1}"]`))
      .find((x) => x && !x.disabled);
    proximo?.focus();
  }

  private responder(l: Licao, k: number, i: number, certo: boolean, valor: string, acento = false): void {
    const est = this.estado(l);
    const chave = `${k}:${i}`;
    if (est.respostas.has(chave)) return;
    est.respostas.set(chave, { certo, valor, acento });
    this.som?.(certo ? 'acertou' : 'errou');
    this.repintarExercicio(l, k);
    this.repintarPlacar(l);
    const a = this.acertos(l);
    if (a.feitos === a.total) this.concluir(l);
  }

  private concluir(l: Licao): void {
    const est = this.estado(l);
    const a = this.acertos(l);
    const nota = estrelasPor(a.certos, a.total);
    est.agora = nota;
    const antes = this.estrelasDe[l.id] ?? 0;
    this.estrelasDe[l.id] = Math.max(antes, nota);
    this.resultado.concluidas = this.resultado.concluidas.filter((c) => c.id !== l.id);
    this.resultado.concluidas.push({ id: l.id, estrelas: nota });
    this.pedido?.aoConcluir(l.id, nota);
    this.som?.('memoria');
    // repinta o que depende da conclusão: o fechamento, o sumário, a navegação
    for (const el of [this.esq, this.dir]) {
      const p = Number(el.dataset.pagina);
      const pg = this.paginas[p];
      if (pg && (pg.tipo === 'fechamento' || pg.tipo === 'sumario')) this.pintarNo(el, p, el === this.esq ? 'esq' : 'dir');
    }
    this.pintarNavegacao();
    if (!this.duplo) this.depois.classList.add('chamando');
  }

  private refazer(id: string): void {
    const l = this.pedido?.modulo.licoes.find((x) => x.id === id);
    if (!l) return;
    this.estados.delete(id);
    const e = this.estado(l);
    e.gabarito = false;
    this.som?.('trocar');
    const alvo = primeiraPaginaDa(l.numero - 1) + 2;
    if (this.alinhar(alvo) === this.pagina) this.pintarTudo();
    else this.virar(this.alinhar(alvo));
    this.depois.classList.remove('chamando');
  }

  /** repinta só um exercício, sem mexer na rolagem nem no que está digitado nos outros */
  private repintarExercicio(l: Licao, k: number): void {
    for (const el of [this.esq, this.dir]) {
      if (el.dataset.licao !== l.id) continue;
      const velho = el.querySelector<HTMLElement>(`.exercicio[data-ex="${k}"]`);
      if (!velho) continue;
      const foco = document.activeElement as HTMLInputElement | null;
      const focoChave = foco?.dataset?.dig;
      const tmp = document.createElement('div');
      tmp.innerHTML = this.exercicio(l, k);
      const novo = tmp.firstElementChild as HTMLElement;
      velho.replaceWith(novo);
      if (focoChave) novo.querySelector<HTMLInputElement>(`input[data-dig="${focoChave}"]`)?.focus();
    }
  }

  private repintarPlacar(l: Licao): void {
    for (const el of [this.esq, this.dir]) {
      if (el.dataset.licao !== l.id) continue;
      const placar = el.querySelector<HTMLElement>('.placar-da-licao');
      if (placar) placar.innerHTML = this.placar(l);
    }
  }
}
