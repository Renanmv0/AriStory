import type { SlotRoupa } from '../core/types';
import { SLOTS_ROUPA } from '../core/types';
import { CARTELA_DE_TINTAS, nomeDaTinta, type ParteDaTinta } from '../world/tintas';
import { escapar } from './telaDeCartas';

/**
 * O ATELIÊ DE TINGIMENTO — o menu do balcão de tinta, no mezanino da boutique
 * da Estella.
 *
 * Pedido do Renan: "um menu bem intuitivo e muito bem feito, onde ficaria o
 * nosso modelo sempre à vista, igual é nos locais de trocar a roupa". Por
 * isso ele NÃO é um painel novo: é um modo do painel do guarda-roupa
 * (`Ui.abrirArmario('atelie')`), e herda dele o boneco parado num palco, a
 * lista que rola sozinha, o filtro por parte do corpo, os nomes dos dois no
 * alto e a rolagem que não pula. Este arquivo desenha só o que é do ateliê:
 *
 *   1. a LISTA DE PEÇAS — as roupas da pessoa que se pintam, por parte do
 *      corpo, cada cartão com a cor de hoje (e o canto do detalhe);
 *   2. a FICHA ao lado do boneco — a peça escolhida, os dois botões grandes
 *      "Cor principal" e "Detalhes" (cada um com a amostra da cor que está
 *      nela agora; o de detalhes só aparece se a peça tiver detalhe), voltar
 *      à cor original e vestir;
 *   3. a CARTELA — escolhida a peça, a lista vira a cartela de tintas (57,
 *      em sete famílias); um toque pinta, e o boneco muda na hora.
 *
 * Antes de pagar (R$ 50, uma vez só), a lista é o CARTAZ do ateliê com a
 * fita de todas as cores, e a ficha tem o botão de desbloquear.
 */

/** uma roupa da pessoa, como o cartão da lista mostra */
export interface PecaNoAtelie {
  id: string;
  nome: string;
  icone: string;
  slot: SlotRoupa;
  /** a cor principal de hoje, em CSS (com a tinta, se houver) */
  cor: string;
  /** a cor do detalhe de hoje, em CSS; `null` quando a peça não tem detalhe */
  detalhe: string | null;
  /** já passou pelo ateliê (alguma parte pintada) */
  pintada: boolean;
  vestida: boolean;
}

/** a peça escolhida, para a ficha e a cartela */
export interface EscolhaNoAtelie {
  id: string;
  nome: string;
  icone: string;
  nota?: string;
  /** a peça tem detalhe que se pinta */
  temDetalhe: boolean;
  /** a parte que a cartela está pintando agora */
  parte: ParteDaTinta;
  cor: number;
  corOriginal: number;
  detalhe: number | null;
  detalheOriginal: number | null;
  vestida: boolean;
}

export interface ConteudoDoAtelie {
  dono: string;
  saldo: number;
  preco: number;
  desbloqueado: boolean;
  pecas: readonly PecaNoAtelie[];
  escolhida: EscolhaNoAtelie | null;
}

/** o nome de cada parte do corpo, na ordem de `SLOTS_ROUPA` (o mesmo do Ui) */
const PARTES = ['Cabeça', 'Tronco', 'Pernas', 'Pés', 'Mãos', 'Acessório'];

const css = (cor: number): string => `#${cor.toString(16).padStart(6, '0')}`;

/** a tinta pelo nome; a cor que não é da cartela é a original da peça */
const nomeDaCor = (cor: number, original: number | null): string =>
  cor === original ? 'cor original' : nomeDaTinta(cor) ?? 'cor original';

/**
 * Em que tela a lista está: as peças, a cartela, ou o cartaz (antes de pagar).
 * O Ui usa para saber quando a lista mudou de tela e tem que voltar ao alto.
 */
export type VistaDoAtelie = 'cartaz' | 'pecas' | 'cartela';

