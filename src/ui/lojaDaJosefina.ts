import type {
  AcaoNaLoja, ConteudoDaLoja, DecoracaoNaLoja, RoupaNaLoja, SaidaDaLoja,
} from '../minigames/jardim/tela';
import type { SomNome } from '../audio/efeitos';
import { escapar } from './telaDeCartas';

/**
 * O PAINEL DA LOJINHA DA JOSEFINA — a banca no canto da estufa (pedido do
 * Renan: "dentro da lojinha terá algumas abas…").
 *
 * DUAS ABAS hoje, e o desenho aceita mais sem mudar nada além da lista
 * `ABAS`:
 *
 * - **Roupas**: roupa de jardim, com a amostra da cor e o preço. Comprar é
 *   direto; o botão "provar no boneco" fecha a banca e abre a MESMA arara da
 *   boutique (com o boneco de prova) com estas peças — reaproveitar é o que
 *   faz a prova daqui ser igual à de lá.
 * - **Decorações**: os enfeites da estufa, com o retrato do próprio modelo.
 *   Comprar guarda uma unidade; "colocar" fecha a banca e a cena entra no modo
 *   de decorar com aquele enfeite na mão. E "Arrumar os enfeites" é a PORTA
 *   DO MODO DE EDIÇÃO: fora dele, enfeite no chão não tem ponto de interação
 *   nenhum (pedido do Renan — com muitos, as caixinhas de "Mexer no…" se
 *   amontoavam e roubavam o "Regar").
 *
 * COMPRAR NÃO FECHA: o painel chama `agir` e se redesenha com a resposta (o
 * saldo desce, o contador de guardados sobe). Só PROVAR, COLOCAR e ARRUMAR
 * fecham, porque os três levam a dupla para outro lugar.
 */

type Aba = 'roupas' | 'decoracoes';
const ABAS: ReadonlyArray<readonly [Aba, string]> = [['roupas', '👕 Roupas'], ['decoracoes', '🪴 Decorações']];

