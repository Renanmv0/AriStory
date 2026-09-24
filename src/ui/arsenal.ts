import type { ArmaNoArsenal, CartaNaTela, ConteudoDoArsenal } from '../minigames/jardim/tela';
import type { SomNome } from '../audio/efeitos';
import { desenharCarta, escapar } from './telaDeCartas';
import { ordemDoLivro } from './livroDeCartas';

/**
 * O PAINEL DO ARSENAL — a bancada ao lado da parede das armas, na estufa.
 *
 * Pedido do Renan: "parecido com o livro inicial: poderíamos clicar em cada
 * arma específica e ver quais cartas já desbloqueamos para ela". Por isso ele
 * É o livro por dentro: a mesma moldura (`.livro-de-cartas`, no CSS), as
 * mesmas abas, a mesma carta (`desenharCarta`) e a mesma vaga cinza — só que
 * uma aba por ARMA, e cada aba abre com o estado dela, a meta para destrancar
 * e o botão de levar essa para a próxima rodada.
 *
 * Resolve com o id da arma que a dupla mandou usar, ou `null` quando só fechou.
 */
const NOME_DA_RARIDADE: Record<string, string> = {
  comum: 'Comuns', incomum: 'Incomuns', raro: 'Raras', lendario: 'Lendárias',
};

export class Arsenal {
  private readonly raiz: HTMLDivElement;
  private readonly paginas: HTMLDivElement;
  private readonly conta: HTMLElement;
  private readonly lupa: HTMLDivElement;
  private readonly abas: HTMLDivElement;
  private conteudo: ConteudoDoArsenal | null = null;
  private vistas: ReadonlySet<string> = new Set();
  private aba = '';
  private cartas: CartaNaTela[] = [];
  private resolver: ((arma: string | null) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="livro">
        <div class="capa">
          <span class="lombada" aria-hidden="true"></span>
          <div class="titulo">
            <h2>🧰 As armas da estufa</h2>
            <p class="conta"></p>
          </div>
          <button class="fechar" aria-label="fechar o painel das armas">fechar</button>
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
      this.aba = b.dataset.aba!;
      this.som?.('menu');
      this.pintar();
    });
    this.paginas.addEventListener('click', (e) => {
      const alvo = e.target as HTMLElement;
      const usar = alvo.closest<HTMLElement>('[data-usar]');
      if (usar) {
        this.usar(usar.dataset.usar!);
        return;
      }
      const el = alvo.closest<HTMLElement>('.carta-jardim');
      if (!el || el.classList.contains('vaga-trancada')) return;
      const c = this.cartas[Number(el.dataset.i)];
      if (c) {
        this.lupa.innerHTML = desenharCarta(c, 0);
        this.lupa.classList.add('show');
        this.som?.('escolha');
      }
    });
    this.lupa.addEventListener('click', () => this.lupa.classList.remove('show'));
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  abrir(conteudo: ConteudoDoArsenal, vistas: ReadonlySet<string>): Promise<string | null> {
    return new Promise((resolve) => {
      this.conteudo = conteudo;
      this.vistas = vistas;
      // abre na arma escolhida
      this.aba = conteudo.armas.find((a) => a.estado === 'escolhida')?.id ?? conteudo.armas[0]?.id ?? '';
      this.pintar();
      this.lupa.classList.remove('show');
      this.raiz.classList.add('show');
      this.som?.('diario');
      this.resolver = resolve;
    });
  }

  private pintar(): void {
    const c = this.conteudo;
    if (!c) return;
    const abertas = c.armas.filter((a) => a.estado !== 'trancada').length;
    this.conta.innerHTML = `<b>${abertas}</b> de ${c.armas.length} armas destrancadas`;
    this.abas.innerHTML = c.armas.map((a) => `
      <button role="tab" data-aba="${escapar(a.id)}" class="${this.aba === a.id ? 'ativa' : ''} ${a.estado}" aria-selected="${this.aba === a.id}">
        ${a.estado === 'trancada' ? '🔒' : a.icone} ${escapar(a.nome)}${a.estado === 'escolhida' ? '<span class="aviso">✓</span>' : ''}
      </button>`).join('');
    const arma = c.armas.find((a) => a.id === this.aba) ?? c.armas[0];
    if (arma) this.pintarArma(arma, c.ondaParaAbrir);
    this.paginas.scrollTop = 0;
  }

  private pintarArma(a: ArmaNoArsenal, ondaParaAbrir: number): void {
    const acao = a.estado === 'escolhida'
      ? '<span class="selo">✓ é esta que vai para a rodada</span>'
      : a.estado === 'aberta'
        ? `<button class="resgatar" data-usar="${escapar(a.id)}">Usar esta arma</button>`
        : a.estado === 'em-construcao'
          ? '<span class="falta">🚧 a Josefina ainda está arrumando esta</span>'
          : `<span class="falta">🔒 ${escapar(a.meta)}</span>`;
    const barra = a.estado === 'trancada'
      ? `<div class="meta-da-arma"><div class="enchido" style="width:${Math.min(100, (a.progresso / ondaParaAbrir) * 100).toFixed(0)}%"></div><span>onda ${a.progresso} de ${ondaParaAbrir}</span></div>`
      : '';
    this.cartas = ordemDoLivro(a.cartas);
    const vistas = this.vistas;
    const achadas = this.cartas.filter((k) => vistas.has(k.id)).length;
    let n = 0;
    const capitulos = ['comum', 'incomum', 'raro', 'lendario'].map((r) => {
      const daRaridade = this.cartas.map((k, i) => ({ k, i })).filter(({ k }) => k.raridade === r);
      if (!daRaridade.length) return '';
      const vagas = daRaridade.map(({ k, i }) => {
        n += 1;
        return vistas.has(k.id)
          ? desenharCarta(k, i)
          : `<div class="carta-jardim vaga-trancada" title="ainda não descoberta"><span class="interrogacao">?</span><span class="numero">${n}</span></div>`;
      }).join('');
      const temDela = daRaridade.filter(({ k }) => vistas.has(k.id)).length;
      return `
        <section class="capitulo r-${r}">
          <h3><span class="pedra" aria-hidden="true"></span>${NOME_DA_RARIDADE[r]} <small>${temDela} de ${daRaridade.length}</small></h3>
          <div class="grade">${vagas}</div>
        </section>`;
    }).join('');
    this.paginas.innerHTML = `
      <section class="capitulo">
        <div class="recompensa arma-no-arsenal ${a.estado === 'trancada' ? 'trancada' : 'pronta'}">
          <span class="icone">${a.estado === 'trancada' ? '🔒' : a.icone}</span>
          <div class="texto">
            <small>${a.recorde > 0 ? `recorde com ela: onda ${a.recorde}` : 'ainda sem rodada com ela'} · ${achadas} de ${this.cartas.length} cartas descobertas</small>
            <h4>${escapar(a.nome)}</h4>
            <p>${escapar(a.descricao)}</p>
            ${barra}
          </div>
          ${acao}
        </div>
      </section>
      ${capitulos}`;
  }

  private usar(id: string): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.som?.('confirma');
    const r = this.resolver;
    this.resolver = null;
    r?.(id);
  }

  fechar(): void {
    if (!this.aberto) return;
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
}