export class PainelDoAtelie {
  /** a ficha ao lado do boneco */
  private readonly ficha: HTMLElement;
  /** as três telas da lista */
  private readonly cartaz: HTMLElement;
  private readonly pecas: HTMLElement;
  private readonly cartela: HTMLElement;
  private vistaAtual: VistaDoAtelie = 'pecas';

  /** escolheu uma peça da lista (ou `null`: voltou para a lista) */
  onEscolher: ((id: string | null) => void) | null = null;
  /** escolheu a parte que a cartela pinta */
  onParte: ((parte: ParteDaTinta) => void) | null = null;
  /** tocou numa tinta (`null` é a cor original da parte) */
  onPintar: ((cor: number | null) => void) | null = null;
  onDesbloquear: (() => void) | null = null;
  onVestir: (() => void) | null = null;

  constructor(armario: HTMLElement) {
    this.ficha = armario.querySelector('.atelie-ficha')!;
    this.cartaz = armario.querySelector('.atelie-cartaz')!;
    this.pecas = armario.querySelector('.atelie-pecas')!;
    this.cartela = armario.querySelector('.atelie-cartela')!;
    this.montarCartela();
    this.montarCartaz();

    // UM ouvinte por bloco, e não um por botão: tudo é redesenhado a cada
    // pincelada (o mesmo padrão da vitrine da Estella)
    this.pecas.addEventListener('click', (e) => {
      const id = (e.target as HTMLElement).closest<HTMLElement>('.peca-tingivel')?.dataset.id;
      if (id) this.onEscolher?.(id);
    });
    this.cartela.addEventListener('click', (e) => {
      const alvo = e.target as HTMLElement;
      if (alvo.closest('.voltar')) {
        this.onEscolher?.(null);
        return;
      }
      const parte = alvo.closest<HTMLElement>('[data-parte-da-tinta]')?.dataset.parteDaTinta;
      if (parte === 'cor' || parte === 'detalhe') {
        this.onParte?.(parte);
        return;
      }
      const tinta = alvo.closest<HTMLButtonElement>('.tinta');
      if (!tinta || tinta.disabled) return;
      this.onPintar?.(tinta.dataset.cor === 'original' ? null : Number(tinta.dataset.cor));
    });
    this.ficha.addEventListener('click', (e) => {
      const alvo = e.target as HTMLElement;
      const parte = alvo.closest<HTMLElement>('[data-parte-da-tinta]')?.dataset.parteDaTinta;
      if (parte === 'cor' || parte === 'detalhe') this.onParte?.(parte);
      else if (alvo.closest('.desbloquear')) this.onDesbloquear?.();
      else if (alvo.closest('.original')) this.onPintar?.(null);
      else if (alvo.closest('.vestir-agora')) this.onVestir?.();
      else if (alvo.closest('.outra-peca')) this.onEscolher?.(null);
    });
  }

  get vista(): VistaDoAtelie {
    return this.vistaAtual;
  }

  /**
   * A CARTELA é montada uma vez só (as tintas não mudam); cada desenho só
   * marca qual está na peça e escreve o cabeçalho.
   */
  private montarCartela(): void {
    const familias = CARTELA_DE_TINTAS.map((f) => `
      <section class="familia">
        <h4>${escapar(f.nome)} <span>${f.tintas.length}</span></h4>
        <div class="tintas">${f.tintas.map((t) => `
          <button class="tinta" data-cor="${t.cor}" data-tinta="${t.id}" style="--cor:${css(t.cor)}"
            title="${escapar(t.nome)}" aria-label="${escapar(t.nome)}"><i></i><span>${escapar(t.nome)}</span></button>`).join('')}
        </div>
      </section>`).join('');
    this.cartela.innerHTML = `
      <div class="cartela-topo">
        <button class="voltar">← Peças</button>
        <div class="partes" role="group" aria-label="o que pintar"></div>
      </div>
      <p class="pintando"></p>
      <button class="tinta original" data-cor="original"><i></i><span>Cor original</span></button>
      ${familias}`;
  }

