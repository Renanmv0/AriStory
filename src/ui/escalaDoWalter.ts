import type { SomNome } from '../audio/efeitos';
import { escapar } from './telaDeCartas';

/**
 * A ESCALA DO WALTER — o menu dos turnos do Mania de Churrasco.
 *
 * Pedido do Renan: "na tela em que clicamos no quadro de escala para iniciar
 * a noite, gostaria que abrisse um menu com vários níveis" — e níveis que se
 * chamam TURNOS. O plano está no §13.1 de `docs/MINIGAME-RESTAURANTE.md`.
 *
 * Ela é desenhada como a coisa que é no mundo: a LOUSA de giz pregada ao lado
 * do quadro do Walter, com moldura de madeira, letra de giz e as estrelas
 * riscadas à mão. A estrutura é a do quadro de inscrições da arena (lista,
 * marcar com um clique, começar com o segundo ou com o botão de baixo) e as
 * abas são as do arsenal da estufa — quem já usou uma das duas sabe usar esta.
 *
 * Resolve com o NÚMERO do turno escolhido, ou `null` quando só fechou.
 */

export interface RostoNaEscala {
  icone: string;
  nome: string;
  /** estreia neste turno */
  novo: boolean;
}

export interface TurnoNaEscala {
  numero: number;
  nome: string;
  novidade: string;
  quem: readonly RostoNaEscala[];
  /** as melhores estrelas já tiradas (0 = nunca jogou) */
  estrelas: number;
  recorde: number;
  vezes: number;
  metas: readonly [number, number];
  premio: { icone: string; nome: string; ganho: boolean };
  /** `aberto` joga; `trancado` pede as três estrelas no anterior; `em-preparo` ainda não existe */
  estado: 'aberto' | 'trancado' | 'em-preparo';
  /** quanto dura, em segundos, para a linha dizer */
  duracao: number;
}

export interface MelhoriaNaEscala {
  id: string;
  nome: string;
  icone: string;
  efeitos: readonly string[];
  precos: readonly number[];
  ondeSeVe: string;
  /** quantos níveis a dupla já comprou */
  nivel: number;
}

export interface ConteudoDaEscala {
  turnos: readonly TurnoNaEscala[];
  melhorias: readonly MelhoriaNaEscala[];
  petiscos: number;
  /** as melhorias já podem ser compradas (etapa B do plano); antes disso a aba só mostra */
  lojaAberta: boolean;
  /** o turno em que a escala abre marcada: o primeiro aberto que ainda não tem três estrelas */
  sugerido: number;
}

type Aba = 'turnos' | 'melhorias';

function estrelasDeGiz(n: number): string {
  return [1, 2, 3].map((i) => `<span class="estrela ${i <= n ? 'cheia' : ''}" aria-hidden="true">★</span>`).join('');
}

