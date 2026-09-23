import type { CartaNaTela, ContextoDaEscolha } from '../minigames/jardim/tela';
import type { SomNome } from '../audio/efeitos';

/**
 * A TELA DAS TRÊS CARTAS — o que aparece quando a rodada do jardim sobe de nível.
 *
 * ================================================= POR QUE EM DOM, E NÃO EM 3D
 *
 * O pedido do Renan: um pop-up na tela, e não um modelo. E ele é o caminho
 * certo pelo mesmo motivo do cardápio e da mesa de xadrez: quando a interação é
 * LER e ESCOLHER, a tela ganha — texto de 70 letras numa câmera isométrica não
 * se lê, e aqui o jogador precisa ler três ao mesmo tempo.
 *
 * ==================================================== O QUE UMA CARTA MOSTRA
 *
 * De cima para baixo, e cada coisa responde uma pergunta que o jogador faz:
 *
 * - a FITA DA FAMÍLIA — "isto melhora o quê?" (o regador, eu, o jardim);
 * - o MEDALHÃO com o emoji, num halo da cor da raridade — "o que é isto?";
 * - o NOME, e as BOLINHAS da série quando ela é uma — "tem mais depois?";
 * - o TEXTO do efeito, numa folha de papel — "o que muda?";
 * - o SELO "muda o regador", quando muda — "vou ver isso na mão?";
 * - o RODAPÉ com a raridade e as pedrinhas — "isto é raro?".
 *
 * A MOLDURA é a raridade, e é ela que se lê primeiro, de longe: verde, azul,
 * roxo e dourado, na ordem do §6 do plano. A lendária brilha; a rara pulsa.
 *
 * ================================================== ELA NÃO FECHA SEM ESCOLHER
 *
 * Não tem botão de fechar e o Escape não faz nada: subir de nível é o momento
 * da rodada, e sair sem carta seria perder a melhoria por acidente. A escolha
 * é em DOIS TEMPOS, como no cardápio: o primeiro toque marca (a carta sobe), o
 * segundo pega. Com um toque só, quem estava só lendo pegaria a carta errada —
 * e ela não sai mais da mão.
 */
export class TelaDeCartas {
  private readonly raiz: HTMLDivElement;
  private readonly mesa: HTMLDivElement;
  private readonly titulo: HTMLElement;
  private readonly mao: HTMLDivElement;
  private readonly botao: HTMLButtonElement;
  private cartas: readonly CartaNaTela[] = [];
  private marcada = -1;
  private resolver: ((id: string) => void) | null = null;
  som: ((nome: SomNome) => void) | null = null;

  constructor(raiz: HTMLDivElement) {
    this.raiz = raiz;
    raiz.innerHTML = `
      <div class="cabeca">
        <div class="guirlanda" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <p class="subiu">subiu de nível</p>
        <h2 class="nivel">Nível <b></b></h2>
        <p class="sub">escolha <b>uma</b> melhoria para esta rodada</p>
      </div>
      <div class="mesa"></div>
      <div class="pe">
        <div class="mao"></div>
        <button class="pegar" disabled>toque numa carta</button>
        <p class="dica">1 · 2 · 3 ou ← → para marcar · E para pegar</p>
      </div>
    `;
    this.mesa = raiz.querySelector('.mesa')!;
    this.titulo = raiz.querySelector('.nivel b')!;
    this.mao = raiz.querySelector('.mao')!;
    this.botao = raiz.querySelector('.pegar')!;

    this.mesa.addEventListener('click', (e) => {
      const alvo = (e.target as HTMLElement).closest<HTMLElement>('.carta-jardim');
      if (!alvo) return;
      const i = Number(alvo.dataset.i);
      // o segundo toque na MESMA carta é o "pego"
      if (i === this.marcada) this.confirmar();
      else this.marcar(i);
    });
    this.botao.addEventListener('click', () => this.confirmar());
  }

  get aberta(): boolean {
    return this.raiz.classList.contains('show');
  }

  /**
   * Abre com as três cartas e SÓ RESOLVE quando uma for pega.
   *
   * O mesmo contrato do cardápio: quem chama escreve "sobe de nível, espera a
   * carta, aplica" em linha reta, sem virar máquina de estados.
   */
  abrir(cartas: readonly CartaNaTela[], contexto: ContextoDaEscolha): Promise<string> {
    return new Promise((resolve) => {
      if (this.aberta || cartas.length === 0) {
        resolve(cartas[0]?.id ?? '');
        return;
      }
      this.cartas = cartas;
      this.marcada = -1;
      this.titulo.textContent = String(contexto.nivel);
      this.desenharMesa();
      this.desenharMao(contexto);
      this.pintarBotao();
      // um quadro antes de ligar o `.show`: sem ele a animação de entrada das
      // cartas não roda, porque o navegador junta os dois estados num só
      this.raiz.classList.remove('show');
      void this.raiz.offsetWidth;
      this.raiz.classList.add('show');
      this.som?.('sino');
      this.resolver = resolve;
    });
  }

  /** Marca a carta `i` (0, 1 ou 2): ela sobe, e o botão diz o nome dela. */
  marcar(i: number): void {
    if (!this.aberta || i < 0 || i >= this.cartas.length) return;
    this.marcada = i;
    this.mesa.querySelectorAll<HTMLElement>('.carta-jardim').forEach((el) => {
      el.classList.toggle('marcada', Number(el.dataset.i) === i);
    });
    this.pintarBotao();
    this.som?.('escolha');
  }

