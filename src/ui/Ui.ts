import type { SavedMemory } from '../core/SaveState';
import type { SomNome } from '../audio/efeitos';

/**
 * Toda a interface em DOM sobre o canvas. O jogo fala com a UI so por estes
 * metodos; nenhum outro arquivo cria elemento de tela.
 */
export class Ui {
  private readonly boot: HTMLDivElement;
  private readonly card: HTMLDivElement;
  private readonly prompt: HTMLDivElement;
  private readonly dialogue: HTMLDivElement;
  private readonly dialogueWho: HTMLSpanElement;
  private readonly dialogueText: HTMLParagraphElement;
  private readonly next: HTMLSpanElement;
  private readonly toasts: HTMLDivElement;
  private readonly journal: HTMLDivElement;
  private readonly journalGrid: HTMLDivElement;
  private readonly hints: HTMLDivElement;
  private readonly veil: HTMLDivElement;
  private readonly escolhas: HTMLDivElement;
  private readonly carga: HTMLDivElement;
  private readonly menu: HTMLDivElement;
  private readonly placar: HTMLDivElement;

  private advance: (() => void) | null = null;
  private escolher: ((i: number) => void) | null = null;
  private selecionada = 0;
  private typing: number | null = null;
  private cardTimer: number | null = null;

  /** chamado quando o jogador aperta o botao redondo no celular */
  onTouchAction: (() => void) | null = null;
  /** chamado quando o jogador aperta o botao de trocar de personagem */
  onTouchSwap: (() => void) | null = null;
  /** botao de acao segurado no celular: carrega o lancamento do frisbee */
  onTouchHold: ((down: boolean) => void) | null = null;
  /** o jogador confirmou "recomecar do zero" no menu */
  onRestart: (() => void) | null = null;
  /** ligar/desligar o som pelo menu */
  onToggleSom: (() => void) | null = null;
  /** a UI pede sons por aqui; o Game liga isto no motor de audio */
  som: ((nome: SomNome) => void) | null = null;

  private hintsTimer: number | null = null;