export class LojaDaJosefina {
  private readonly raiz: HTMLDivElement;
  private readonly prateleira: HTMLDivElement;
  private readonly abas: HTMLDivElement;
  private readonly saldo: HTMLElement;
  private conteudo: ConteudoDaLoja | null = null;
  private retrato: ((id: string) => string) | null = null;
  private agir: ((a: AcaoNaLoja) => ConteudoDaLoja) | null = null;
  private aba: Aba = 'decoracoes';
  private resolver: ((saida: SaidaDaLoja) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="banca">
        <div class="topo">
          <span class="rosto" aria-hidden="true">🐢</span>
          <div class="titulo">
            <h2>Lojinha da Josefina</h2>
            <p class="saldo"></p>
          </div>
          <button class="fechar" aria-label="fechar a lojinha">fechar</button>
        </div>
        <div class="abas" role="tablist"></div>
        <div class="prateleira"></div>
      </div>
    `;
    this.prateleira = raiz.querySelector('.prateleira')!;
    this.abas = raiz.querySelector('.abas')!;
    this.saldo = raiz.querySelector('.saldo')!;
    raiz.querySelector('.fechar')!.addEventListener('click', () => this.fechar());
    this.abas.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-aba]');
      if (!b) return;
      this.aba = b.dataset.aba as Aba;
      this.som?.('menu');
      this.pintar();
      this.prateleira.scrollTop = 0;
    });
    this.prateleira.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-acao]');
      if (!b || b.disabled) return;
      const id = b.dataset.id ?? '';
      const acao = b.dataset.acao;
      if (acao === 'provar') this.sair({ tipo: 'provar' });
      else if (acao === 'colocar') this.sair({ tipo: 'colocar', id });
      else if (acao === 'editar') this.sair({ tipo: 'editar' });
      else if ((acao === 'comprar-roupa' || acao === 'comprar-decoracao') && this.agir) {
        this.conteudo = this.agir({ tipo: acao, id });
        this.pintar();
      }
    });
  }

  get aberta(): boolean {
    return this.raiz.classList.contains('show');
  }

  /**
   * Abre a banca e resolve quando ela fecha (ver `SaidaDaLoja`). `retrato` é
   * a foto de cada enfeite; `agir` faz a compra e devolve o conteúdo novo.
   */
  abrir(
    conteudo: ConteudoDaLoja, retrato: (id: string) => string, agir: (a: AcaoNaLoja) => ConteudoDaLoja,
  ): Promise<SaidaDaLoja> {
    return new Promise((resolve) => {
      this.conteudo = conteudo;
      this.retrato = retrato;
      this.agir = agir;
      this.pintar();
      // a rolagem volta ao topo DEPOIS do `show`: com o painel escondido não
      // existe rolagem, e a banca reabria no meio da lista de antes
      this.raiz.classList.add('show');
      this.prateleira.scrollTop = 0;
      this.som?.('diario');
      this.resolver = resolve;
    });
  }

  private pintar(): void {
    const c = this.conteudo;
    if (!c) return;
    this.saldo.innerHTML = `💰 <b>R$ ${c.saldo}</b> na carteira`;
    this.abas.innerHTML = ABAS.map(([id, rotulo]) => `
      <button role="tab" data-aba="${id}" class="${this.aba === id ? 'ativa' : ''}" aria-selected="${this.aba === id}">${rotulo}</button>`).join('');
    this.prateleira.innerHTML = this.aba === 'roupas' ? this.pintarRoupas(c) : this.pintarDecoracoes(c);
  }

  private botaoDeComprar(acao: string, id: string, preco: number, saldo: number): string {
    return saldo >= preco
      ? `<button class="comprar" data-acao="${acao}" data-id="${escapar(id)}">Comprar · R$ ${preco}</button>`
      : `<button class="comprar" disabled>faltam R$ ${preco - saldo}</button>`;
  }

  private pintarRoupas(c: ConteudoDaLoja): string {
    const cartao = (r: RoupaNaLoja): string => `
      <div class="produto roupa${r.jaTem ? ' ja-tem' : ''}" data-id="${escapar(r.id)}">
        <span class="amostra" style="background:${r.cor}">${r.icone}</span>
        <div class="texto">
          <h4>${escapar(r.nome)}</h4>
          ${r.nota ? `<p>${escapar(r.nota)}</p>` : ''}
        </div>
        ${r.jaTem ? '<span class="selo">✓ é de vocês</span>' : this.botaoDeComprar('comprar-roupa', r.id, r.preco, c.saldo)}
      </div>`;
    return `
      <p class="dica">Roupa de mexer na terra. A que vocês comprarem vai para o guarda-roupa dos dois.
        <button class="provar" data-acao="provar">🪞 provar no boneco</button></p>
      <div class="grade-produtos">${c.roupas.map(cartao).join('')}</div>`;
  }

  private pintarDecoracoes(c: ConteudoDaLoja): string {
    const cartao = (d: DecoracaoNaLoja): string => {
      const foto = this.retrato?.(d.id) ?? '';
      const conta = [
        d.guardadas ? `${d.guardadas} ${d.guardadas === 1 ? 'guardado' : 'guardados'}` : '',
        d.postas ? `${d.postas} na estufa` : '',
      ].filter(Boolean).join(' · ');
      return `
        <div class="produto decoracao" data-id="${escapar(d.id)}">
          <div class="foto">${foto ? `<img src="${foto}" alt="${escapar(d.nome)}">` : d.icone}</div>
          <div class="texto">
            <h4>${escapar(d.nome)}</h4>
            <p>${escapar(d.descricao)}</p>
            ${conta ? `<small class="conta">${conta}</small>` : ''}
          </div>
          <div class="botoes">
            ${this.botaoDeComprar('comprar-decoracao', d.id, d.preco, c.saldo)}
            <button class="colocar" data-acao="colocar" data-id="${escapar(d.id)}" ${d.guardadas ? '' : 'disabled'}>📍 Colocar</button>
          </div>
        </div>`;
    };
    const noChao = c.decoracoes.reduce((s, d) => s + d.postas, 0);
    return `
      <p class="dica">Comprou, toque em <b>Colocar</b>: o enfeite vai na frente de vocês, e é só andar até o lugar —
        dentro da estufa ou no pátio de fora. Os bichos passam por cima, então pode enfeitar até o caminho deles.</p>
      <div class="editar-enfeites">
        <button class="editar" data-acao="editar" ${noChao ? '' : 'disabled'}>✏️ Arrumar os enfeites</button>
        <small>${noChao
          ? `mudar de lugar, girar ou guardar ${noChao === 1 ? 'o que está' : `os ${noChao} que estão`} no chão`
          : 'quando tiver enfeite no chão, é por aqui que se mexe nele'}</small>
      </div>
      <div class="grade-produtos">${c.decoracoes.map(cartao).join('')}</div>`;
  }

  private sair(saida: SaidaDaLoja): void {
    if (!this.aberta) return;
    this.raiz.classList.remove('show');
    this.som?.(saida ? 'confirma' : 'menu');
    const r = this.resolver;
    this.resolver = null;
    r?.(saida);
  }

  fechar(): void {
    this.sair(null);
  }
}
