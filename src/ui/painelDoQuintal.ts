import type { SomNome } from '../audio/efeitos';
import { escapar } from './telaDeCartas';

/**
 * OS DOIS PAINÉIS DO QUINTAL DECORADO (`docs/QUINTAL.md`), numa classe só
 * porque dividem o cartão de produto e o jeito de abrir e fechar:
 *
 * - **o COMPUTADOR do quarto do Ari**: a ÁREA DE TRABALHO (pedido do Renan:
 *   "ao invés de ir direto para o laboratório de testes, abriria um tipo de
 *   área de trabalho onde escolheríamos onde abrir"), com a pasta
 *   `AriStory_teste` (o laboratório) e o **Papita Delivery**, o app de compras
 *   do quintal, em reais da carteira do casal. Pedir NÃO fecha: o app chama
 *   `agir` e se redesenha (o saldo desce, o "a caminho" sobe).
 * - **o BAÚ das ferramentas da garagem**: o que chegou e está guardado, com
 *   "Colocar", e o "Arrumar o quintal" (o modo de edição do decorador).
 *
 * Só a cena sabe do save; o painel desenha o que recebe e devolve a escolha.
 */

export interface ItemDoPapita {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  readonly descricao: string;
  readonly categoria: 'plantas' | 'moveis' | 'chao' | 'alto';
  readonly reais: number;
  readonly aCaminho: number;
  readonly noBau: number;
  readonly noQuintal: number;
  /** um jeito de caminho: compra-se uma vez só, e não vai para o chão pelo baú */
  readonly caminho?: boolean;
}

export interface ConteudoDoComputador {
  /** reais na carteira do casal */
  readonly saldo: number;
  readonly itens: readonly ItemDoPapita[];
}

/** como o computador fechou: desligado (`null`) ou abrindo a pasta do laboratório */
export type SaidaDoComputador = null | { readonly tipo: 'laboratorio' };

export interface ItemNoBau {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  readonly descricao: string;
  readonly guardadas: number;
}

/** um jeito de caminho que é da dupla, e se é o que está no chão agora */
export interface CaminhoNoBau {
  readonly id: string;
  readonly nome: string;
  readonly icone: string;
  readonly ativo: boolean;
}

export interface ConteudoDoBau {
  readonly itens: readonly ItemNoBau[];
  /** os caminhos que são da dupla (o de lajes sempre) */
  readonly caminhos: readonly CaminhoNoBau[];
  /** a hera está nos muros? */
  readonly hera: boolean;
  /** quantos enfeites estão no chão do quintal */
  readonly noQuintal: number;
  /** quantos ainda estão no correio */
  readonly aCaminho: number;
}

export type SaidaDoBau =
  | null
  | { readonly tipo: 'colocar'; readonly id: string }
  | { readonly tipo: 'editar' }
  /** trocar o caminho da casa por este */
  | { readonly tipo: 'caminho'; readonly id: string }
  /** tirar a hera dos muros, ou pôr de volta */
  | { readonly tipo: 'hera' };

type Aba = 'plantas' | 'moveis' | 'chao' | 'alto' | 'casa';
const ABAS: ReadonlyArray<readonly [Aba, string]> = [['plantas', '🌿 Plantas'], ['moveis', '🪑 Móveis'], ['chao', '🪨 Chão'], ['alto', '🖼️ No alto'], ['casa', '🏠 Para casa']];