  constructor(root: HTMLElement) {
    const ui = document.createElement('div');
    ui.id = 'ui';
    ui.innerHTML = `
      <div class="veil"></div>
      <div class="scene-card"><b></b><span></span></div>
      <div class="toasts"></div>
      <div class="hints">
        <div class="teclado">WASD / setas — andar</div>
        <div class="teclado">E ou espaço — interagir</div>
        <div class="teclado">T — trocar de personagem</div>
        <div class="teclado">Q / R — girar a câmera · J — diário</div>
        <div class="toque">arraste para andar · ✨ interagir</div>
        <div class="toque">☰ tem a lista de controles</div>
      </div>
      <div class="carga"><div class="barra"></div></div>
      <div class="placar"><b class="eu"></b><span class="nums"></span><b class="ele"></b></div>
      <div class="prompt"><span class="icon">✨</span><span class="label"></span><span class="key">E</span></div>
      <div class="dialogue"><span class="who"></span><p class="text"></p><div class="escolhas"></div><span class="next">clique / E ▸</span></div>
      <div class="journal"><div class="sheet">
        <h2>Diário de memórias</h2>
        <p class="sub">Os momentos que a gente já viveu — e os que ainda faltam.</p>
        <div class="grid"></div>
        <button class="close">fechar</button>
      </div></div>
      <button class="menu-btn" aria-label="menu"><span></span><span></span><span></span></button>
      <div class="menu"><div class="sheet">
        <h2>AriStory</h2>
        <p class="sub">um passeio pelos lugares da gente</p>
        <button class="som-btn">🔊 Som ligado</button>
        <button class="controles-btn">🎮 Controles</button>
        <button class="recomecar">🔄 Recomeçar o jogo</button>
        <div class="confirma">
          <p>Isso apaga o diário de memórias e leva os dois de volta pro começo, na casa do Ari.</p>
          <div class="linha">
            <button class="sim">Recomeçar</button>
            <button class="nao">Cancelar</button>
          </div>
        </div>
        <div class="controles">
          <h3>No teclado</h3>
          <ul>
            <li><b>W A S D</b><span>andar (as setas também)</span></li>
            <li><b>E</b><span>interagir e avançar a fala (espaço também)</span></li>
            <li><b>T</b><span>trocar de personagem</span></li>
            <li><b>Q</b> <b>R</b><span>girar a câmera</span></li>
            <li><b>H</b><span>dar a mão para quem está com você</span></li>
            <li><b>J</b><span>abrir o diário de memórias</span></li>
            <li><b>F</b><span>segurar para lançar o frisbee, na quadra</span></li>
            <li><b>roda</b><span>aproximar e afastar a câmera</span></li>
          </ul>
          <h3>No celular</h3>
          <ul>
            <li><b>arrastar</b><span>andar para onde o dedo puxar</span></li>
            <li><b>✨</b><span>interagir — segure para carregar o frisbee</span></li>
            <li><b>🔁</b><span>trocar de personagem</span></li>
            <li><b>📖</b><span>abrir o diário</span></li>
          </ul>
          <div class="carinho">
            <h3>Os dois juntos</h3>
            <p>Perto do outro, sem nada por perto para interagir, o <b>E</b> (ou o <b>✨</b>) vira carinho:</p>
            <ul>
              <li><b>💋</b><span>de frente um para o outro, um beijinho</span></li>
              <li><b>🤝</b><span>lado a lado, saem de mãos dadas — e a cada tanto sobe um coração</span></li>
            </ul>
            <p>Para soltar as mãos, é só apertar de novo.</p>
          </div>
          <button class="voltar">voltar</button>
        </div>
        <button class="close">voltar pro jogo</button>
      </div></div>
      <div class="touch">
        <button class="action-btn" aria-label="interagir">✨</button>
        <button class="swap-btn" aria-label="trocar de personagem">🔁</button>
        <button class="journal-btn" aria-label="diário">📖</button>
      </div>
    `;
    root.appendChild(ui);

    const boot = document.createElement('div');
    boot.className = 'boot';
    boot.innerHTML = `<h1>AriStory</h1><p>montando o mundo…</p>`;
    root.appendChild(boot);
    this.boot = boot;

    this.card = ui.querySelector('.scene-card')!;
    this.prompt = ui.querySelector('.prompt')!;
    this.dialogue = ui.querySelector('.dialogue')!;
    this.dialogueWho = ui.querySelector('.dialogue .who')!;
    this.dialogueText = ui.querySelector('.dialogue .text')!;
    this.next = ui.querySelector('.dialogue .next')!;
    this.toasts = ui.querySelector('.toasts')!;
    this.journal = ui.querySelector('.journal')!;
    this.journalGrid = ui.querySelector('.journal .grid')!;
    this.hints = ui.querySelector('.hints')!;
    this.veil = ui.querySelector('.veil')!;
    this.escolhas = ui.querySelector('.escolhas')!;
    this.carga = ui.querySelector('.carga')!;
    this.menu = ui.querySelector('.menu')!;
    this.placar = ui.querySelector('.placar')!;

    this.dialogue.addEventListener('click', (e) => {
      // clique num botão de escolha não deve avançar a fala junto
      if ((e.target as HTMLElement).closest('.escolhas')) return;
      this.advance?.();
    });
    window.addEventListener('keydown', this.navegarEscolha);
    ui.querySelector('.journal .close')!.addEventListener('click', () => this.closeJournal());
    this.journal.addEventListener('click', (e) => {
      if (e.target === this.journal) this.closeJournal();
    });
    const acao = ui.querySelector('.action-btn')!;
    acao.addEventListener('click', () => {
      if (this.dialogueOpen) this.advance?.();
      else this.onTouchAction?.();
    });
    // segurar o botao carrega o lancamento; o clique acima continua valendo
    acao.addEventListener('pointerdown', () => this.onTouchHold?.(true));
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) {
      acao.addEventListener(ev, () => this.onTouchHold?.(false));
    }
    ui.querySelector('.swap-btn')!.addEventListener('click', () => this.onTouchSwap?.());
    ui.querySelector('.journal-btn')!.addEventListener('click', () => this.toggleJournal());

    // menu: o "recomeçar" pede confirmação antes, senão um clique sem querer
    // apaga o diário inteiro
    ui.querySelector('.menu-btn')!.addEventListener('click', () => this.toggleMenu());
    ui.querySelector('.menu .som-btn')!.addEventListener('click', () => this.onToggleSom?.());
    ui.querySelector('.menu .controles-btn')!.addEventListener('click', () => {
      this.som?.('escolha');
      this.menu.classList.add('vendo-controles');
    });
    ui.querySelector('.menu .controles .voltar')!.addEventListener('click', () => {
      this.som?.('escolha');
      this.menu.classList.remove('vendo-controles');
    });
    ui.querySelector('.menu .close')!.addEventListener('click', () => this.closeMenu());
    ui.querySelector('.menu .recomecar')!.addEventListener('click', () => {
      this.menu.classList.add('perguntando');
    });
    ui.querySelector('.menu .nao')!.addEventListener('click', () => {
      this.menu.classList.remove('perguntando');
    });
    ui.querySelector('.menu .sim')!.addEventListener('click', () => {
      this.closeMenu();
      this.onRestart?.();
    });
    this.menu.addEventListener('click', (e) => {
      if (e.target === this.menu) this.closeMenu();
    });