  /** As setas andam pela mesa; sem nada marcado, a primeira seta marca a ponta. */
  mover(passo: -1 | 1): void {
    if (!this.aberta) return;
    const n = this.cartas.length;
    const daqui = this.marcada < 0 ? (passo > 0 ? -1 : n) : this.marcada;
    this.marcar((daqui + passo + n) % n);
  }

  /** Pega a marcada. Sem nada marcado não faz nada — é o "dois tempos". */
  confirmar(): void {
    if (!this.aberta || this.marcada < 0) return;
    const carta = this.cartas[this.marcada];
    const el = this.mesa.querySelector<HTMLElement>(`.carta-jardim[data-i="${this.marcada}"]`);
    el?.classList.add('pega');
    this.som?.('confirma');
    const avisar = this.resolver;
    this.resolver = null;
    // a carta pega dá o "pulo" dela antes de a tela sumir: é o que confirma
    // para o jogador QUAL ele pegou, antes de o mundo voltar a andar
    window.setTimeout(() => {
      this.raiz.classList.remove('show');
      avisar?.(carta.id);
    }, 420);
  }

  // ------------------------------------------------------------- desenho

  private desenharMesa(): void {
    this.mesa.innerHTML = this.cartas.map((c, i) => desenharCarta(c, i)).join('');
  }

  /**
   * A FILEIRA DO QUE JÁ ESTÁ NA MÃO, no pé da tela.
   *
   * Ela existe porque a escolha depende do que você já tem: a terceira carta de
   * alcance vale menos que a primeira de velocidade, e sem ver a mão o jogador
   * escolhe no escuro. Fichinhas pequenas, só o emoji na cor da raridade — o
   * nome sai no toque longo (`title`).
   */
  private desenharMao(contexto: ContextoDaEscolha): void {
    if (contexto.mao.length === 0) {
      this.mao.innerHTML = '<span class="vazia">a mão ainda está vazia — é a primeira carta da rodada</span>';
      return;
    }
    this.mao.innerHTML =
      '<span class="rotulo">na mão</span>' +
      contexto.mao
        .map((c) => `<i class="ficha r-${c.raridade}" title="${escapar(c.nome)}">${c.icone}</i>`)
        .join('');
  }

  private pintarBotao(): void {
    const c = this.cartas[this.marcada];
    this.botao.disabled = !c;
    this.botao.textContent = c ? `pegar “${c.nome}”` : 'toque numa carta';
    this.botao.className = `pegar${c ? ` r-${c.raridade}` : ''}`;
  }
}

// ================================================================ a carta

const FAMILIAS = {
  regador: { icone: '🪣', nome: 'Regador' },
  jardineiro: { icone: '🧑‍🌾', nome: 'Jardineiro' },
  jardim: { icone: '🌿', nome: 'Jardim' },
} as const;

const RARIDADES = {
  comum: { nome: 'Comum', pedras: 1 },
  incomum: { nome: 'Incomum', pedras: 2 },
  raro: { nome: 'Rara', pedras: 3 },
  lendario: { nome: 'Lendária', pedras: 4 },
} as const;

/** texto de carta vem do catálogo, mas vai para `innerHTML`: escapa assim mesmo */
function escapar(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);
}

/**
 * O HTML DE UMA CARTA. As classes carregam o desenho inteiro (`style.css`,
 * bloco "TELA DAS TRÊS CARTAS"): `r-*` é a raridade, `f-*` a família.
 *
 * `--i` é a posição na mesa, e é ela que atrasa a entrada de cada carta — as
 * três viram uma depois da outra, como cartas sendo dadas.
 */
function desenharCarta(c: CartaNaTela, i: number): string {
  const familia = FAMILIAS[c.familia];
  const raridade = RARIDADES[c.raridade];
  const pedras = [1, 2, 3, 4]
    .map((n) => `<i class="${n <= raridade.pedras ? 'cheia' : ''}"></i>`)
    .join('');
  const degraus = c.degrau
    ? `<div class="degraus" title="degrau ${c.degrau.atual} de ${c.degrau.total}">${Array.from(
      { length: c.degrau.total },
      (_, k) => `<i class="${k < c.degrau!.atual ? 'cheia' : ''}"></i>`,
    ).join('')}</div>`
    : '';
  const selos = [
    c.mudaORegador ? '<span class="selo regador">🪣 muda o regador</span>' : '',
    c.consolo ? '<span class="selo consolo">vale agora</span>' : '',
  ].join('');
  const raridadeNome = c.consolo ? 'Consolo' : raridade.nome;

  return `
    <button class="carta-jardim r-${c.consolo ? 'consolo' : c.raridade} f-${c.familia}"
      data-i="${i}" style="--i:${i}" aria-label="${escapar(c.nome)}: ${escapar(c.texto)}">
      <span class="brilho" aria-hidden="true"></span>
      <span class="miolo">
        <span class="canto a" aria-hidden="true"></span><span class="canto b" aria-hidden="true"></span>
        <span class="canto c" aria-hidden="true"></span><span class="canto d" aria-hidden="true"></span>
        <span class="fita"><span class="fita-icone">${familia.icone}</span>${familia.nome}</span>
        <span class="medalhao"><span class="halo" aria-hidden="true"></span><span class="emoji">${c.icone}</span></span>
        <span class="corpo">
          <b class="nome">${escapar(c.nome)}</b>
          ${degraus}
          <span class="texto">${escapar(c.texto)}</span>
          ${selos ? `<span class="selos">${selos}</span>` : ''}
        </span>
        <span class="rodape"><span class="raridade">${raridadeNome}</span><span class="pedras">${pedras}</span></span>
      </span>
    </button>
  `;
}