export class PainelDoQuintal {
  private readonly raiz: HTMLDivElement;
  private modo: 'area-de-trabalho' | 'papita' | 'bau' = 'area-de-trabalho';
  private aba: Aba = 'plantas';
  private computador: ConteudoDoComputador | null = null;
  private bau: ConteudoDoBau | null = null;
  private agir: ((id: string) => ConteudoDoComputador) | null = null;
  private retrato: ((id: string) => string) | null = null;
  private resolver: ((saida: SaidaDoComputador | SaidaDoBau) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.addEventListener('click', (e) => {
      const alvo = (e.target as HTMLElement).closest<HTMLElement>('[data-acao]');
      if (!alvo || (alvo as HTMLButtonElement).disabled) return;
      e.stopPropagation();
      const acao = alvo.dataset.acao;
      const id = alvo.dataset.id ?? '';
      if (acao === 'fechar') this.sair(null);
      else if (acao === 'laboratorio') this.sair({ tipo: 'laboratorio' });
      else if (acao === 'papita') {
        this.modo = 'papita';
        this.som?.('diario');
        this.pintar();
      } else if (acao === 'voltar') {
        this.modo = 'area-de-trabalho';
        this.som?.('menu');
        this.pintar();
      } else if (acao === 'aba') {
        this.aba = id as Aba;
        this.som?.('menu');
        this.pintar();
      } else if (acao === 'pedir' && this.agir) {
        this.computador = this.agir(id);
        this.pintar();
      } else if (acao === 'colocar') this.sair({ tipo: 'colocar', id });
      else if (acao === 'editar') this.sair({ tipo: 'editar' });
      else if (acao === 'caminho') this.sair({ tipo: 'caminho', id });
      else if (acao === 'hera') this.sair({ tipo: 'hera' });
    });
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  /** A tela do computador, na área de trabalho. */
  abrirComputador(
    conteudo: ConteudoDoComputador, retrato: (id: string) => string, agir: (id: string) => ConteudoDoComputador,
  ): Promise<SaidaDoComputador> {
    this.computador = conteudo;
    this.retrato = retrato;
    this.agir = agir;
    this.modo = 'area-de-trabalho';
    return this.abrir() as Promise<SaidaDoComputador>;
  }

  /** O baú das ferramentas da garagem. */
  abrirBau(conteudo: ConteudoDoBau, retrato: (id: string) => string): Promise<SaidaDoBau> {
    this.bau = conteudo;
    this.retrato = retrato;
    this.modo = 'bau';
    return this.abrir() as Promise<SaidaDoBau>;
  }

  private abrir(): Promise<SaidaDoComputador | SaidaDoBau> {
    return new Promise((resolve) => {
      this.pintar();
      this.raiz.classList.add('show');
      this.som?.(this.modo === 'bau' ? 'diario' : 'clique');
      this.resolver = resolve;
    });
  }

  fechar(): void {
    this.sair(null);
  }

  private sair(saida: SaidaDoComputador | SaidaDoBau): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.som?.(saida ? 'confirma' : 'menu');
    const r = this.resolver;
    this.resolver = null;
    r?.(saida);
  }

  private pintar(): void {
    this.raiz.dataset.modo = this.modo;
    if (this.modo === 'bau') this.raiz.innerHTML = this.pintarBau();
    else this.raiz.innerHTML = `
      <div class="monitor">
        <div class="tela">${this.modo === 'papita' ? this.pintarPapita() : this.pintarAreaDeTrabalho()}</div>
        <div class="barra-de-tarefas">
          <span class="iniciar">✦</span>
          ${this.modo === 'papita' ? '<span class="aberto">🥔 Papita Delivery</span>' : ''}
          <span class="relogio">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          <button class="desligar" data-acao="fechar" aria-label="sair do computador">⏻ sair</button>
        </div>
      </div>`;
    const prateleira = this.raiz.querySelector('.prateleira');
    if (prateleira) prateleira.scrollTop = 0;
  }

  private pintarAreaDeTrabalho(): string {
    const icone = (rosto: string, nome: string, acao: string | null, classe = ''): string => acao
      ? `<button class="icone ${classe}" data-acao="${acao}"><span class="figura">${rosto}</span><span class="nome">${nome}</span></button>`
      : `<div class="icone enfeite"><span class="figura">${rosto}</span><span class="nome">${nome}</span></div>`;
    return `
      <div class="area-de-trabalho">
        ${icone('📁', 'fotos', null)}
        ${icone('📁', 'músicas', null)}
        ${icone('🗂️', 'AriStory_teste', 'laboratorio', 'pasta-do-lab')}
        ${icone('🥔', 'Papita Delivery', 'papita', 'papita')}
      </div>`;
  }

