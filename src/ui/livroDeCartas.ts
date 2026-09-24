import type { CartaNaTela, FimDoJardim } from '../minigames/jardim/tela';
import type { Raridade } from '../minigames/jardim/cartas';
import type { SomNome } from '../audio/efeitos';
import { desenharCarta, escapar } from './telaDeCartas';

/**
 * O LIVRO DAS CARTAS e A TELA DO FIM DA RODADA — as duas páginas que mostram
 * cartas SEM escolher nenhuma.
 *
 * As duas desenham a carta com o MESMO `desenharCarta` da tela de escolha:
 * a carta que a dupla guardou no livro é a mesma que ela pegou na mesa, e o
 * celular ganha de graça as faixas deitadas que aquela tela já tem.
 *
 * ================================================= O LIVRO (pedido do Renan)
 *
 * Toda carta do baralho tem um LUGAR próprio no livro, na ordem da raridade
 * (comum → lendária, e dentro dela a ordem do catálogo). Carta que a dupla
 * ainda não escolheu nenhuma vez é um retângulo cinza translúcido no lugar
 * dela, com o número: dá para ver quanto falta e onde cada uma vai cair. Carta
 * já escolhida aparece inteira, para ler depois o que ela faz — e um toque
 * nela abre em tamanho grande (a lupa), porque no livro elas vão menores.
 */

const ORDEM: readonly Raridade[] = ['comum', 'incomum', 'raro', 'lendario'];
const NOME_DA_RARIDADE: Record<Raridade, string> = {
  comum: 'Comuns', incomum: 'Incomuns', raro: 'Raras', lendario: 'Lendárias',
};

/** as cartas do baralho na ordem do livro: por raridade, e na ordem do catálogo dentro dela */
export function ordemDoLivro(cartas: readonly CartaNaTela[]): CartaNaTela[] {
  return ORDEM.flatMap((r) => cartas.filter((c) => c.raridade === r && !c.consolo));
}