  /** O cartaz de antes de pagar: o convite, e a fita de todas as tintas. */
  private montarCartaz(): void {
    const fita = CARTELA_DE_TINTAS.flatMap((f) => f.tintas)
      .map((t) => `<i style="--cor:${css(t.cor)}" title="${escapar(t.nome)}"></i>`).join('');
    this.cartaz.innerHTML = `
      <div class="convite">
        <span class="pote" aria-hidden="true">🎨</span>
        <h4>O ateliê de tingimento da Estella</h4>
        <p>Escolha uma roupa, escolha a cor e pronto: a peça sai pintada,
        com os detalhes do jeito que eram — ou pintados também, se ela tiver.</p>
        <ul>
          <li><b>57 tintas</b>, dos pastéis aos escuros</li>
          <li><b>cor principal ou detalhes</b>, cada um do seu jeito</li>
          <li><b>cada um pinta as suas</b>: a calça do Ari e a do Renan são duas</li>
          <li>dá para <b>voltar à cor original</b> quando quiser</li>
        </ul>
        <p class="uma-vez">Paga-se <b>uma vez só</b>, e o ateliê fica aberto para sempre.</p>
      </div>
      <div class="fita-de-cores" aria-hidden="true">${fita}</div>`;
  }

  /** Desenha tudo. Devolve a tela em que a lista ficou. */
  render(d: ConteudoDoAtelie): VistaDoAtelie {
    this.vistaAtual = !d.desbloqueado ? 'cartaz' : d.escolhida ? 'cartela' : 'pecas';
    this.cartaz.hidden = this.vistaAtual !== 'cartaz';
    this.pecas.hidden = this.vistaAtual !== 'pecas';
    this.cartela.hidden = this.vistaAtual !== 'cartela';
    this.desenharFicha(d);
    if (this.vistaAtual === 'pecas') this.desenharPecas(d);
    if (this.vistaAtual === 'cartela' && d.escolhida) this.desenharCartela(d.escolhida);
    return this.vistaAtual;
  }

  /** quantas peças há em cada parte do corpo (para o filtro do Ui) */
  static contar(pecas: readonly PecaNoAtelie[]): number[] {
    return SLOTS_ROUPA.map((slot) => pecas.filter((p) => p.slot === slot).length);
  }

  private desenharPecas(d: ConteudoDoAtelie): void {
    if (d.pecas.length === 0) {
      this.pecas.innerHTML = `<p class="nada">Nenhuma roupa para tingir ainda. Os prêmios e os
        uniformes ficam com as cores deles — compre uma peça na boutique e volte aqui.</p>`;
      return;
    }
    this.pecas.innerHTML = SLOTS_ROUPA.map((slot, i) => {
      const doSlot = d.pecas.filter((p) => p.slot === slot);
      if (doSlot.length === 0) return '';
      return `
        <section class="grupo" data-slot="${slot}">
          <h4>${PARTES[i]} <span>${doSlot.length}</span></h4>
          <div class="pecas">${doSlot.map((p) => `
            <button class="peca peca-tingivel${p.pintada ? ' pintada' : ''}${p.vestida ? ' vestida' : ''}" data-id="${escapar(p.id)}">
              <span class="icone" style="--cor:${p.cor};${p.detalhe ? `--detalhe:${p.detalhe}` : ''}"${p.detalhe ? ' data-com-detalhe' : ''}>${p.icone}</span>
              <b>${escapar(p.nome)}</b>
              ${p.pintada || p.vestida ? `<em>${p.pintada ? '🎨 pintada' : ''}${p.pintada && p.vestida ? ' · ' : ''}${p.vestida ? 'vestindo' : ''}</em>` : ''}
            </button>`).join('')}
          </div>
        </section>`;
    }).join('');
  }