function relogio(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = Math.round(segundos % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export class EscalaDoWalter {
  private readonly raiz: HTMLDivElement;
  private readonly lista: HTMLDivElement;
  private readonly petiscos: HTMLElement;
  private readonly abas: HTMLDivElement;
  private readonly comecar: HTMLButtonElement;
  private conteudo: ConteudoDaEscala | null = null;
  private aba: Aba = 'turnos';
  private marcado: number | null = null;
  private resolver: ((turno: number | null) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="lousa" role="dialog" aria-label="Escala do Walter">
        <div class="cabeca">
          <div class="titulo">
            <p class="casa">Mania de Churrasco</p>
            <h2>Escala do Walter</h2>
          </div>
          <p class="petiscos" title="petiscos: o Walter dá um por estrela no fim de cada turno"></p>
        </div>
        <div class="abas" role="tablist">
          <button role="tab" data-aba="turnos">📋 Turnos</button>
          <button role="tab" data-aba="melhorias">🛠️ Melhorias</button>
        </div>
        <div class="lista"></div>
        <div class="pe">
          <button class="comecar" disabled>escolha um turno</button>
          <button class="fechar">agora não</button>
        </div>
      </div>
    `;
    this.lista = raiz.querySelector('.lista')!;
    this.petiscos = raiz.querySelector('.petiscos')!;
    this.abas = raiz.querySelector('.abas')!;
    this.comecar = raiz.querySelector('.comecar')!;
    raiz.querySelector('.fechar')!.addEventListener('click', () => this.fechar());
    // clicar FORA da lousa fecha, como o quadro da arena
    raiz.addEventListener('click', (e) => {
      if (e.target === raiz) this.fechar();
    });
    this.comecar.addEventListener('click', () => {
      if (this.marcado !== null) this.escolher(this.marcado);
    });
    this.abas.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-aba]');
      if (!b || b.dataset.aba === this.aba) return;
      this.aba = b.dataset.aba as Aba;
      this.som?.('menu');
      this.pintar();
    });
    this.lista.addEventListener('click', (e) => {
      const linha = (e.target as HTMLElement).closest<HTMLElement>('.linha[data-numero]');
      if (!linha) return;
      this.marcar(Number(linha.dataset.numero));
    });
  }

  get aberto(): boolean {
    return this.raiz.classList.contains('show');
  }

  abrir(conteudo: ConteudoDaEscala): Promise<number | null> {
    return new Promise((resolve) => {
      if (this.aberto) {
        resolve(null);
        return;
      }
      this.conteudo = conteudo;
      this.aba = 'turnos';
      this.marcado = conteudo.turnos.some((t) => t.numero === conteudo.sugerido && t.estado === 'aberto')
        ? conteudo.sugerido : null;
      this.pintar();
      this.raiz.classList.add('show');
      this.som?.('escolha');
      this.resolver = resolve;
    });
  }

  /**
   * O clique numa linha: o PRIMEIRO marca, o SEGUNDO começa — o mesmo dos
   * dois tempos do quadro da arena e do cardápio. Começar fecha a tela, e com
   * um clique só quem estivesse lendo as linhas já estaria servindo mesa.
   */
  private marcar(numero: number): void {
    const t = this.conteudo?.turnos.find((x) => x.numero === numero);
    if (!t) return;
    if (t.estado !== 'aberto') {
      this.som?.('menu');
      return;
    }
    if (this.marcado === numero) {
      this.escolher(numero);
      return;
    }
    this.marcado = numero;
    this.som?.('escolha');
    for (const l of this.lista.querySelectorAll<HTMLElement>('.linha')) {
      l.classList.toggle('marcado', Number(l.dataset.numero) === numero);
    }
    this.pintarBotao();
  }

  private pintarBotao(): void {
    const ok = this.aba === 'turnos' && this.marcado !== null;
    this.comecar.disabled = !ok;
    // na aba das melhorias não há turno a começar: o botão sai, e não deixa buraco
    this.comecar.style.display = this.aba === 'turnos' ? '' : 'none';
    this.comecar.textContent = ok ? `Começar o turno ${this.marcado}` : 'escolha um turno';
  }

  private pintar(): void {
    const c = this.conteudo;
    if (!c) return;
    this.petiscos.innerHTML = `🍢 <b>${c.petiscos}</b> ${c.petiscos === 1 ? 'petisco' : 'petiscos'}`;
    for (const b of this.abas.querySelectorAll<HTMLElement>('[data-aba]')) {
      const ativa = b.dataset.aba === this.aba;
      b.classList.toggle('ativa', ativa);
      b.setAttribute('aria-selected', String(ativa));
    }
    this.lista.innerHTML = this.aba === 'turnos' ? this.pintarTurnos(c) : this.pintarMelhorias(c);
    this.lista.scrollTop = 0;
    this.pintarBotao();
  }

  private pintarTurnos(c: ConteudoDaEscala): string {
    return c.turnos.map((t) => {
      const rostos = t.quem.map((r) =>
        `<span class="rosto ${r.novo ? 'novo' : ''}" title="${escapar(r.nome)}${r.novo ? ' — estreia aqui' : ''}">${r.icone}</span>`,
      ).join('');
      const novos = t.quem.filter((r) => r.novo).map((r) => r.nome);
      const chamada = novos.length ? `<em class="estreia">estreia: ${escapar(novos.join(' e '))}</em>` : '';
      const conta = t.estado === 'trancado'
        ? `<span class="trava">🔒 3 estrelas no turno ${t.numero - 1}</span>`
        : t.estado === 'em-preparo'
          ? '<span class="trava">🚧 o Walter ainda está montando esta escala</span>'
          : `<span class="metas">⭐⭐ R$ ${t.metas[0]} · ⭐⭐⭐ R$ ${t.metas[1]}</span>`
            + (t.vezes ? `<span class="recorde">recorde R$ ${t.recorde}</span>` : '<span class="recorde">ainda não jogado</span>');
      const premio = `<span class="premio ${t.premio.ganho ? 'ganho' : ''}">${t.premio.icone} ${escapar(t.premio.nome)}${t.premio.ganho ? ' ✓' : ''}</span>`;
      const marcado = this.marcado === t.numero ? 'marcado' : '';
      return `
        <div class="linha ${t.estado} ${marcado}" data-numero="${t.numero}">
          <span class="numero">${t.numero}</span>
          <div class="meio">
            <div class="nome"><b>${escapar(t.nome)}</b><small>${relogio(t.duracao)}</small></div>
            <p>${escapar(t.novidade)}</p>
            <div class="rostos">${rostos}${chamada}</div>
          </div>
          <div class="lado">
            <div class="estrelas" title="${t.estrelas} de 3 estrelas">${estrelasDeGiz(t.estrelas)}</div>
            ${conta}
            ${premio}
          </div>
        </div>`;
    }).join('');
  }

  private pintarMelhorias(c: ConteudoDaEscala): string {
    const aviso = c.lojaAberta
      ? ''
      : `<p class="aviso">O Walter está encomendando as melhorias do salão. Enquanto isso, vá juntando
         petiscos: ele dá um por estrela no fim de cada turno.</p>`;
    const cartas = c.melhorias.map((m) => {
      const niveis = m.precos.map((p, i) => `
        <li class="${i < m.nivel ? 'feito' : ''}">
          <span class="efeito">${escapar(m.efeitos[i] ?? '')}</span>
          <span class="preco">${i < m.nivel ? '✓' : `🍢 ${p}`}</span>
        </li>`).join('');
      return `
        <div class="melhoria ${c.lojaAberta ? '' : 'em-breve'}">
          <span class="icone">${m.icone}</span>
          <div class="texto">
            <b>${escapar(m.nome)}</b>
            <ul>${niveis}</ul>
            <small>no salão: ${escapar(m.ondeSeVe)}</small>
          </div>
        </div>`;
    }).join('');
    return aviso + cartas;
  }

  private escolher(numero: number): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.som?.('confirma');
    const r = this.resolver;
    this.resolver = null;
    r?.(numero);
  }

  fechar(): void {
    if (!this.aberto) return;
    this.raiz.classList.remove('show');
    this.som?.('menu');
    const r = this.resolver;
    this.resolver = null;
    r?.(null);
  }
}