export class LivroDeCartas {
  private readonly raiz: HTMLDivElement;
  private readonly paginas: HTMLDivElement;
  private readonly conta: HTMLElement;
  private readonly lupa: HTMLDivElement;
  private cartas: CartaNaTela[] = [];
  private resolver: (() => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="livro">
        <div class="capa">
          <span class="lombada" aria-hidden="true"></span>
          <div class="titulo">
            <h2>📖 Livro das cartas</h2>
            <p class="conta"></p>
          </div>
          <button class="fechar" aria-label="fechar o livro">fechar</button>
        </div>
        <div class="paginas"></div>
      </div>
      <div class="lupa" aria-hidden="true"></div>
    `;
    this.paginas = raiz.querySelector('.paginas')!;
    this.conta = raiz.querySelector('.conta')!;
    this.lupa = raiz.querySelector('.lupa')!;
    raiz.querySelector('.fechar')!.addEventListener('click', () => this.fechar());
    this.paginas.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.carta-jardim');
      if (!el) return;
      const c = this.cartas[Number(el.dataset.i)];
      if (c) this.ampliar(c);
    });
    // a lupa fecha com qualquer toque
    this.lupa.addEventListener('click', () => this.lupa.classList.remove('show'));
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  /** Abre o livro e resolve quando fecha. `vistas` são as ids já desbloqueadas. */
  abrir(todas: readonly CartaNaTela[], vistas: ReadonlySet<string>): Promise<void> {
    return new Promise((resolve) => {
      this.cartas = ordemDoLivro(todas);
      const achadas = this.cartas.filter((c) => vistas.has(c.id)).length;
      this.conta.innerHTML = `<b>${achadas}</b> de ${this.cartas.length} cartas descobertas`;
      let n = 0;
      this.paginas.innerHTML = ORDEM.map((r) => {
        const daRaridade = this.cartas.map((c, i) => ({ c, i })).filter(({ c }) => c.raridade === r);
        const temDela = daRaridade.filter(({ c }) => vistas.has(c.id)).length;
        const vagas = daRaridade.map(({ c, i }) => {
          n += 1;
          return vistas.has(c.id)
            ? desenharCarta(c, i)
            : `<div class="carta-jardim vaga-trancada" title="ainda não descoberta"><span class="interrogacao">?</span><span class="numero">${n}</span></div>`;
        }).join('');
        return `
          <section class="capitulo r-${r}">
            <h3><span class="pedra" aria-hidden="true"></span>${NOME_DA_RARIDADE[r]} <small>${temDela} de ${daRaridade.length}</small></h3>
            <div class="grade">${vagas}</div>
          </section>`;
      }).join('');
      this.paginas.scrollTop = 0;
      this.lupa.classList.remove('show');
      this.raiz.classList.add('show');
      this.som?.('diario');
      this.resolver = resolve;
    });
  }

  fechar(): void {
    if (!this.aberto) return;
    // com a lupa aberta, o primeiro "fechar" (o Escape) fecha só a lupa
    if (this.lupa.classList.contains('show')) {
      this.lupa.classList.remove('show');
      return;
    }
    this.raiz.classList.remove('show');
    this.som?.('menu');
    const r = this.resolver;
    this.resolver = null;
    r?.();
  }

  private ampliar(c: CartaNaTela): void {
    this.lupa.innerHTML = desenharCarta(c, 0);
    this.lupa.classList.add('show');
    this.som?.('escolha');
  }
}

/**
 * A TELA DO FIM DA RODADA: venceu (as vinte ondas) ou a estufa caiu. Mostra
 * os números da rodada — bichos espantados, e de quais, canteiros de pé, o
 * nível — e a PÁGINA DAS CARTAS que a rodada juntou, com um selo nas que
 * entraram no livro pela primeira vez.
 */
export class TelaDoFim {
  private readonly raiz: HTMLDivElement;
  private resolver: (() => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.fechar')) this.fechar();
    });
  }

  get aberta(): boolean {
    return this.raiz.classList.contains('show');
  }

  abrir(fim: FimDoJardim): Promise<void> {
    return new Promise((resolve) => {
      const novas = new Set(fim.novas);
      const pragas = fim.porPraga
        .map((p) => `<span class="praga">${escapar(p.nome)} <b>×${p.quantos}</b></span>`)
        .join('');
      const cartas = fim.cartas.length
        ? fim.cartas.map((c, i) => `
            <div class="vaga${novas.has(c.id) ? ' nova' : ''}">
              ${desenharCarta(c, i)}
              ${novas.has(c.id) ? '<span class="selo-novo">📖 nova no livro</span>' : ''}
            </div>`).join('')
        : '<p class="nenhuma">nenhuma carta nesta rodada</p>';
      this.raiz.innerHTML = `
        <div class="fim-cartao ${fim.venceu ? 'venceu' : 'caiu'}">
          <div class="cabeca">
            <p class="selo-fim">${fim.venceu ? '🏆 Vitória!' : '🥀 A estufa caiu'}</p>
            <h2>${fim.venceu
              ? `As ${fim.ondas} ondas, e a estufa de pé!`
              : `Vocês seguraram até a onda ${fim.onda} de ${fim.ondas}`}</h2>
          </div>
          <div class="numeros">
            <div><b>${fim.espantados}</b><span>bichos espantados</span></div>
            <div><b>${fim.canteiros}/${fim.totalDeCanteiros}</b><span>canteiros de pé</span></div>
            <div><b>${fim.nivel}</b><span>nível</span></div>
            <div><b>${fim.onda}/${fim.ondas}</b><span>ondas</span></div>
          </div>
          ${pragas ? `<div class="pragas">${pragas}</div>` : ''}
          <h3>As cartas desta rodada <small>${fim.cartas.length}${novas.size ? ` · ${novas.size} ${novas.size === 1 ? 'nova' : 'novas'} no livro` : ''}</small></h3>
          <div class="grade">${cartas}</div>
          <button class="fechar">voltar pra estufa</button>
        </div>
      `;
      this.raiz.scrollTop = 0;
      this.raiz.classList.add('show');
      this.som?.(fim.venceu ? 'memoria' : 'toast');
      this.resolver = resolve;
    });
  }

  fechar(): void {
    if (!this.aberta) return;
    this.raiz.classList.remove('show');
    this.som?.('confirma');
    const r = this.resolver;
    this.resolver = null;
    r?.();
  }
}
