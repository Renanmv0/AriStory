import type { CartaNaTela, ConteudoDoLivro, FimDoJardim, PragaNoLivro, RecompensaNoLivro } from '../minigames/jardim/tela';
import type { Raridade } from '../minigames/jardim/cartas';
import type { SomNome } from '../audio/efeitos';
import { desenharCarta, escapar } from './telaDeCartas';

/**
 * O LIVRO DA ESTUFA e A TELA DO FIM DA RODADA — as páginas que mostram cartas
 * SEM escolher nenhuma.
 *
 * As duas desenham a carta com o MESMO `desenharCarta` da tela de escolha:
 * a carta que a dupla guardou no livro é a mesma que ela pegou na mesa, e o
 * celular ganha de graça as faixas deitadas que aquela tela já tem.
 *
 * ================================================= O LIVRO (pedido do Renan)
 *
 * Três ABAS, cada uma uma coleção que atravessa as rodadas:
 *
 * - **Cartas**: toda carta do baralho tem um LUGAR próprio, na ordem da
 *   raridade (comum → lendária, e dentro dela a ordem do catálogo). Carta que
 *   a dupla ainda não escolheu é um retângulo cinza translúcido com o número;
 *   a escolhida aparece inteira, e um toque nela abre em tamanho grande (a
 *   lupa), porque no livro elas vão menores.
 * - **Pragas**: cinza até a primeira vez que a praga aparece numa rodada; aí
 *   o retrato (o modelo 3D fotografado), o nome, o tier e o jeito dela.
 * - **Recompensas**: os marcos de onda, com o prêmio único de cada um e o
 *   bônus em moedas. O marco alcançado ganha um botão RESGATAR — e o livro
 *   fecha devolvendo qual, para a cena fazer a entrega (a Josefina).
 */

const ORDEM: readonly Raridade[] = ['comum', 'incomum', 'raro', 'lendario'];
const NOME_DA_RARIDADE: Record<Raridade, string> = {
  comum: 'Comuns', incomum: 'Incomuns', raro: 'Raras', lendario: 'Lendárias',
};

type Aba = 'cartas' | 'pragas' | 'recompensas';

/** as cartas do baralho na ordem do livro: por raridade, e na ordem do catálogo dentro dela */
export function ordemDoLivro(cartas: readonly CartaNaTela[]): CartaNaTela[] {
  return ORDEM.flatMap((r) => cartas.filter((c) => c.raridade === r && !c.consolo));
}

