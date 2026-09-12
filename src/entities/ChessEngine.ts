import { Chess, type Square } from 'chess.js';

/**
 * O MOTOR DA PARTIDA DE XADREZ contra a Estella.
 *
 * ================================ POR QUE NAO ESCREVI AS REGRAS EU MESMO
 *
 * Xadrez tem uma lista de regras que parece pequena e nao e: roque dos dois
 * lados (proibido em xeque, proibido ATRAVESSANDO xeque, proibido se a torre ou
 * o rei ja andaram), en passant (so no lance seguinte, e a captura tira uma
 * peca de uma casa em que a peca capturante nao pousa), promocao, peca CRAVADA
 * (que nao pode sair da linha do proprio rei), e a obrigacao de responder ao
 * xeque. Cada um desses e um bug esperando acontecer, e nenhum aparece na
 * primeira partida de teste — aparece na decima, no meio da diversao.
 *
 * Entao a regra vem da `chess.js`, que e uma biblioteca de LOGICA (nao e asset:
 * nao entra .glb, .png nem .mp3 no jogo por causa dela), e este arquivo e o
 * unico lugar do projeto que a conhece. Se um dia ela sair, muda so aqui.
 *
 * =========================== A INVARIANTE QUE MATA O BUG DE LANCE ILEGAL
 *
 * **Nenhum lance nasce aqui dentro nem na tela. Todo lance sai de
 * `moves({ verbose: true })`.**
 *
 * `destinosDe()` devolve os destinos daquela lista, e a tela so consegue clicar
 * no que ela devolveu. `jogar()` PROCURA o lance na mesma lista antes de
 * executar e devolve `null` se nao achar — entao, mesmo que alguem chame o
 * motor por fora (o teste faz isso de proposito), lance ilegal nao entra. Nao
 * ha um segundo caminho de escrita: `jogar()` e `jogarPelaOvelha()` sao os dois
 * unicos lugares que chamam `move()`.
 *
 * O RESULTADO E QUE A TELA NAO SABE AS REGRAS. Ela pinta o que o motor diz e
 * clica no que o motor ofereceu — o desenho nunca decide se um lance vale.
 */

/** as duas cores, ditas do jeito que a cena fala */
export type Cor = 'brancas' | 'pretas';

/** uma casa do tabuleiro, ja pronta para a tela pintar */
export interface CasaDoTabuleiro {
  /** 'a1' … 'h8' */
  casa: string;
  /** o tipo da peca: p, n, b, r, q, k — ou null se a casa esta vazia */
  peca: 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | null;
  cor: Cor | null;
}

/** o que aconteceu num lance, para a tela acender e a cena narrar */
export interface LanceFeito {
  de: string;
  para: string;
  /** a peca que se moveu */
  peca: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  /** o tipo da peca capturada, se houve captura */
  capturou: 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | null;
  /** notacao de xadrez, do jeito que se anota numa planilha: "Cf3", "exd5" */
  anotacao: string;
  /** deu xeque no adversario */
  xeque: boolean;
  /** virou promocao (o peao chegou do outro lado) */
  promoveu: boolean;
}

export type Situacao =
  | 'jogando'
  | 'xeque'
  | 'xeque-mate'
  | 'afogamento'
  | 'empate';

/**
 * QUANTO VALE CADA PECA, para a ovelha escolher a melhor captura.
 *
 * A escala classica (peao 1, cavalo e bispo 3, torre 5, dama 9). O rei tem
 * valor porque a conta de desempate usa "com que peca eu capturo" — e nunca
 * porque o rei possa ser capturado: `chess.js` nao gera esse lance.
 */
const VALOR: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

export class ChessEngine {
  private readonly jogo = new Chess();
  /** sorteio repetivel: mesma semente, mesma partida da ovelha */
  private semente: number;