  /** os dois botões grandes de parte (na ficha e no alto da cartela) */
  private botoesDeParte(e: EscolhaNoAtelie): string {
    const botao = (parte: ParteDaTinta, rotulo: string, cor: number, original: number | null): string => `
      <button class="parte-da-tinta${e.parte === parte ? ' ativa' : ''}" data-parte-da-tinta="${parte}"
        aria-pressed="${e.parte === parte}">
        <i style="--cor:${css(cor)}"></i>
        <span><b>${rotulo}</b><small>${escapar(nomeDaCor(cor, original))}</small></span>
      </button>`;
    return botao('cor', 'Cor principal', e.cor, e.corOriginal) +
      (e.temDetalhe && e.detalhe !== null ? botao('detalhe', 'Detalhes', e.detalhe, e.detalheOriginal) : '');
  }

  private desenharFicha(d: ConteudoDoAtelie): void {
    const f = this.ficha;
    f.dataset.estado = !d.desbloqueado ? 'trancado' : d.escolhida ? 'peca' : 'vazio';
    if (!d.desbloqueado) {
      const falta = d.preco - d.saldo;
      f.innerHTML = `
        <p class="saldo">💰 <b>R$ ${d.saldo}</b> <small>na carteira</small></p>
        <b class="nome">🎨 Ateliê de tingimento</b>
        <small class="nota">pague uma vez e pinte quantas roupas quiser</small>
        <span class="preco">R$ ${d.preco}</span>
        <button class="desbloquear"${falta > 0 ? ' disabled' : ''}>${falta > 0 ? `Faltam R$ ${falta}` : `Abrir o ateliê por R$ ${d.preco}`}</button>
        <p class="aviso">${falta > 0 ? 'A Estella não tinge fiado. Nem para vocês.' : ''}</p>`;
      return;
    }
    const e = d.escolhida;
    if (!e) {
      f.innerHTML = `
        <b class="nome">Escolha uma roupa</b>
        <small class="nota">toque numa peça da lista: ela aparece no boneco, e a cartela de tintas abre</small>
        <p class="dica-atelie">Os prêmios dos personagens e os uniformes ficam com as cores deles.</p>`;
      return;
    }
    const pintada = e.cor !== e.corOriginal || (e.detalhe !== null && e.detalhe !== e.detalheOriginal);
    f.innerHTML = `
      <div class="peca-escolhida">
        <span class="icone" style="--cor:${css(e.cor)}">${e.icone}</span>
        <span><b class="nome">${escapar(e.nome)}</b>${e.nota ? `<small class="nota">${escapar(e.nota)}</small>` : ''}</span>
      </div>
      <div class="partes" role="group" aria-label="o que pintar">${this.botoesDeParte(e)}</div>
      ${e.temDetalhe ? '' : '<p class="so-principal">esta peça só tem a cor principal</p>'}
      <div class="acoes">
        <button class="original"${pintada ? '' : ' disabled'}>↺ ${e.temDetalhe ? 'Original desta parte' : 'Cor original'}</button>
        <button class="vestir-agora"${e.vestida ? ' disabled' : ''}>${e.vestida ? '✓ Vestindo' : '👕 Vestir'}</button>
      </div>
      <button class="outra-peca">← outra peça</button>`;
  }

  private desenharCartela(e: EscolhaNoAtelie): void {
    const c = this.cartela;
    c.querySelector('.partes')!.innerHTML = this.botoesDeParte(e);
    const atual = e.parte === 'detalhe' ? e.detalhe : e.cor;
    const original = e.parte === 'detalhe' ? e.detalheOriginal : e.corOriginal;
    c.querySelector('.pintando')!.innerHTML =
      `Pintando ${e.parte === 'detalhe' ? '<b>os detalhes</b>' : '<b>a cor principal</b>'} de <b>${escapar(e.nome)}</b>`;
    // o botão da cor original mostra a cor original DESTA parte
    const orig = c.querySelector<HTMLButtonElement>('.tinta.original')!;
    orig.style.setProperty('--cor', original !== null ? css(original) : 'transparent');
    orig.classList.toggle('atual', atual === original);
    for (const b of c.querySelectorAll<HTMLButtonElement>('.familia .tinta')) {
      const cor = Number(b.dataset.cor);
      const esta = cor === atual && atual !== original;
      b.classList.toggle('atual', esta);
      b.setAttribute('aria-pressed', String(esta));
    }
  }
}
