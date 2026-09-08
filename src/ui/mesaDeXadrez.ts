import type { ChessEngine, Cor } from '../entities/ChessEngine';

/**
 * A MESA DE XADREZ DA ESTELLA — o tabuleiro em DOM.
 *
 * ===================================== POR QUE EM DOM, E NAO EM 3D
 *
 * O jogo inteiro e 3D, mas xadrez em 3D pede raycast em peca de dois
 * centimetros numa camera isometrica: acertar a casa certa vira sorte, e cada
 * clique errado e um lance errado. O cardapio do restaurante ja resolveu esse
 * problema uma vez — quando a interacao e LER e ESCOLHER, a tela ganha. Aqui e
 * a mesma coisa, entao e o mesmo caminho: um painel por cima do mundo, com
 * `grid` de 8×8 e um botao por casa.
 *
 * ==================================== A SEPARACAO QUE EVITA O BUG CLASSICO
 *
 * **Esta tela nao sabe uma unica regra de xadrez.** Ela nao sabe como anda um
 * cavalo, nao sabe o que e roque e nao sabe se um rei esta em xeque. Tudo o que
 * ela faz e:
 *
 *  1. pedir `tabuleiro()` ao motor e pintar o que veio;
 *  2. pedir `destinosDe(casa)` e acender aquelas casas;
 *  3. chamar `jogar(de, para)` quando alguem clica numa casa acesa.
 *
 * O bug mais comum de um tabuleiro caseiro e a TELA E O MOTOR DISCORDAREM (a
 * peca aparece numa casa e o motor acha que ela esta noutra). Aqui isso nao tem
 * como acontecer: depois de cada lance a tela e REPINTADA INTEIRA a partir do
 * motor — nao existe uma peca que a tela mova por conta propria.
 */

/** o convite da partida: quem chamou, o que ela fala e o que fazer com som */
export interface ConviteDeXadrez {
  nome: string;
  /** o emoji dela, no balao */
  avatar: string;
  /** as provocacoes que ela solta no meio da partida */
  provocacoes: readonly string[];
  /** o que ela diz no fim */
  ganhou: string;
  perdeu: string;
  empatou: string;
  /** quanto tempo ela finge que esta pensando, em milissegundos */
  pensarMs?: number;
  som?: (nome: 'peca' | 'captura' | 'fala') => void;
}

/** como a partida terminou, do ponto de vista do JOGADOR */
export type FimDeXadrez = 'ganhei' | 'perdi' | 'empate' | 'desisti';

/** os simbolos de xadrez do Unicode — sem asset, como todo o resto do jogo */
const SIMBOLO: Record<string, string> = {
  p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
};
const NOME_DA_PECA: Record<string, string> = {
  p: 'peão', n: 'cavalo', b: 'bispo', r: 'torre', q: 'dama', k: 'rei',
};

export class MesaDeXadrez {
  private readonly host: HTMLElement;
  private motor: ChessEngine | null = null;
  private convite: ConviteDeXadrez | null = null;
  private fechar: ((fim: FimDeXadrez) => void) | null = null;

  /** a casa que o jogador marcou, esperando o destino */
  private marcada: string | null = null;
  /** os destinos acesos da casa marcada — a tela so aceita clique NELES */
  private destinos: string[] = [];
  /** enquanto a ovelha "pensa", nenhum clique conta */
  private pensando = false;
  private acabou = false;
  /** de quantas em quantas jogadas dela sai uma provocacao */
  private ateProvocar = 2;
  private qualProvocacao = 0;
  /** o `setTimeout` da ovelha, guardado para poder cancelar ao fechar */
  private relogio: number | null = null;
  /** o ultimo lance, para acender as duas casas */
  private ultimo: { de: string; para: string } | null = null;

  private readonly grade: HTMLDivElement;
  private readonly balao: HTMLDivElement;
  private readonly estado: HTMLDivElement;
  private readonly bandejaMinha: HTMLDivElement;
  private readonly bandejaDela: HTMLDivElement;
  private readonly sair: HTMLButtonElement;