  /**
   * De que cor joga o JOGADOR. A Estella fica com a outra.
   *
   * Ela se acha grande mestra e "da as pretas de bandeja" — quem comeca e a
   * dupla, com as brancas. Fica como parametro porque o teste precisa das duas
   * pontas para provar as regras.
   */
  readonly minhaCor: Cor;

  constructor(minhaCor: Cor = 'brancas', semente = 20260908) {
    this.minhaCor = minhaCor;
    this.semente = semente >>> 0 || 1;
  }

  // -------------------------------------------------------------- leitura

  /**
   * O tabuleiro inteiro, da linha 8 para a linha 1 — a mesma ordem em que a
   * tela desenha (a primeira linha do grid e o fundo do adversario).
   */
  tabuleiro(): CasaDoTabuleiro[][] {
    return this.jogo.board().map((linha, l) =>
      linha.map((c, col) => {
        /*
         * O NOME DA CASA SAI DO INDICE, e nao da peca. A `chess.js` devolve
         * `null` na casa vazia — sem peca, sem nome —, e casa sem nome e casa em
         * que nao da para clicar: era por ali que a tela ficaria sem destino
         * para onde mover. A linha 0 do `board()` e a FILA 8.
         */
        const casa = `${'abcdefgh'[col]}${8 - l}`;
        if (c) return { casa, peca: c.type, cor: this.deQuem(c.color) };
        return { casa, peca: null, cor: null };
      }),
    );
  }

  vezDe(): Cor {
    return this.deQuem(this.jogo.turn());
  }

  /** true quando e a vez do jogador (e nao a da ovelha) */
  minhaVez(): boolean {
    return this.vezDe() === this.minhaCor;
  }

  /**
   * Os destinos legais de uma casa — a lista de onde a tela tira TUDO o que
   * pode acender. Casa vazia, peca do adversario ou peca cravada devolvem
   * lista vazia, e nao um erro: para a tela "nao tem para onde ir" e a mesma
   * coisa nos tres casos.
   */
  destinosDe(casa: string): string[] {
    const lances = this.jogo.moves({ square: casa as Square, verbose: true });
    return lances.map((l) => l.to);
  }

  /** Todos os lances legais de quem esta na vez, em pares `de → para`. */
  todosOsLances(): Array<{ de: string; para: string }> {
    return this.jogo.moves({ verbose: true }).map((l) => ({ de: l.from, para: l.to }));
  }

  situacao(): Situacao {
    if (this.jogo.isCheckmate()) return 'xeque-mate';
    if (this.jogo.isStalemate()) return 'afogamento';
    if (this.jogo.isDraw()) return 'empate';
    if (this.jogo.inCheck()) return 'xeque';
    return 'jogando';
  }

  acabou(): boolean {
    return this.jogo.isGameOver();
  }

  /**
   * Quem ganhou, quando acabou.
   *
   * `null` em empate, afogamento ou partida em andamento — quem chama tem que
   * olhar `situacao()` junto para saber a diferenca entre "empatou" e "ainda
   * esta rolando".
   */
  vencedor(): Cor | null {
    if (!this.jogo.isCheckmate()) return null;
    // quem esta na vez e quem levou o mate: ganhou o outro
    return this.vezDe() === 'brancas' ? 'pretas' : 'brancas';
  }

  /** as pecas que cada lado ja perdeu, para a bandeja da tela */
  capturadas(): { minhas: string[]; dela: string[] } {
    const minhas: string[] = [];
    const dela: string[] = [];
    for (const l of this.jogo.history({ verbose: true })) {
      if (!l.captured) continue;
      // quem perdeu a peca e o LADO CONTRARIO ao que fez o lance
      if (this.deQuem(l.color) === this.minhaCor) dela.push(l.captured);
      else minhas.push(l.captured);
    }
    return { minhas, dela };
  }

  /** quantos lances ja foram feitos (meio-lances: um de cada lado conta 2) */
  lancesFeitos(): number {
    return this.jogo.history().length;
  }