    if (matchMedia('(hover: none)').matches) document.body.classList.add('touch-device');
    this.showHints();
  }

  // ----------------------------------------------------------------- menu

  get menuOpen(): boolean {
    return this.menu.classList.contains('show');
  }

  toggleMenu(): void {
    this.som?.('menu');
    if (this.menuOpen) this.closeMenu();
    else {
      this.closeJournal();
      this.menu.classList.add('show');
    }
    this.marcarTelaAberta();
  }

  closeMenu(): void {
    this.menu.classList.remove('show');
    this.menu.classList.remove('perguntando');
    this.menu.classList.remove('vendo-controles');
    this.marcarTelaAberta();
  }

  /**
   * Com menu ou diário abertos os botões de toque somem: eles ficam por cima do
   * painel (vêm depois no DOM) e dava para apertar o ✨ sem querer por trás.
   */
  private marcarTelaAberta(): void {
    document.body.classList.toggle('tela-aberta', this.menuOpen || this.journalOpen);
  }

  /** Atualiza o botão de som do menu. */
  setSom(ligado: boolean): void {
    const botao = this.menu.querySelector('.som-btn')!;
    botao.textContent = ligado ? '🔊 Som ligado' : '🔇 Som desligado';
    botao.classList.toggle('desligado', !ligado);
  }

  /** Mostra as teclas de novo e recomeça a contagem para elas sumirem. */
  showHints(): void {
    this.hints.classList.remove('hide');
    if (this.hintsTimer) window.clearTimeout(this.hintsTimer);
    this.hintsTimer = window.setTimeout(() => this.hints.classList.add('hide'), 12000);
  }

  hideBoot(): void {
    this.boot.classList.add('gone');
    window.setTimeout(() => this.boot.remove(), 700);
  }

  /** Escurece (on=true) ou clareia a tela, resolvendo no fim da transicao. */
  fade(on: boolean): Promise<void> {
    this.veil.classList.toggle('on', on);
    return new Promise((resolve) => window.setTimeout(resolve, 360));
  }

  // ------------------------------------------------------------ cartao cena
  sceneCard(name: string, subtitle = ''): void {
    this.card.querySelector('b')!.textContent = name;
    this.card.querySelector('span')!.textContent = subtitle;
    this.card.classList.add('show');
    if (this.cardTimer) window.clearTimeout(this.cardTimer);
    this.cardTimer = window.setTimeout(() => this.card.classList.remove('show'), 2600);
  }

  // ---------------------------------------------------------------- prompt
  showPrompt(icon: string, label: string): void {
    const antes = this.prompt.querySelector('.label')!.textContent;
    this.prompt.querySelector('.icon')!.textContent = icon;
    this.prompt.querySelector('.label')!.textContent = label;
    // a gotinha toca quando o prompt entra ou troca de alvo, não a cada quadro
    if (!this.prompt.classList.contains('show') || antes !== label) this.som?.('prompt');
    this.prompt.classList.add('show');
  }

  hidePrompt(): void {
    this.prompt.classList.remove('show');
  }

  /** Placar do minigame, no alto da tela. `null` esconde. */
  showPlacar(dados: { eu: string; ele: string; meus: number; dele: number } | null): void {
    if (!dados) {
      this.placar.classList.remove('show');
      return;
    }
    this.placar.querySelector('.eu')!.textContent = dados.eu;
    this.placar.querySelector('.ele')!.textContent = dados.ele;
    this.placar.querySelector('.nums')!.textContent = `${dados.meus} × ${dados.dele}`;
    this.placar.classList.add('show');
  }

  /** Barra de forca do lancamento. `null` esconde. */
  showCharge(valor: number | null): void {
    if (valor === null) {
      this.carga.classList.remove('show');
      return;
    }
    this.carga.classList.add('show');
    const barra = this.carga.querySelector('.barra') as HTMLDivElement;
    barra.style.width = `${Math.max(0, Math.min(1, valor)) * 100}%`;
  }

  // ---------------------------------------------------------------- toasts
  toast(text: string, icon = '💛'): void {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span>${icon}</span><span></span>`;
    el.querySelector('span:last-child')!.textContent = text;
    this.toasts.appendChild(el);
    window.setTimeout(() => el.classList.add('fade'), 2600);
    window.setTimeout(() => el.remove(), 3200);
  }

  // --------------------------------------------------------------- dialogo
  get dialogueOpen(): boolean {
    return this.dialogue.classList.contains('show');
  }

  /** Mostra as falas em sequencia. Resolve quando a ultima e fechada. */
  say(lines: string[], speaker = ''): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      this.dialogueWho.textContent = speaker;
      this.dialogueWho.style.display = speaker ? '' : 'none';
      this.dialogue.classList.add('show');

      const show = (): void => {
        this.type(lines[i]);
      };

      this.advance = () => {
        if (this.typing !== null) {
          // primeiro clique completa o texto, o segundo avanca
          window.clearInterval(this.typing);
          this.typing = null;
          this.dialogueText.textContent = lines[i];
          return;
        }
        i += 1;
        if (i >= lines.length) {
          this.dialogue.classList.remove('show');
          this.advance = null;
          resolve();
          return;
        }
        show();
      };

      show();
    });
  }

  private type(text: string): void {
    if (this.typing !== null) window.clearInterval(this.typing);
    this.dialogueText.textContent = '';
    let n = 0;
    this.typing = window.setInterval(() => {
      n += 1;
      // uma nota a cada três letras: uma por letra vira metralhadora
      if (n % 3 === 1 && text[n - 1] !== ' ') this.som?.('fala');
      this.dialogueText.textContent = text.slice(0, n);
      if (n >= text.length) {
        window.clearInterval(this.typing!);
        this.typing = null;
      }
    }, 18);
  }

  /**
   * Pergunta com botões. Resolve com o índice escolhido.
   * Funciona no clique, e no teclado com ← → para mover e E para confirmar.
   */
  ask(pergunta: string, opcoes: string[], speaker = ''): Promise<number> {
    return new Promise((resolve) => {
      this.dialogueWho.textContent = speaker;
      this.dialogueWho.style.display = speaker ? '' : 'none';
      this.dialogue.classList.add('show');
      this.next.style.display = 'none';
      this.type(pergunta);

      this.escolhas.innerHTML = '';
      this.selecionada = 0;
      this.escolher = (i: number) => {
        this.som?.('confirma');
        this.escolher = null;
        this.advance = null;
        this.escolhas.innerHTML = '';
        this.escolhas.classList.remove('show');
        this.next.style.display = '';
        this.dialogue.classList.remove('show');
        resolve(i);
      };

      opcoes.forEach((texto, i) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.textContent = texto;
        botao.addEventListener('click', () => this.escolher?.(i));
        this.escolhas.appendChild(botao);
      });
      this.escolhas.classList.add('show');
      this.marcarEscolha();

      // durante a pergunta, a tecla de ação confirma em vez de avançar
      this.advance = () => this.escolher?.(this.selecionada);
    });
  }

  private marcarEscolha(): void {
    const botoes = [...this.escolhas.querySelectorAll('button')];
    botoes.forEach((b, i) => b.classList.toggle('sel', i === this.selecionada));
  }

  private navegarEscolha = (e: KeyboardEvent): void => {
    if (!this.escolher) return;
    const total = this.escolhas.childElementCount;
    if (total === 0) return;
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.selecionada = (this.selecionada - 1 + total) % total;
      this.som?.('escolha');
      this.marcarEscolha();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.selecionada = (this.selecionada + 1) % total;
      this.som?.('escolha');
      this.marcarEscolha();
    }
  };

  /** Encaminha a tecla de acao para o dialogo. Retorna true se consumiu. */
  handleAction(): boolean {
    if (!this.dialogueOpen) return false;
    this.advance?.();
    return true;
  }

  // ---------------------------------------------------------------- diario
  setMemories(memories: readonly SavedMemory[]): void {
    if (memories.length === 0) {
      this.journalGrid.innerHTML = `<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>`;
      return;
    }
    this.journalGrid.innerHTML = '';
    for (const m of memories) {
      const card = document.createElement('div');
      card.className = 'memory';
      card.innerHTML = `<div class="icon"></div><b></b><small></small><p></p>`;
      card.querySelector('.icon')!.textContent = m.icon;
      card.querySelector('b')!.textContent = m.title;
      card.querySelector('small')!.textContent = m.place;
      card.querySelector('p')!.textContent = m.note;
      this.journalGrid.appendChild(card);
    }
  }

  get journalOpen(): boolean {
    return this.journal.classList.contains('show');
  }

  toggleJournal(): void {
    this.som?.('diario');
    if (this.journalOpen) this.closeJournal();
    else this.journal.classList.add('show');
    this.marcarTelaAberta();
  }

  closeJournal(): void {
    this.journal.classList.remove('show');
    this.marcarTelaAberta();
  }
}