  private pintarPapita(): string {
    const c = this.computador;
    if (!c) return '';
    const cartao = (it: ItemDoPapita): string => {
      const foto = this.retrato?.(it.id) ?? '';
      const conta = [
        it.aCaminho ? `📦 ${it.aCaminho} a caminho` : '',
        it.noBau ? `🧰 ${it.noBau} no baú` : '',
        it.noQuintal ? `🏡 ${it.noQuintal} no quintal` : '',
      ].filter(Boolean).join(' · ');
      const pode = c.saldo >= it.reais;
      // o caminho se compra uma vez: depois o cartão diz que é de vocês
      if (it.caminho && (it.aCaminho || it.noBau)) {
        return `
        <div class="produto" data-id="${escapar(it.id)}">
          <div class="foto">${foto ? `<img src="${foto}" alt="${escapar(it.nome)}">` : it.icone}</div>
          <div class="texto"><h4>${escapar(it.nome)}</h4><p>${escapar(it.descricao)}</p></div>
          <span class="selo">${it.aCaminho ? '📦 a caminho' : '✓ é de vocês — troca-se nas ferramentas da garagem'}</span>
        </div>`;
      }
      return `
        <div class="produto" data-id="${escapar(it.id)}">
          <div class="foto">${foto ? `<img src="${foto}" alt="${escapar(it.nome)}">` : it.icone}</div>
          <div class="texto">
            <h4>${escapar(it.nome)}</h4>
            <p>${escapar(it.descricao)}</p>
            ${conta ? `<small class="conta">${conta}</small>` : ''}
          </div>
          ${pode
            ? `<button class="pedir" data-acao="pedir" data-id="${escapar(it.id)}">Pedir · R$ ${it.reais}</button>`
            : `<button class="pedir" disabled>faltam R$ ${it.reais - c.saldo}</button>`}
        </div>`;
    };
    const abas = ABAS.map(([id, rotulo]) => `
      <button data-acao="aba" data-id="${id}" class="${this.aba === id ? 'ativa' : ''}" aria-selected="${this.aba === id}">${rotulo}${id === 'casa' ? ' <small>em breve</small>' : ''}</button>`).join('');
    const naCaixa = c.itens.reduce((s, it) => s + it.aCaminho, 0);
    return `
      <div class="janela papita-delivery">
        <div class="titulo-da-janela">
          <button class="voltar" data-acao="voltar" aria-label="voltar para a área de trabalho">←</button>
          <span class="logo"><span class="batata">🥔</span> <b>Papita</b> Delivery</span>
          <span class="saldo">💰 <b>R$ ${c.saldo}</b></span>
        </div>
        <div class="abas" role="tablist">${abas}</div>
        <div class="prateleira">
          ${this.aba === 'casa'
            ? '<p class="em-breve">🏠 Em breve: coisas para a casa por dentro.</p>'
            : `<p class="dica">Entrega pelo correio: o pedido chega numa caixa no portão de casa. É só abrir a caixa e pegar as ferramentas da garagem para decorar.
                ${naCaixa ? `<b>📦 ${naCaixa} ${naCaixa === 1 ? 'item a caminho' : 'itens a caminho'}.</b>` : ''}</p>
              <div class="grade-produtos">${c.itens.filter((it) => it.categoria === this.aba).map(cartao).join('')}</div>`}
        </div>
      </div>`;
  }

  private pintarBau(): string {
    const c = this.bau;
    if (!c) return '';
    const cartao = (it: ItemNoBau): string => {
      const foto = this.retrato?.(it.id) ?? '';
      return `
        <div class="produto" data-id="${escapar(it.id)}">
          <div class="foto">${foto ? `<img src="${foto}" alt="${escapar(it.nome)}">` : it.icone}</div>
          <div class="texto">
            <h4>${escapar(it.nome)}</h4>
            <small class="conta">${it.guardadas} no baú</small>
          </div>
          <button class="pedir" data-acao="colocar" data-id="${escapar(it.id)}">📍 Colocar</button>
        </div>`;
    };
    return `
      <div class="caixa-de-ferramentas">
        <div class="topo">
          <span class="rosto" aria-hidden="true">🧰</span>
          <div class="titulo"><h2>Ferramentas de jardim</h2><p>o que está guardado para o quintal</p></div>
          <button class="fechar" data-acao="fechar">fechar</button>
        </div>
        <div class="prateleira">
          <div class="editar-enfeites">
            <button class="editar" data-acao="editar" ${c.noQuintal ? '' : 'disabled'}>✏️ Arrumar o quintal</button>
            <small>${c.noQuintal
              ? `mudar de lugar, girar ou guardar ${c.noQuintal === 1 ? 'o que está' : `os ${c.noQuintal} que estão`} no quintal`
              : 'quando tiver coisa no quintal, é por aqui que se mexe nela'}</small>
          </div>
          <div class="caminhos-e-hera">
            <div class="linha"><b>🛤️ O caminho da casa</b>
              ${c.caminhos.map((k) => `<button class="${k.ativo ? 'ativo' : ''}" data-acao="caminho" data-id="${escapar(k.id)}" ${k.ativo ? 'disabled' : ''}>${k.icone} ${escapar(k.nome.replace(/^Caminho de /, ''))}${k.ativo ? ' ✓' : ''}</button>`).join('')}
            </div>
            <div class="linha"><b>🌿 A hera dos muros</b>
              <button data-acao="hera">${c.hera ? 'Tirar a hera' : 'Pôr a hera de volta'}</button>
            </div>
          </div>
          ${c.itens.length
            ? `<div class="grade-produtos">${c.itens.map(cartao).join('')}</div>`
            : `<p class="vazio">O baú está vazio. ${c.aCaminho
              ? '📦 Tem encomenda chegando: olhem no portão.'
              : 'As coisas do quintal se pedem no <b>Papita Delivery</b>, pelo computador do quarto.'}</p>`}
        </div>
      </div>`;
  }
}