  fen(): string {
    return this.jogo.fen();
  }

  /** Carrega uma posicao pronta. So o teste usa — e como se provam as regras. */
  carregar(fen: string): void {
    this.jogo.load(fen);
  }

  // -------------------------------------------------------------- escrita

  /**
   * Faz um lance, SE ele estiver na lista de lances legais.
   *
   * Devolve `null` para qualquer coisa que nao esteja: casa vazia, peca do
   * outro lado, destino impossivel, lance que deixaria o proprio rei em xeque.
   * A tela usa isso como cinto de seguranca — ela ja so oferece destino legal,
   * e mesmo assim o motor confere de novo.
   *
   * PROMOCAO E SEMPRE DAMA. Peao que chega do outro lado vira dama sem
   * perguntar: e o que 99% das partidas fazem, e uma tela de escolha no meio do
   * clique e um caminho a mais para travar. A tela avisa quando acontece.
   */
  jogar(de: string, para: string): LanceFeito | null {
    const legal = this.jogo
      .moves({ verbose: true })
      .find((l) => l.from === de && l.to === para);
    if (!legal) return null;
    return this.executar(de, para);
  }

  /**
   * O LANCE DA OVELHA. Ela se acha uma grande mestra, e a cabeca dela tem tres
   * degraus, nesta ordem:
   *
   * 1. **mate em um**, se existir. Grande mestra que deixa passar o mate na
   *    cara nao e grande mestra;
   * 2. **a melhor captura**: entre todas, a que come a peca mais cara. No
   *    empate, ela captura com a peca MAIS BARATA — trocar dama por peao
   *    defendido e o jeito mais rapido de uma "mestra" parecer boba;
   * 3. **um lance legal qualquer**, sorteado com semente (mesma semente, mesma
   *    partida: e o que deixa o teste medir a partida dela sem loteria).
   *
   * Devolve `null` so quando nao ha lance nenhum — ou seja, quando a partida ja
   * acabou.
   */
  jogarPelaOvelha(): LanceFeito | null {
    const lances = this.jogo.moves({ verbose: true });
    if (!lances.length) return null;

    // 1. mate em um
    for (const l of lances) {
      if (l.san.includes('#')) return this.executar(l.from, l.to);
    }

    // 2. a melhor captura
    const capturas = lances.filter((l) => l.captured);
    if (capturas.length) {
      let melhor = capturas[0];
      for (const l of capturas) {
        const ganho = VALOR[l.captured!] - VALOR[l.piece] * 0.1;
        const atual = VALOR[melhor.captured!] - VALOR[melhor.piece] * 0.1;
        if (ganho > atual) melhor = l;
      }
      return this.executar(melhor.from, melhor.to);
    }

    // 3. qualquer um, com semente
    const escolhido = lances[Math.floor(this.sorte() * lances.length) % lances.length];
    return this.executar(escolhido.from, escolhido.to);
  }

  // --------------------------------------------------------------- dentro

  /**
   * O UNICO lugar que mexe no tabuleiro de verdade.
   *
   * Ter um caminho de escrita so e o que garante que `LanceFeito` sempre bate
   * com o que aconteceu: se houvesse dois, um deles esqueceria de contar a
   * promocao ou o xeque mais cedo ou mais tarde.
   */
  private executar(de: string, para: string): LanceFeito | null {
    const feito = this.jogo.move({ from: de, to: para, promotion: 'q' });
    if (!feito) return null;
    return {
      de: feito.from,
      para: feito.to,
      peca: feito.piece,
      capturou: feito.captured ?? null,
      anotacao: feito.san,
      xeque: this.jogo.inCheck(),
      promoveu: !!feito.promotion,
    };
  }

  private deQuem(cor: 'w' | 'b'): Cor {
    return cor === 'w' ? 'brancas' : 'pretas';
  }

  /** Sorteio repetivel, o mesmo xorshift do resto do jogo. */
  private sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }
}