  constructor(host: HTMLElement) {
    this.host = host;
    host.innerHTML = `
      <div class="mesa">
        <div class="lado">
          <div class="quem"><span class="avatar"></span><b class="nome"></b></div>
          <div class="balao"></div>
          <div class="bandeja dela"><span class="rotulo">ela comeu</span><span class="pecas"></span></div>
          <div class="bandeja minha"><span class="rotulo">você comeu</span><span class="pecas"></span></div>
          <div class="estado"></div>
          <button class="sair">desistir da partida</button>
        </div>
        <div class="grade"></div>
      </div>
    `;
    this.grade = host.querySelector('.grade')!;
    this.balao = host.querySelector('.balao')!;
    this.estado = host.querySelector('.estado')!;
    this.bandejaMinha = host.querySelector('.bandeja.minha .pecas')!;
    this.bandejaDela = host.querySelector('.bandeja.dela .pecas')!;
    this.sair = host.querySelector('.sair')!;

    this.sair.addEventListener('click', () => this.encerrar(this.acabou ? this.resultado() : 'desisti'));
    /*
     * UM OUVINTE SO, NA GRADE INTEIRA. Sessenta e quatro casas sao sessenta e
     * quatro botoes, e pendurar um `click` em cada um deles significa lembrar de
     * despendurar os sessenta e quatro toda vez que o tabuleiro e repintado —
     * era por ai que vazava clique de partida antiga. Delegado no pai, o
     * ouvinte e um so e a repintura nao mexe nele.
     */
    this.grade.addEventListener('click', (e) => {
      const casa = (e.target as HTMLElement).closest<HTMLElement>('.casa');
      if (casa?.dataset.casa) this.clicar(casa.dataset.casa);
    });
  }

  get aberta(): boolean {
    return this.host.classList.contains('show');
  }

  /**
   * Abre a mesa e devolve a promessa do FIM da partida.
   *
   * A promessa e o que deixa a cena escrever "convida, joga, comemora" em linha
   * reta, do mesmo jeito que o cardapio faz com a mesa do restaurante.
   */
  abrir(motor: ChessEngine, convite: ConviteDeXadrez): Promise<FimDeXadrez> {
    return new Promise((resolve) => {
      if (this.aberta) {
        resolve('desisti');
        return;
      }
      this.motor = motor;
      this.convite = convite;
      this.fechar = resolve;
      this.marcada = null;
      this.destinos = [];
      this.pensando = false;
      this.acabou = false;
      this.ultimo = null;
      this.ateProvocar = 2;
      this.qualProvocacao = 0;

      this.host.querySelector('.avatar')!.textContent = convite.avatar;
      this.host.querySelector('.nome')!.textContent = convite.nome;
      this.sair.textContent = 'desistir da partida';
      this.falar('');
      this.pintar();
      this.host.classList.add('show');

      // se por algum motivo a ovelha comecar (o teste faz isso), ela joga sozinha
      if (!motor.minhaVez() && !motor.acabou()) this.vezDela();
    });
  }

  /** Fecha por fora: o Escape do jogo e a desistencia passam por aqui. */
  desistir(): void {
    if (!this.aberta) return;
    this.encerrar(this.acabou ? this.resultado() : 'desisti');
  }

  // ------------------------------------------------------------- a partida

  /**
   * O CLIQUE, e ele tem exatamente tres saidas:
   *
   *  1. clicou num DESTINO ACESO → joga;
   *  2. clicou numa peca SUA → marca ela e acende os destinos dela;
   *  3. qualquer outra coisa → desmarca.
   *
   * Nao ha uma quarta. Um clique nunca "quase" faz um lance: se a casa nao
   * estava acesa, ele so muda o que esta marcado.
   */
  private clicar(casa: string): void {
    if (!this.motor || this.pensando || this.acabou) return;
    if (!this.motor.minhaVez()) return;

    if (this.marcada && this.destinos.includes(casa)) {
      this.jogar(this.marcada, casa);
      return;
    }
    const alvo = this.pecaEm(casa);
    if (alvo && alvo.cor === this.motor.minhaCor) {
      this.marcada = casa;
      this.destinos = this.motor.destinosDe(casa);
      this.convite?.som?.('peca');
      this.pintar();
      return;
    }
    this.marcada = null;
    this.destinos = [];
    this.pintar();
  }