export class LivroDeCartas {
  private readonly raiz: HTMLDivElement;
  private readonly paginas: HTMLDivElement;
  private readonly conta: HTMLElement;
  private readonly lupa: HTMLDivElement;
  private readonly abas: HTMLDivElement;
  private cartas: CartaNaTela[] = [];
  private vistas: ReadonlySet<string> = new Set();
  private conteudo: ConteudoDoLivro | null = null;
  private retrato: ((id: string) => string) | null = null;
  private aba: Aba = 'cartas';
  private resolver: ((resgate: string | null) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="livro">
        <div class="capa">
          <span class="lombada" aria-hidden="true"></span>
          <div class="titulo">
            <h2>📖 Livro da estufa</h2>
            <p class="conta"></p>
          </div>
          <button class="fechar" aria-label="fechar o livro">fechar</button>
        </div>
        <div class="abas" role="tablist"></div>
        <div class="paginas"></div>
      </div>
      <div class="lupa" aria-hidden="true"></div>
    `;
    this.paginas = raiz.querySelector('.paginas')!;
    this.conta = raiz.querySelector('.conta')!;
    this.lupa = raiz.querySelector('.lupa')!;
    this.abas = raiz.querySelector('.abas')!;
    raiz.querySelector('.fechar')!.addEventListener('click', () => this.fechar());
    this.abas.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-aba]');
      if (!b) return;
      this.aba = b.dataset.aba as Aba;
      this.som?.('menu');
      this.pintar();
    });
    this.paginas.addEventListener('click', (e) => {
      const alvo = e.target as HTMLElement;
      const resgatar = alvo.closest<HTMLElement>('[data-resgatar]');
      if (resgatar) {
        this.resgatar(resgatar.dataset.resgatar!);
        return;
      }
      const el = alvo.closest<HTMLElement>('.carta-jardim');
      if (!el || this.aba !== 'cartas') return;
      const c = this.cartas[Number(el.dataset.i)];
      if (c) this.ampliar(c);
    });
    // a lupa fecha com qualquer toque
    this.lupa.addEventListener('click', () => this.lupa.classList.remove('show'));
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  /**
   * Abre o livro e resolve quando fecha: com `null`, ou com a ONDA do marco
   * que a dupla mandou resgatar. `vistas` são as ids das cartas já
   * desbloqueadas; sem `conteudo`, o livro só tem a aba das cartas.
   */
  abrir(
    todas: readonly CartaNaTela[], vistas: ReadonlySet<string>,
    conteudo: ConteudoDoLivro | null = null, retrato: ((id: string) => string) | null = null,
  ): Promise<string | null> {
    return new Promise((resolve) => {
      this.cartas = ordemDoLivro(todas);
      this.vistas = vistas;
      this.conteudo = conteudo;
      this.retrato = retrato;
      // com recompensa esperando, o livro abre direto nela
      if (conteudo?.recompensas.some((r) => r.estado === 'pronta')) this.aba = 'recompensas';
      else if (!conteudo) this.aba = 'cartas';
      this.pintar();
      this.lupa.classList.remove('show');
      this.raiz.classList.add('show');
      this.som?.('diario');
      this.resolver = resolve;
    });
  }

  private pintar(): void {
    const c = this.conteudo;
    const prontas = c?.recompensas.filter((r) => r.estado === 'pronta').length ?? 0;
    const botoes: Array<[Aba, string]> = [['cartas', '🃏 Cartas']];
    if (c) botoes.push(['pragas', '🐛 Pragas'], ['recompensas', '🏆 Recompensas']);
    this.abas.innerHTML = botoes.map(([id, rotulo]) => `
      <button role="tab" data-aba="${id}" class="${this.aba === id ? 'ativa' : ''}" aria-selected="${this.aba === id}">
        ${rotulo}${id === 'recompensas' && prontas ? `<span class="aviso">${prontas}</span>` : ''}
      </button>`).join('');
    this.abas.style.display = c ? '' : 'none';
    if (this.aba === 'pragas' && c) this.pintarPragas(c.pragas);
    else if (this.aba === 'recompensas' && c) this.pintarRecompensas(c);
    else this.pintarCartas();
    this.paginas.scrollTop = 0;
  }

  private pintarCartas(): void {
    const vistas = this.vistas;
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
  }

  private pintarPragas(pragas: readonly PragaNoLivro[]): void {
    const vistas = pragas.filter((p) => p.vista).length;
    this.conta.innerHTML = `<b>${vistas}</b> de ${pragas.length} pragas vistas`;
    const fichas = pragas.map((p, i) => {
      if (!p.vista) {
        return `<div class="praga-no-livro trancada" title="ainda não apareceu">
          <span class="interrogacao">?</span><span class="numero">${i + 1}</span></div>`;
      }
      const foto = this.retrato?.(p.id) ?? '';
      return `<div class="praga-no-livro" data-praga="${escapar(p.id)}">
        <div class="foto">${foto ? `<img src="${foto}" alt="${escapar(p.nome)}">` : ''}</div>
        <div class="texto">
          <h4>${escapar(p.nome)} <span class="tier t-${escapar(p.tier)}">${escapar(p.tier)}</span></h4>
          <p class="mistura">${escapar(p.mistura)}</p>
          <p>${escapar(p.descricao)}</p>
        </div>
      </div>`;
    }).join('');
    this.paginas.innerHTML = `<section class="capitulo"><div class="grade-pragas">${fichas}</div></section>`;
  }

  private pintarRecompensas(c: ConteudoDoLivro): void {
    const ganhas = c.recompensas.filter((r) => r.estado === 'resgatada').length;
    this.conta.innerHTML = `<b>${ganhas}</b> de ${c.recompensas.length} recompensas · recorde: onda ${c.recorde}`;
    const linha = (r: RecompensaNoLivro): string => {
      const acao = r.estado === 'pronta'
        ? `<button class="resgatar" data-resgatar="${r.onda}">Resgatar</button>`
        : r.estado === 'resgatada'
          ? '<span class="selo">✓ resgatada</span>'
          : `<span class="falta">vençam a onda ${r.onda}</span>`;
      return `<div class="recompensa ${r.estado}">
        <span class="icone">${r.estado === 'trancada' ? '🔒' : r.icone}</span>
        <div class="texto">
          <small>Onda ${r.onda} · +R$ ${r.moedas} em toda rodada que chegar aqui</small>
          <h4>${escapar(r.nome)}</h4>
          <p>${escapar(r.descricao)}</p>
        </div>
        ${acao}
      </div>`;
    };
    this.paginas.innerHTML = `
      <section class="capitulo">
        <p class="moedas-da-rodada">💰 Toda rodada paga <b>R$ ${c.moedasPorOnda}</b> por onda vencida, mais o bônus de cada marco alcançado. O prêmio de cada marco é de uma vez só: resgate aqui.</p>
        <div class="lista-recompensas">${c.recompensas.map(linha).join('')}</div>
      </section>`;
  }

  private resgatar(onda: string): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.som?.('confirma');
    const r = this.resolver;
    this.resolver = null;
    r?.(onda);
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
    r?.(null);
  }

  private ampliar(c: CartaNaTela): void {
    this.lupa.innerHTML = desenharCarta(c, 0);
    this.lupa.classList.add('show');
    this.som?.('escolha');
  }
}

/**
 * A TELA DO FIM DA RODADA: venceu (as trinta ondas) ou a estufa caiu. Mostra
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
      /*
       * O PAGAMENTO e os PRÊMIOS ÚNICOS (`minigames/jardim/premios.ts`): toda
       * rodada paga, e o marco alcançado pela primeira vez ganha um selo.
       */
      const pg = fim.pagamento;
      const pago = pg && pg.total > 0
        ? `<div class="pagamento">
            <b>💰 +R$ ${pg.total}</b> na carteira
            <small>${pg.vencidas} ${pg.vencidas === 1 ? 'onda vencida' : 'ondas vencidas'} × R$ ${pg.vencidas ? pg.porOnda / pg.vencidas : 0}${pg.bonus ? ` · bônus dos marcos R$ ${pg.bonus}` : ''}</small>
          </div>`
        : '';
      const marcos = (fim.marcos ?? []).length
        ? `<div class="marcos">${(fim.marcos ?? []).map((m) => `
            <div class="marco"><span class="icone">${m.icone}</span><span><small>Onda ${m.onda} pela primeira vez · resgate no livro da bancada 📖</small>${escapar(m.nome)}</span></div>`).join('')}
          </div>`
        : '';
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
          ${pago}
          ${marcos}
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
