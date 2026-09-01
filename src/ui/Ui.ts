import type { SavedMemory } from '../core/SaveState';
import { SLOTS_ROUPA, type ItemDef, type Vaga } from '../core/types';
import type { SomNome } from '../audio/efeitos';

/**
 * O nome de cada parte do corpo na tela, na ORDEM de `SLOTS_ROUPA`.
 *
 * Um lugar so: a mochila rotula as 4 vagas de vestimenta com isto, o armario
 * titula as divisoes do acervo com isto, e as duas telas nao tem como
 * discordar sobre qual vaga e a do tronco.
 */
const PARTES = ['Cabeça', 'Tronco', 'Pernas', 'Pés'];

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
  private readonly mochila: HTMLDivElement;
  private readonly armario: HTMLDivElement;
  private readonly boneco: HTMLCanvasElement;
  private readonly corpo: HTMLDivElement;
  private readonly acervo: HTMLDivElement;
  private readonly donoArmario: HTMLSpanElement;
  private readonly slotsMao: HTMLDivElement;
  private readonly slotsVestivel: HTMLDivElement;
  private readonly dono: HTMLElement;
  private readonly descarte: HTMLElement;
  /** vaga escolhida no toque, esperando o destino */
  private pegou: Vaga | null = null;
  /** categoria do item na pinça, para a trava saber o que recusar */
  private tipoNaPinca: string | undefined;
  /** o item na pinça é vestimenta funcional (patins)? só ela sai do corpo */
  private funcionalNaPinca = false;

  private advance: (() => void) | null = null;
  private escolher: ((i: number) => void) | null = null;
  private selecionada = 0;
  private typing: number | null = null;
  private cardTimer: number | null = null;

  /** chamado quando o jogador aperta o botao redondo no celular */
  onTouchAction: (() => void) | null = null;
  /** chamado quando o jogador aperta o botao de trocar de personagem */
  onTouchSwap: (() => void) | null = null;
  /** girar a camera no celular; -1 para um lado, 1 para o outro */
  onTouchGirar: ((dir: -1 | 1) => void) | null = null;
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
      <div class="carga"><div class="barra"></div><i class="zona"></i><i class="alvo"></i></div>
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
            <li><b>I</b> <b>Tab</b><span>abrir a mochila</span></li>
            <li><b>J</b><span>abrir o diário de memórias</span></li>
            <li><b>F</b><span>segurar para carregar o frisbee — solte no traço da barra</span></li>
            <li><b>roda</b><span>aproximar e afastar a câmera</span></li>
          </ul>
          <h3>No celular</h3>
          <ul>
            <li><b>arrastar</b><span>andar para onde o dedo puxar</span></li>
            <li><b>✨</b><span>interagir — segure para carregar o frisbee</span></li>
            <li><b>🔁</b><span>trocar de personagem</span></li>
            <li><b>🎒</b><span>abrir a mochila</span></li>
            <li><b>📖</b><span>abrir o diário</span></li>
            <li><b>↺ ↻</b><span>girar a câmera — no alto, abaixo do menu</span></li>
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
      <div class="mochila"><div class="sheet">
        <h2>Mochila <span class="dono"></span></h2>
        <p class="sub">arraste para trocar de vaga · <b>T</b> vê a do outro</p>
        <h3>Na mão <small>toque para escolher o que fica na mão</small></h3>
        <div class="slots maos"></div>
        <h3>Vestindo <small>roupa só se troca no guarda-roupa — aqui só dá pra descartar</small></h3>
        <div class="slots vestiveis"></div>
        <div class="descarte">
          <button class="descartar">🗑 Descartar</button>
          <button class="descartar-sim">Descartar mesmo?</button>
        </div>
        <button class="close">voltar pro jogo</button>
      </div></div>
      <div class="armario"><div class="sheet">
        <h2>Guarda-roupa <span class="dono"></span></h2>
        <p class="sub">clique numa peça para vestir ou tirar · arraste o boneco para girar · <b>T</b> veste o outro</p>
        <div class="prova">
          <canvas class="boneco"></canvas>
          <div class="corpo"></div>
        </div>
        <h3>O que você tem</h3>
        <div class="acervo"></div>
        <button class="close">fechar</button>
      </div></div>
      <div class="touch">
        <button class="action-btn" aria-label="interagir">✨</button>
        <button class="swap-btn" aria-label="trocar de personagem">🔁</button>
        <button class="bag-btn" aria-label="mochila">🎒</button>
        <button class="journal-btn" aria-label="diário">📖</button>
        <button class="girar-btn esq" aria-label="girar a câmera para a esquerda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a6.5 6.5 0 1 0 6.2 4.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1.6v7.6l-4.2-3.8z" fill="currentColor"/></svg></button>
        <button class="girar-btn dir" aria-label="girar a câmera para a direita"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a6.5 6.5 0 1 0 6.2 4.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1.6v7.6l-4.2-3.8z" fill="currentColor"/></svg></button>
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
    this.mochila = ui.querySelector('.mochila')!;
    this.slotsMao = ui.querySelector('.mochila .maos')!;
    this.slotsVestivel = ui.querySelector('.mochila .vestiveis')!;
    this.dono = ui.querySelector('.mochila .dono')!;
    this.descarte = ui.querySelector('.mochila .descarte')!;
    this.armario = ui.querySelector('.armario')!;
    this.boneco = ui.querySelector('.armario .boneco')!;
    this.corpo = ui.querySelector('.armario .corpo')!;
    this.acervo = ui.querySelector('.armario .acervo')!;
    this.donoArmario = ui.querySelector('.armario .dono')!;

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
    ui.querySelector('.girar-btn.esq')!.addEventListener('click', () => this.onTouchGirar?.(-1));
    ui.querySelector('.girar-btn.dir')!.addEventListener('click', () => this.onTouchGirar?.(1));
    ui.querySelector('.journal-btn')!.addEventListener('click', () => this.toggleJournal());
    ui.querySelector('.bag-btn')!.addEventListener('click', () => this.toggleMochila());
    ui.querySelector('.mochila .close')!.addEventListener('click', () => this.closeMochila());
    ui.querySelector('.armario .close')!.addEventListener('click', () => this.fecharArmario());
    this.armario.addEventListener('click', (e) => {
      if (e.target === this.armario) this.fecharArmario();
    });
    this.ligarGiroDoBoneco();
    // Descartar pede dois toques. Perder o chapéu de campeão num toque sem
    // querer seria irreversível — o item não volta de lugar nenhum.
    ui.querySelector('.mochila .descartar')!.addEventListener('click', () => {
      this.som?.('escolha');
      this.descarte.classList.add('confirmando');
    });
    ui.querySelector('.mochila .descartar-sim')!.addEventListener('click', () => {
      const de = this.pegou;
      this.pegou = null;
      this.tipoNaPinca = undefined;
      this.marcarPego(null);
      if (de) this.onDescartar?.(de);
    });
    this.mochila.addEventListener('click', (e) => {
      if (e.target === this.mochila) this.closeMochila();
    });
    // Delegação: as vagas são redesenhadas a cada mudança, então os ouvintes
    // ficam nos dois contêineres e não em cada botão.
    for (const caixa of [this.slotsMao, this.slotsVestivel]) {
      caixa.addEventListener('click', (e) => this.tocarVaga(e));
      caixa.addEventListener('dragstart', (e) => this.comecarArrasto(e as DragEvent));
      caixa.addEventListener('dragover', (e) => this.arrastarSobre(e as DragEvent));
      caixa.addEventListener('dragleave', (e) => {
        (e.target as HTMLElement).closest('.slot')?.classList.remove('alvo');
      });
      caixa.addEventListener('drop', (e) => this.soltarArrasto(e as DragEvent));
      caixa.addEventListener('dragend', () => this.limparArrasto());
    }

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
      this.closeMochila();
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
    document.body.classList.toggle(
      'tela-aberta',
      this.menuOpen || this.journalOpen || this.mochilaOpen || this.armarioOpen,
    );
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

  /**
   * Barra de forca do lancamento. `null` esconde.
   *
   * `alvo` e onde na barra o parceiro esta: sem ele a barra so enche, e a
   * pessoa nao tem como saber quanta forca e a certa. A faixa em volta e a
   * zona do passe perfeito, e a largura dela tem que bater com a da cena.
   */
  showCharge(valor: number | null, alvo?: number | null, zona = 0.06): void {
    if (valor === null) {
      this.carga.classList.remove('show');
      return;
    }
    this.carga.classList.add('show');
    const barra = this.carga.querySelector('.barra') as HTMLDivElement;
    barra.style.width = `${Math.max(0, Math.min(1, valor)) * 100}%`;

    const marca = this.carga.querySelector('.alvo') as HTMLElement;
    const faixa = this.carga.querySelector('.zona') as HTMLElement;
    // fora da barra o alvo nao existe: e o caso de mirar para a grade que esta
    // logo ali, em que nenhuma carga alcanca o parceiro
    const vale = alvo != null && alvo > 0.02 && alvo < 0.99;
    marca.style.display = vale ? 'block' : 'none';
    faixa.style.display = vale ? 'block' : 'none';
    if (!vale) {
      // sem alvo nao ha zona certa: a moldura dourada tem que sair junto
      this.carga.classList.remove('certa');
      return;
    }
    const em = (v: number): string => `calc(3px + (100% - 6px) * ${Math.max(0, Math.min(1, v))})`;
    marca.style.left = em(alvo);
    faixa.style.left = em(alvo - zona);
    faixa.style.right = `calc(3px + (100% - 6px) * ${1 - Math.max(0, Math.min(1, alvo + zona))})`;
    const dentro = Math.abs(valor - alvo) <= zona;
    this.carga.classList.toggle('certa', dentro);
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
    else {
      this.closeMochila();
      this.journal.classList.add('show');
    }
    this.marcarTelaAberta();
  }

  closeJournal(): void {
    this.journal.classList.remove('show');
    this.marcarTelaAberta();
  }

  // -------------------------------------------------------------- mochila

  get mochilaOpen(): boolean {
    return this.mochila.classList.contains('show');
  }

  toggleMochila(): void {
    this.som?.('diario');
    if (this.mochilaOpen) this.closeMochila();
    else {
      this.closeJournal();
      // Pinta AQUI, e não em quem chamou. O painel tem duas portas — a tecla I
      // e o botão 🎒 — e enquanto o desenho morava no lado do teclado, abrir
      // pelo dedo mostrava um painel sem vaga nenhuma.
      this.onAbrirMochila?.();
      this.mochila.classList.add('show');
    }
    this.marcarTelaAberta();
  }

  closeMochila(): void {
    this.mochila.classList.remove('show');
    this.marcarTelaAberta();
  }

  /**
   * Desenha as 9 vagas. Cada vaga existe SEMPRE, cheia ou vazia: a grade
   * parada e o que faz a mochila ser lida de relance, e e o que da endereco
   * fixo ao slot principal.
   *
   * @param ativo indice da vaga de mao que esta na mao
   */
  renderMochila(
    maos: ReadonlyArray<ItemDef | null>,
    vestiveis: ReadonlyArray<ItemDef | null>,
    ativo: number,
    dono: string,
  ): void {
    this.dono.textContent = `de ${dono}`;
    this.pegou = null;
    this.tipoNaPinca = undefined;
    this.funcionalNaPinca = false;
    this.mochila.classList.remove('movendo');
    this.descarte.classList.remove('show', 'confirmando');
    // as 4 vagas de vestimenta SÃO as 4 partes do corpo, na ordem de PARTES;
    // sem o rótulo, duas vagas vazias no meio não dizem o que falta
    const desenhar = (
      onde: HTMLElement,
      vagas: ReadonlyArray<ItemDef | null>,
      principal: number,
      partes = false,
    ): void => {
      onde.innerHTML = '';
      vagas.forEach((item, i) => {
        const vaga = document.createElement('button');
        vaga.className = 'slot';
        vaga.dataset.slot = String(i);
        vaga.classList.toggle('cheio', item !== null);
        vaga.classList.toggle('principal', i === principal);
        // Roupa cosmética vestida não sai daqui: só se troca no guarda-roupa.
        // Deixar ela arrastável seria oferecer um gesto que o save recusa.
        const preso = item !== null && item.tipo === 'vestivel' && item.funcional !== true;
        vaga.draggable = item !== null && !preso;
        vaga.classList.toggle('preso', preso);
        // a categoria viaja no DOM: é ela que a trava do toque consulta sem
        // precisar perguntar ao save
        if (item) {
          vaga.dataset.tipo = item.tipo;
          if (item.funcional) vaga.dataset.funcional = 'sim';
          else delete vaga.dataset.funcional;
        } else {
          delete vaga.dataset.tipo;
          delete vaga.dataset.funcional;
        }
        const rotulo = partes ? `<em class="parte">${PARTES[i]}</em>` : '';
        vaga.innerHTML = rotulo + (item
          ? `<span class="icone">${item.icone}</span><b>${item.nome}</b>` +
            (item.nota ? `<small>${item.nota}</small>` : '')
          : `<span class="icone vazio">·</span><b>vazio</b>`);
        onde.appendChild(vaga);
      });
    };
    desenhar(this.slotsMao, maos, ativo);
    // acessorio nao tem "principal": vestido e vestido
    desenhar(this.slotsVestivel, vestiveis, -1, true);
  }

  // ------------------------------------------------------------ guarda-roupa

  get armarioOpen(): boolean {
    return this.armario.classList.contains('show');
  }

  abrirArmario(): void {
    if (this.armarioOpen) return;
    this.som?.('escolha');
    this.onAbrirArmario?.();
    this.armario.classList.add('show');
    this.marcarTelaAberta();
  }

  fecharArmario(): void {
    if (!this.armarioOpen) return;
    this.armario.classList.remove('show');
    this.marcarTelaAberta();
    this.onFecharArmario?.();
  }

  /**
   * O canvas do boneco 3D.
   *
   * O painel e HTML e o boneco e WebGL, e o boneco desenha no PROPRIO canvas,
   * dentro do painel. A primeira versao recortava um retangulo do canvas do
   * jogo com tesoura e o boneco saia fantasma, porque o canvas do jogo fica
   * atras do HTML e a folha translucida do painel passava por cima.
   */
  canvasDoBoneco(): HTMLCanvasElement {
    return this.boneco;
  }

  /**
   * Desenha o painel: as 4 partes do corpo e o que a pessoa tem para vestir.
   *
   * As 4 vagas aparecem SEMPRE, cheias ou vazias, pela mesma razao da mochila:
   * grade parada se le de relance, e a vaga vazia diz o que falta.
   */
  renderArmario(
    vestindo: ReadonlyArray<ItemDef | null>,
    guardados: ReadonlyArray<ItemDef>,
    dono: string,
  ): void {
    this.donoArmario.textContent = `de ${dono}`;

    this.corpo.innerHTML = '';
    vestindo.forEach((item, i) => {
      const vaga = document.createElement('button');
      vaga.className = 'parte';
      vaga.classList.toggle('cheio', item !== null);
      vaga.dataset.parte = String(i);
      vaga.innerHTML =
        `<small>${PARTES[i]}</small>` +
        (item
          ? `<span class="icone">${item.icone}</span><b>${item.nome}</b><em>tirar</em>`
          : `<span class="icone vazio">·</span><b>vazio</b>`);
      this.corpo.appendChild(vaga);
    });

    // O acervo sai SEPARADO POR PARTE DO CORPO, na mesma ordem das 4 vagas
    // acima. Tudo misturado numa grade só, achar a calça no meio de seis
    // vestidos era caçada; em divisões, a pessoa olha direto para a parte que
    // quer trocar. Parte sem nenhuma peça nem aparece — seção vazia é ruído.
    this.acervo.innerHTML = '';
    if (guardados.length === 0) {
      const vazio = document.createElement('p');
      vazio.className = 'nada';
      vazio.textContent = 'Nada guardado — está tudo no corpo.';
      this.acervo.appendChild(vazio);
      return;
    }
    SLOTS_ROUPA.forEach((slot, i) => {
      const doSlot = guardados.filter((item) => item.slot === slot);
      if (doSlot.length === 0) return;
      const secao = document.createElement('section');
      secao.className = 'grupo';
      secao.dataset.slot = slot;
      const titulo = document.createElement('h4');
      titulo.innerHTML = `${PARTES[i]} <span>${doSlot.length}</span>`;
      secao.appendChild(titulo);
      const grade = document.createElement('div');
      grade.className = 'pecas';
      for (const item of doSlot) {
        const peca = document.createElement('button');
        peca.className = 'peca';
        peca.dataset.id = item.id;
        peca.innerHTML =
          `<span class="icone">${item.icone}</span><b>${item.nome}</b>` +
          (item.nota ? `<small>${item.nota}</small>` : '');
        grade.appendChild(peca);
      }
      secao.appendChild(grade);
      this.acervo.appendChild(secao);
    });
  }

  /** Clicou numa das 4 partes do corpo para TIRAR o que está lá. */
  onTirarParte: ((indice: number) => void) | null = null;
  /** Clicou numa peça guardada para VESTIR. */
  onVestirPeca: ((id: string) => void) | null = null;
  /** O painel vai abrir: o Game desenha e prepara o boneco. */
  onAbrirArmario: (() => void) | null = null;
  onFecharArmario: (() => void) | null = null;
  /** Arrastou o boneco: quanto girar, em radianos. */
  onGirarBoneco: ((delta: number) => void) | null = null;

  /**
   * Arrastar o boneco para girar.
   *
   * `pointer*` e nao `mouse*`: e o mesmo caminho para dedo e para mouse, e o
   * jogo e mostrado no celular tanto quanto no computador. A captura garante
   * que soltar fora do buraco ainda encerre o giro.
   */
  private ligarGiroDoBoneco(): void {
    let arrastando = false;
    let ultimoX = 0;
    this.boneco.addEventListener('pointerdown', (e) => {
      arrastando = true;
      ultimoX = e.clientX;
      this.boneco.setPointerCapture(e.pointerId);
    });
    this.boneco.addEventListener('pointermove', (e) => {
      if (!arrastando) return;
      this.onGirarBoneco?.((e.clientX - ultimoX) * 0.012);
      ultimoX = e.clientX;
    });
    for (const ev of ['pointerup', 'pointercancel']) {
      this.boneco.addEventListener(ev, () => { arrastando = false; });
    }

    this.corpo.addEventListener('click', (e) => {
      const vaga = (e.target as HTMLElement).closest('.parte') as HTMLElement | null;
      if (!vaga?.dataset.parte || !vaga.classList.contains('cheio')) return;
      this.onTirarParte?.(Number(vaga.dataset.parte));
    });
    this.acervo.addEventListener('click', (e) => {
      const peca = (e.target as HTMLElement).closest('.peca') as HTMLElement | null;
      if (!peca?.dataset.id) return;
      this.onVestirPeca?.(peca.dataset.id);
    });
  }

  /** Clique numa vaga da mão: quem decide o que fazer é o Game. */
  onEscolherSlot: ((indice: number) => void) | null = null;
  /** Item arrastado (ou tocado) de uma vaga para outra. */
  onMoverItem: ((de: Vaga, para: Vaga) => boolean) | null = null;
  /** Jogar fora o item de uma vaga. Não volta. */
  onDescartar: ((de: Vaga) => void) | null = null;
  /** Chamado toda vez que a mochila vai abrir, para o Game desenhar as vagas. */
  onAbrirMochila: (() => void) | null = null;

  // ------------------------------------------------ arrastar e tocar

  /**
   * A trava de categoria, do lado da tela.
   *
   * O `SaveState` já recusa sozinho — é ele quem manda. Isto existe só para a
   * recusa ter VOZ: sem o aviso, tocar o sorvete numa vaga de vestimenta não
   * fazia nada e parecia um toque que não pegou.
   */
  private podeIrPara(
    tipo: string | undefined,
    lista: 'mao' | 'vestivel',
    funcional = false,
  ): boolean {
    if (!tipo) return true;
    if (tipo === 'vestivel' && lista === 'mao') {
      // desequipar para a mochila só vale para vestimenta FUNCIONAL: roupa
      // cosmética não ocupa vaga de mão, e aqui a única saída dela é o descarte
      if (funcional) return true;
      this.toast('Roupa só se troca no guarda-roupa', '👗');
      return false;
    }
    if (tipo === 'mao' && lista === 'vestivel') {
      this.toast('Este item não pode ser vestido', '🚫');
      return false;
    }
    return true;
  }

  private endereco(el: HTMLElement): Vaga | null {
    const vaga = el.closest('.slot') as HTMLElement | null;
    if (!vaga?.dataset.slot) return null;
    return {
      lista: vaga.closest('.vestiveis') ? 'vestivel' : 'mao',
      indice: Number(vaga.dataset.slot),
    };
  }

  /**
   * O caminho do DEDO.
   *
   * A API de drag-and-drop do HTML5 não existe no toque — `dragstart` nunca
   * dispara num celular. Sem este toca-pega/toca-solta, desequipar um item
   * seria impossível no telefone, que é onde o jogo mais é mostrado.
   *
   * Na lista da mão o toque tem dois papéis: sem nada na pinça, ele escolhe o
   * slot principal; com algo na pinça, ele solta ali.
   */
  private tocarVaga(e: Event): void {
    const onde = this.endereco(e.target as HTMLElement);
    if (!onde) return;

    if (this.pegou) {
      const de = this.pegou;
      if (de.lista === onde.lista && de.indice === onde.indice) {
        this.pegou = null;
        this.marcarPego(null);
        return;
      }
      // categoria errada: o item CONTINUA na pinça, para a pessoa poder tocar
      // numa vaga válida em seguida em vez de recomeçar
      if (!this.podeIrPara(this.tipoNaPinca, onde.lista, this.funcionalNaPinca)) return;
      this.pegou = null;
      this.marcarPego(null);
      if (this.onMoverItem?.(de, onde)) this.som?.('escolha');
      return;
    }

    const vaga = (e.target as HTMLElement).closest('.slot') as HTMLElement;
    // vaga vazia da mão continua servindo para escolher o slot principal
    if (onde.lista === 'mao' && !vaga.classList.contains('cheio')) {
      this.som?.('escolha');
      this.onEscolherSlot?.(onde.indice);
      return;
    }
    if (!vaga.classList.contains('cheio')) return;

    // vaga cheia da mão: um toque põe na mão, o segundo entra no modo mover
    if (onde.lista === 'mao' && !vaga.classList.contains('principal')) {
      this.som?.('escolha');
      this.onEscolherSlot?.(onde.indice);
      return;
    }
    this.pegou = onde;
    this.tipoNaPinca = vaga.dataset.tipo;
    this.funcionalNaPinca = vaga.dataset.funcional === 'sim';
    this.marcarPego(vaga);
    this.som?.('escolha');
  }

  private marcarPego(vaga: HTMLElement | null): void {
    for (const el of this.mochila.querySelectorAll('.slot.pego')) el.classList.remove('pego');
    vaga?.classList.add('pego');
    this.mochila.classList.toggle('movendo', vaga !== null);
    // o descarte só existe com um item na pinça: sem seleção não há o que jogar
    // fora, e um botão solto ali só assusta
    this.descarte.classList.toggle('show', vaga !== null);
    this.descarte.classList.remove('confirmando');
    const alvo = this.descarte.querySelector('.descartar')!;
    const nome = vaga?.querySelector('b')?.textContent ?? '';
    alvo.textContent = nome ? `🗑 Descartar ${nome}` : '🗑 Descartar';
  }

  private comecarArrasto(e: DragEvent): void {
    const onde = this.endereco(e.target as HTMLElement);
    const vaga = (e.target as HTMLElement).closest('.slot') as HTMLElement | null;
    if (!onde || !vaga?.classList.contains('cheio')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer?.setData('text/plain', JSON.stringify({
      vaga: onde,
      tipo: vaga.dataset.tipo,
      funcional: vaga.dataset.funcional === 'sim',
    }));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    vaga.classList.add('pego');
  }

  private arrastarSobre(e: DragEvent): void {
    const vaga = (e.target as HTMLElement).closest('.slot');
    if (!vaga) return;
    // sem o preventDefault o navegador recusa a solta e o drop nunca chega
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    vaga.classList.add('alvo');
  }

  private soltarArrasto(e: DragEvent): void {
    e.preventDefault();
    const para = this.endereco(e.target as HTMLElement);
    const cru = e.dataTransfer?.getData('text/plain');
    this.limparArrasto();
    if (!para || !cru) return;
    try {
      const { vaga, tipo, funcional } = JSON.parse(cru) as
        { vaga: Vaga; tipo?: string; funcional?: boolean };
      if (!this.podeIrPara(tipo, para.lista, funcional === true)) return;
      if (this.onMoverItem?.(vaga, para)) this.som?.('escolha');
    } catch {
      /* arrasto de fora da mochila: ignora */
    }
  }

  private limparArrasto(): void {
    for (const el of this.mochila.querySelectorAll('.slot.pego, .slot.alvo')) {
      el.classList.remove('pego', 'alvo');
    }
  }
}