  private jogar(de: string, para: string): void {
    if (!this.motor) return;
    const feito = this.motor.jogar(de, para);
    // `null` aqui seria lance ilegal — a tela nao oferece um, mas se um dia
    // oferecer, ela SO desmarca em vez de mexer no tabuleiro
    if (!feito) {
      this.marcada = null;
      this.destinos = [];
      this.pintar();
      return;
    }
    this.convite?.som?.(feito.capturou ? 'captura' : 'peca');
    this.marcada = null;
    this.destinos = [];
    this.ultimo = { de: feito.de, para: feito.para };
    this.pintar();

    if (feito.promoveu) this.falar('Peão coroado! Virou dama, é a regra.');
    if (this.terminou()) return;
    this.vezDela();
  }

  /**
   * A VEZ DELA: ela "pensa" primeiro.
   *
   * O tempo nao e enfeite — sem ele a resposta aparece no mesmo quadro do
   * clique e o tabuleiro pisca duas pecas de uma vez, que na tela le como bug.
   * Um segundo e meio e o suficiente para o olho ver o proprio lance antes da
   * resposta chegar.
   */
  private vezDela(): void {
    if (!this.motor || !this.convite) return;
    this.pensando = true;
    this.pintarEstado();
    this.relogio = window.setTimeout(() => {
      this.relogio = null;
      if (!this.motor || !this.aberta) return;
      const dela = this.motor.jogarPelaOvelha();
      this.pensando = false;
      if (dela) {
        this.convite?.som?.(dela.capturou ? 'captura' : 'peca');
        this.ultimo = { de: dela.de, para: dela.para };
        this.provocar(dela.capturou);
      }
      this.pintar();
      this.terminou();
    }, this.convite.pensarMs ?? 1400);
  }

  /**
   * A LINGUA DELA. A cada duas ou tres jogadas sai uma provocacao, e ela nao
   * fecha o tabuleiro para isso: o balao fica do LADO da mesa. Fechar o painel
   * no meio da partida para falar tiraria a posicao da vista bem na hora em que
   * a pessoa esta pensando nela.
   *
   * Captura tem fala PROPRIA e fura a fila: comer uma peca calada e a unica
   * jogada que merecia comentario e nao teria.
   */
  private provocar(capturou: string | null): void {
    const c = this.convite;
    if (!c) return;
    if (capturou) {
      this.falar(`Obrigada pelo ${NOME_DA_PECA[capturou]}. Bééé.`);
      this.ateProvocar = 2;
      return;
    }
    if (--this.ateProvocar > 0) return;
    this.ateProvocar = 2 + (this.qualProvocacao % 2);
    this.falar(c.provocacoes[this.qualProvocacao % c.provocacoes.length]);
    this.qualProvocacao++;
  }

  private falar(texto: string): void {
    this.balao.textContent = texto;
    this.balao.classList.toggle('cheio', !!texto);
    if (texto) this.convite?.som?.('fala');
  }

  /**
   * Olha se a partida acabou e, se acabou, TRAVA a mesa e troca o botao.
   *
   * Ela nao fecha sozinha: quem levou um mate quer ver o tabuleiro do mate. O
   * botao de baixo vira "sair da mesa" e e ele que resolve a promessa.
   */
  private terminou(): boolean {
    if (!this.motor || !this.motor.acabou()) return false;
    this.acabou = true;
    this.pensando = false;
    const fim = this.resultado();
    const c = this.convite;
    if (c) this.falar(fim === 'ganhei' ? c.perdeu : fim === 'perdi' ? c.ganhou : c.empatou);
    this.sair.textContent = 'sair da mesa';
    this.pintar();
    return true;
  }

  private resultado(): FimDeXadrez {
    if (!this.motor) return 'desisti';
    const vencedor = this.motor.vencedor();
    if (!vencedor) return 'empate';
    return vencedor === this.motor.minhaCor ? 'ganhei' : 'perdi';
  }

  private encerrar(fim: FimDeXadrez): void {
    if (!this.aberta) return;
    if (this.relogio !== null) {
      // sem isto a ovelha "joga" depois da mesa fechada, no tabuleiro de
      // ninguem — e o proximo convite abriria com um lance a mais
      window.clearTimeout(this.relogio);
      this.relogio = null;
    }
    this.host.classList.remove('show');
    const avisar = this.fechar;
    this.fechar = null;
    this.motor = null;
    avisar?.(fim);
  }

  // ------------------------------------------------------------- a pintura

  /**
   * REPINTA O TABULEIRO INTEIRO a partir do motor.
   *
   * Sessenta e quatro casas por lance e barato (e um `innerHTML` de meia tela)
   * e compra a garantia que importa: a tela nunca guarda estado proprio de onde
   * uma peca esta. Se o motor e a tela discordassem, a discordancia sumiria no
   * lance seguinte — e bug que some sozinho e o pior de todos.
   */
  private pintar(): void {
    if (!this.motor) return;
    const linhas = this.motor.tabuleiro();
    const partes: string[] = [];
    for (let l = 0; l < 8; l++) {
      for (let c = 0; c < 8; c++) {
        const casa = linhas[l][c];
        const escura = (l + c) % 2 === 1;
        const classes = ['casa', escura ? 'escura' : 'clara'];
        if (casa.casa === this.marcada) classes.push('marcada');
        if (this.destinos.includes(casa.casa)) classes.push(casa.peca ? 'comer' : 'ir');
        if (this.ultimo && (casa.casa === this.ultimo.de || casa.casa === this.ultimo.para)) {
          classes.push('ultimo');
        }
        const peca = casa.peca
          ? `<span class="peca ${casa.cor === 'brancas' ? 'brancas' : 'pretas'}">${SIMBOLO[casa.peca]}</span>`
          : '';
        // a coordenada so na borda, como num tabuleiro de verdade
        const fila = c === 0 ? `<i class="fila">${8 - l}</i>` : '';
        const coluna = l === 7 ? `<i class="coluna">${'abcdefgh'[c]}</i>` : '';
        partes.push(
          `<button class="${classes.join(' ')}" data-casa="${casa.casa}" ` +
          `aria-label="${casa.casa}">${fila}${coluna}${peca}</button>`,
        );
      }
    }
    this.grade.innerHTML = partes.join('');
    this.pintarEstado();
    this.pintarBandejas();
  }

  private pintarEstado(): void {
    if (!this.motor) return;
    const m = this.motor;
    let texto: string;
    if (this.acabou) {
      const fim = this.resultado();
      texto = fim === 'ganhei' ? 'Xeque-mate. Você ganhou dela!'
        : fim === 'perdi' ? 'Xeque-mate. Ela ganhou.'
        : m.situacao() === 'afogamento' ? 'Rei afogado: empate.' : 'Empate.';
    } else if (this.pensando) {
      texto = `${this.convite?.nome ?? 'Ela'} está pensando…`;
    } else if (m.situacao() === 'xeque') {
      texto = m.minhaVez() ? 'Xeque! Salve o seu rei.' : 'Xeque nela!';
    } else {
      texto = m.minhaVez() ? 'Sua vez — clique numa peça sua.' : 'Vez dela.';
    }
    this.estado.textContent = texto;
    this.estado.classList.toggle('fim', this.acabou);
    this.host.classList.toggle('travado', this.pensando || this.acabou);
  }

  private pintarBandejas(): void {
    if (!this.motor) return;
    const { minhas, dela } = this.motor.capturadas();
    const desenhar = (tipos: string[], cor: Cor): string =>
      tipos
        .sort((a, b) => 'kqrbnp'.indexOf(a) - 'kqrbnp'.indexOf(b))
        .map((t) => `<span class="peca ${cor === 'brancas' ? 'brancas' : 'pretas'}">${SIMBOLO[t]}</span>`)
        .join('');
    const minhaCor = this.motor.minhaCor;
    const dela0: Cor = minhaCor === 'brancas' ? 'pretas' : 'brancas';
    // "ela comeu" mostra as MINHAS pecas; "você comeu" mostra as dela
    this.bandejaDela.innerHTML = desenhar(minhas, minhaCor);
    this.bandejaMinha.innerHTML = desenhar(dela, dela0);
  }

  private pecaEm(casa: string): { cor: Cor } | null {
    if (!this.motor) return null;
    for (const linha of this.motor.tabuleiro()) {
      for (const c of linha) {
        if (c.casa === casa && c.peca && c.cor) return { cor: c.cor };
      }
    }
    return null;
  }
}
