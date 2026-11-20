import type { SomNome } from '../audio/efeitos';
import { ALVOS_DA_MESA, PAPEIS, pistaDaTranscricao, rotuloDaPista, TEXTO_DA_REGRA, TEXTO_DO_ESCUDO } from '../minigames/portaria/campos';
import type { Ferramenta, Regra } from '../minigames/portaria/conferencia';
import type { FimDoDia } from '../minigames/portaria/consequencias';
import type { LinhaDaTranscricao } from '../minigames/portaria/expediente';
import {
  DESTINOS_DO_CLUBE, escrever, NOME_DO_ITEM, PERGUNTA, PROIBIDOS,
  type Assunto, type Carimbo, type Data, type Documento, type ItemDaSacola, type LinhaDaLista, type Pista, type Retrato, type TipoDeDocumento,
} from '../minigames/portaria/tipos';
import { diaDaSemana, pintarCalendario, pintarLista, pintarManual, pintarPapel, pintarRetrato, tamanhoDoPapel } from '../world/papeisDaPortaria';
import { escapar } from './telaDeCartas';

/**
 * A MESA DA PORTARIA em DOM — a bancada de quem trabalha na guarita
 * (`docs/PORTARIA-DO-CLUBE.md`), por cima da cena em primeira pessoa.
 *
 * Igual à mesa de xadrez, ESTA TELA NÃO SABE UMA REGRA. Ela pinta o que a cena
 * manda (`desenhar`, sempre o estado inteiro, tirado do `Expediente`) e devolve
 * o clique (`AcoesDaMesa`). Quem confere, avalia e conta o relógio é o
 * `Expediente`; quem anima é a cena.
 *
 * O que está nela:
 *  - no alto, o DIA, o RELÓGIO, quantos ESPERAM e as DICAS do parceiro;
 *  - as ABAS dos papéis do visitante, a PRANCHETA (a lista), o MANUAL e o
 *    CALENDÁRIO; a folha aberta grande, pintada pelo mesmo pintor da mesa 3D
 *    (`world/papeisDaPortaria.ts`), na resolução da tela;
 *  - o ROSTO de quem está na janela (o mesmo pintor da foto) e a TRANSCRIÇÃO
 *    (o que cada pergunta respondeu);
 *  - as FERRAMENTAS: a 🔍 LUPA (apontar duas coisas que não batem: cada campo
 *    da folha, o rosto, cada linha da transcrição, a lista, o calendário, o
 *    manual e a bancada vazia são alvos — o `data-pista` de cada um é a pista
 *    que a conferência entende), o 💬 PERGUNTAR, a 🎒 SACOLA, a 💡 DICA, os
 *    três CARIMBOS, a 🛎️ CAMPAINHA e o fim do dia;
 *  - o BALÃO de quem fala (o visitante, a Gina, o parceiro), que não trava a
 *    mesa — mas o relógio para enquanto ele está aberto (a cena sabe por
 *    `falando`).
 */

/** quem está na janela, do jeito que a mesa precisa */
export interface JanelaDaMesa {
  rosto: Retrato;
  /** o rosto tapado (o capacete do Capy), até a lupa apontar */
  tapado?: string;
  docs: readonly Documento[];
  sacola: readonly ItemDaSacola[];
  confiscados: readonly ItemDaSacola[];
  transcricao: readonly LinhaDaTranscricao[];
  /** o que dá para perguntar (vazio sem o 💬 do dia) */
  assuntos: readonly Assunto[];
  /** o agrado pela fresta, enquanto não foi respondido */
  oferta: string | null;
}

export interface EstadoDaMesa {
  dia: { numero: number; nome: string };
  hora: string;
  esperando: number;
  ajudas: number;
  ferramentas: readonly Ferramenta[];
  regras: readonly Regra[];
  hoje: Data;
  lista: readonly LinhaDaLista[];
  janela: JanelaDaMesa | null;
  /** uma animação está andando (o papel voando, o carimbo descendo): as ferramentas esperam */
  ocupado: boolean;
  podeChamar: boolean;
  podeTerminar: boolean;
  /** passou das 17h */
  fechou: boolean;
}

export interface AcoesDaMesa {
  chamar(): void;
  perguntar(a: Assunto): void;
  apontar(a: Pista, b: Pista): void;
  carimbar(c: Carimbo): void;
  confiscar(i: ItemDaSacola): void;
  ajuda(): void;
  responderOferta(aceitou: boolean): void;
  terminar(): void;
  /** a folha aberta mudou (a mesa 3D traz o papel para a leitura) */
  abriuPapel?(tipo: TipoDeDocumento): void;
}

/** o que o envelope do fim do dia mostra além do `FimDoDia` */
export interface ExtrasDoEnvelope {
  premio?: { icone: string; nome: string };
  abriu?: number | null;
  recorde?: boolean;
}

/** o painel que a cena recebe do `GameAPI.mesaDaPortaria()` */
export interface PainelDaPortaria {
  readonly aberta: boolean;
  /** o balão está aberto (o relógio para) */
  readonly falando: boolean;
  abrir(acoes: AcoesDaMesa): void;
  desenhar(e: EstadoDaMesa): void;
  /** o balão: uma fala por vez, toque para seguir; resolve quando a última fecha */
  falar(quem: string, falas: readonly string[], icone?: string): Promise<void>;
  /** o recadinho curto que some sozinho (a lupa achou, a sacola, o relógio) */
  avisar(texto: string): void;
  /** abre uma folha pelo tipo (o clique num papel da mesa 3D) */
  abrirFolha(tipo: TipoDeDocumento | 'lista' | 'manual' | 'hoje'): void;
  /** liga ou desliga a lupa (a lupa 3D também liga) */
  lupa(sim: boolean): void;
  /** o ENVELOPE DA GINA no fim do dia: as linhas, o total, as estrelas e o Boletim do Clube */
  envelope(fim: FimDoDia, extras: ExtrasDoEnvelope): Promise<void>;
  fechar(): void;
}

type Aba = { tipo: 'doc'; indice: number } | { tipo: 'lista' } | { tipo: 'manual' } | { tipo: 'hoje' };

const ICONE_DO_PAPEL: Readonly<Record<TipoDeDocumento, string>> = {
  carteirinha: '🪪', convite: '💌', conviteColetivo: '🎒', cracha: '🏷️', ordem: '📦', exame: '🩺',
};
const NOME_DO_PAPEL: Readonly<Record<TipoDeDocumento, string>> = {
  carteirinha: 'Carteirinha', convite: 'Convite', conviteColetivo: 'Convite da turma', cracha: 'Crachá', ordem: 'Ordem de entrega', exame: 'Exame',
};
const ROTULO_DO_ASSUNTO = (a: Assunto): string => PERGUNTA[a] ?? a;
/** o rótulo curto de cada resposta na transcrição */
const ROTULO_CURTO: Readonly<Record<Assunto, string>> = {
  nome: 'Nome', numero: 'Número', motivo: 'Veio para', convidou: 'Convidado por', destino: 'Entrega em',
  exame: 'Exame', sacola: 'Na sacola', quantos: 'Quantos',
};

export class MesaDaPortaria implements PainelDaPortaria {
  aberta = false;
  falando = false;
  som?: (nome: SomNome) => void;
  /** abriu ou fechou (o HUD do jogo esconde os botões de toque) */
  aoMudar?: () => void;
  private acoes: AcoesDaMesa | null = null;
  private estado: EstadoDaMesa | null = null;
  private aba: Aba = { tipo: 'doc', indice: 0 };
  private modoLupa = false;
  private primeira: Pista | null = null;
  private popover: 'perguntar' | 'sacola' | null = null;
  private filaDeFalas: Array<{ quem: string; fala: string; icone?: string; pronto?: () => void }> = [];
  private timerDoAviso = 0;
  private observador: ResizeObserver | null = null;

  private readonly topo: HTMLElement;
  private readonly abas: HTMLElement;
  private readonly folha: HTMLElement;
  private readonly rosto: HTMLElement;
  private readonly transcricao: HTMLElement;
  private readonly ferramentas: HTMLElement;
  private readonly balao: HTMLElement;
  private readonly aviso: HTMLElement;
  private readonly flutuante: HTMLElement;
  private readonly envelopeEl: HTMLElement;

  constructor(private readonly raiz: HTMLElement) {
    raiz.innerHTML = `
      <div class="pt-topo"></div>
      <div class="pt-painel">
        <div class="pt-abas"></div>
        <div class="pt-folha"></div>
        <div class="pt-lado">
          <div class="pt-rosto"></div>
          <div class="pt-transcricao"></div>
        </div>
        <div class="pt-ferramentas"></div>
      </div>
      <div class="pt-balao"></div>
      <div class="pt-aviso"></div>
      <div class="pt-flutuante"></div>
      <div class="pt-envelope"></div>`;
    const q = (s: string): HTMLElement => raiz.querySelector(s)!;
    this.topo = q('.pt-topo');
    this.abas = q('.pt-abas');
    this.folha = q('.pt-folha');
    this.rosto = q('.pt-rosto');
    this.transcricao = q('.pt-transcricao');
    this.ferramentas = q('.pt-ferramentas');
    this.balao = q('.pt-balao');
    this.aviso = q('.pt-aviso');
    this.flutuante = q('.pt-flutuante');
    this.envelopeEl = q('.pt-envelope');

    // UM ouvinte para a mesa inteira: cada botão diz o que é pelo `data-*`
    raiz.addEventListener('click', (ev) => this.clicou(ev));
    this.balao.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.seguirFala();
    });
  }

  // ================================================================ abrir e desenhar

  abrir(acoes: AcoesDaMesa): void {
    this.acoes = acoes;
    this.aberta = true;
    this.raiz.classList.add('show');
    document.body.classList.add('portaria-aberta');
    this.observador ??= new ResizeObserver(() => this.pintarFolha());
    this.observador.observe(this.folha);
    this.aoMudar?.();
  }

  fechar(): void {
    this.aberta = false;
    this.acoes = null;
    this.raiz.classList.remove('show');
    document.body.classList.remove('portaria-aberta');
    this.observador?.disconnect();
    this.filaDeFalas = [];
    this.falando = false;
    this.balao.classList.remove('show');
    this.envelopeEl.classList.remove('show');
    this.aoMudar?.();
  }

  desenhar(e: EstadoDaMesa): void {
    const antes = this.estado;
    this.estado = e;
    // um visitante novo: a folha volta para o primeiro papel, a lupa e o popover fecham
    if (antes?.janela !== e.janela && (!antes?.janela || !e.janela || antes.janela.docs !== e.janela.docs)) {
      this.aba = { tipo: 'doc', indice: 0 };
      this.primeira = null;
      this.popover = null;
    }
    if (!e.janela && this.aba.tipo === 'doc') this.aba = e.ferramentas.includes('lista') ? { tipo: 'lista' } : { tipo: 'manual' };
    this.pintarTopo();
    this.pintarAbas();
    this.pintarFolha();
    this.pintarLado();
    this.pintarFerramentas();
    this.pintarFlutuante();
    this.raiz.classList.toggle('lupa', this.modoLupa);
  }

  private pintarTopo(): void {
    const e = this.estado!;
    this.topo.innerHTML = `
      <span class="pt-dia">📅 Dia ${e.dia.numero} · ${escapar(e.dia.nome)}</span>
      <span class="pt-hora${e.fechou ? ' fechou' : ''}">🕘 ${e.hora}</span>
      <span class="pt-fila">👥 ${e.esperando}</span>
      <span class="pt-dicas" title="dicas do parceiro">💡 ${e.ajudas}</span>`;
  }

  private pintarAbas(): void {
    const e = this.estado!;
    const botoes: string[] = [];
    e.janela?.docs.forEach((d, i) => {
      const ativa = this.aba.tipo === 'doc' && this.aba.indice === i;
      botoes.push(`<button class="pt-aba${ativa ? ' ativa' : ''}" data-aba="doc:${i}">${ICONE_DO_PAPEL[d.tipo]} ${NOME_DO_PAPEL[d.tipo]}</button>`);
    });
    // a bancada vazia: o alvo de "faltou um papel" (só aparece com a lupa)
    if (e.janela && this.modoLupa) {
      botoes.push(`<button class="pt-aba pt-vazia${this.primeira === 'bancada' ? ' escolhida' : ''}" data-pista="bancada">＋ a bancada vazia</button>`);
    }
    if (e.ferramentas.includes('lista')) botoes.push(`<button class="pt-aba${this.aba.tipo === 'lista' ? ' ativa' : ''}" data-aba="lista">📋 Lista</button>`);
    botoes.push(`<button class="pt-aba${this.aba.tipo === 'hoje' ? ' ativa' : ''}" data-aba="hoje">🗓️ Hoje</button>`);
    botoes.push(`<button class="pt-aba${this.aba.tipo === 'manual' ? ' ativa' : ''}" data-aba="manual">📖 Manual</button>`);
    // no celular em pé, a mesa pode crescer por cima da cena para ler a lista e o manual com calma
    botoes.push(`<button class="pt-aba pt-ampliar" data-acao="ampliar" aria-label="ampliar a mesa">${this.raiz.classList.contains('ampliada') ? '⤡' : '⤢'}</button>`);
    this.abas.innerHTML = botoes.join('');
  }

  /** um alvo da lupa: o botão transparente por cima de um pedaço da folha */
  private alvo(pista: Pista, x: number, y: number, l: number, a: number): string {
    const escolhida = this.primeira === pista ? ' escolhida' : '';
    return `<button class="pt-alvo${escolhida}" data-pista="${escapar(pista)}" title="${escapar(rotuloDaPista(pista))}"
      style="left:${x * 100}%;top:${y * 100}%;width:${l * 100}%;height:${a * 100}%"></button>`;
  }

  /** A FOLHA ABERTA, pintada na resolução da tela */
  private pintarFolha(): void {
    const e = this.estado;
    if (!e) return;
    const caixa = this.folha.getBoundingClientRect();
    if (caixa.width < 20 || caixa.height < 20) return;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const aba = this.aba;
    if (aba.tipo === 'manual') {
      this.folha.innerHTML = this.htmlDoManual(e);
      const capa = this.folha.querySelector<HTMLCanvasElement>('canvas.pt-escudo');
      if (capa) {
        capa.width = 96 * dpr;
        capa.height = 128 * dpr;
        const c = capa.getContext('2d')!;
        c.scale((96 * dpr) / 256, (128 * dpr) / 340);
        pintarManual(c, 256, 340);
      }
      return;
    }
    // o tamanho natural do desenho e a pista da folha inteira
    let l: number;
    let a: number;
    let pintar: (c: CanvasRenderingContext2D) => void;
    let alvos = '';
    if (aba.tipo === 'doc') {
      const d = e.janela?.docs[aba.indice];
      if (!d) {
        this.folha.innerHTML = `<div class="pt-vazio">${e.janela ? '' : e.podeChamar ? 'Toque na 🛎️ campainha para chamar o próximo.' : ''}</div>`;
        return;
      }
      ({ l, a } = tamanhoDoPapel(d.tipo));
      pintar = (c) => pintarPapel(c, d);
      alvos = PAPEIS[d.tipo].campos.map((f) => this.alvo(f.pista, f.x, f.y, f.l, f.a)).join('');
    } else if (aba.tipo === 'lista') {
      l = 480;
      a = 720;
      pintar = (c) => pintarLista(c, 480, 720, e.lista);
      alvos = this.alvo('lista', 0, 0, 1, 1);
    } else {
      l = 240;
      a = 240;
      pintar = (c) => pintarCalendario(c, 240, 240, e.hoje);
      alvos = this.alvo('calendario', 0, 0, 1, 1);
    }
    // cabe na caixa, sem deformar
    const k = Math.min((caixa.width - 12) / l, (caixa.height - 12) / a);
    const cssL = Math.floor(l * k);
    const cssA = Math.floor(a * k);
    this.folha.innerHTML = `<div class="pt-papel" style="width:${cssL}px;height:${cssA}px"><canvas></canvas>${alvos}</div>`;
    const tela = this.folha.querySelector('canvas')!;
    tela.width = Math.round(cssL * dpr);
    tela.height = Math.round(cssA * dpr);
    tela.style.width = `${cssL}px`;
    tela.style.height = `${cssA}px`;
    const c = tela.getContext('2d')!;
    c.scale(tela.width / l, tela.height / a);
    pintar(c);
  }

  private htmlDoManual(e: EstadoDaMesa): string {
    const regras = e.regras.map((r) => `<li>${escapar(TEXTO_DA_REGRA[r])}</li>`).join('');
    const destinos = DESTINOS_DO_CLUBE.map((d) => `<li>${escapar(d)}</li>`).join('');
    const proibidos = e.regras.includes('sacola')
      ? `<p class="pt-proibidos">Não entra: ${Object.entries(PROIBIDOS).map(([i, porque]) => `${escapar(NOME_DO_ITEM[i as ItemDaSacola])} (${escapar(porque ?? '')})`).join(' · ')}</p>`
      : '';
    return `<div class="pt-manual">
      <section class="pt-secao" data-secao="escudo">
        <canvas class="pt-escudo"></canvas>
        <p>${escapar(TEXTO_DO_ESCUDO)}</p>
        ${this.alvo('manual:escudo', 0, 0, 1, 1)}
      </section>
      <section class="pt-secao" data-secao="documentos">
        <h4>Quem pode entrar</h4>
        <ol>${regras}</ol>${proibidos}
        ${this.alvo('manual:documentos', 0, 0, 1, 1)}
      </section>
      <section class="pt-secao" data-secao="destinos">
        <h4>Os lugares do clube</h4>
        <ul>${destinos}</ul>
        ${this.alvo('manual:destinos', 0, 0, 1, 1)}
      </section>
    </div>`;
  }

  /** O ROSTO e a TRANSCRIÇÃO */
  private pintarLado(): void {
    const e = this.estado!;
    const j = e.janela;
    if (!j) {
      this.rosto.innerHTML = '<div class="pt-polaroid vazia"><span>a janela está vazia</span></div>';
      this.transcricao.innerHTML = '';
      return;
    }
    this.rosto.innerHTML = `<div class="pt-polaroid"><canvas></canvas>${this.alvo('rosto', 0, 0, 1, 1)}<span>na janela</span></div>`;
    const tela = this.rosto.querySelector('canvas')!;
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    tela.width = 120 * dpr;
    tela.height = 140 * dpr;
    const c = tela.getContext('2d')!;
    c.scale(dpr, dpr);
    pintarRetrato(c, 0, 0, 120, 140, j.rosto, { tapado: j.tapado });

    const linhas = j.transcricao.map((t) => {
      const pista = pistaDaTranscricao(t.assunto);
      const escolhida = this.primeira === pista ? ' escolhida' : '';
      return `<button class="pt-linha${escolhida}" data-pista="${escapar(pista)}">
        <b>${escapar(ROTULO_CURTO[t.assunto] ?? t.assunto)}</b><span>${escapar(t.valor)}</span></button>`;
    }).join('');
    this.transcricao.innerHTML = linhas || `<p class="pt-dica-vazia">${e.ferramentas.includes('perguntar') ? 'O que ele responder fica anotado aqui.' : 'Confira os papéis com a 🔍 lupa.'}</p>`;
  }

  private pintarFerramentas(): void {
    const e = this.estado!;
    const j = e.janela;
    const livre = !e.ocupado;
    const b = (acao: string, rotulo: string, ativo: boolean, extra = ''): string =>
      `<button class="pt-ferr ${extra}" data-acao="${acao}"${ativo ? '' : ' disabled'}>${rotulo}</button>`;
    const sacola = j?.sacola.length ? j.sacola.length - j.confiscados.length : 0;
    const ferr = [
      b('lupa', '🔍 <span>Lupa</span>', livre && !!j && e.ferramentas.includes('apontar'), this.modoLupa ? 'ligada' : ''),
      e.ferramentas.includes('perguntar') ? b('perguntar', '💬 <span>Perguntar</span>', livre && !!j && j.assuntos.length > 0, this.popover === 'perguntar' ? 'ligada' : '') : '',
      j?.sacola.length ? b('sacola', `🎒 <span>Sacola</span> <i>${sacola}</i>`, livre, this.popover === 'sacola' ? 'ligada' : '') : '',
      b('ajuda', `💡 <span>Dica</span>`, livre && !!j && e.ajudas > 0),
    ].join('');
    const carimbos = j
      ? [
        b('carimbo:entra', '✅ <span>ENTRA</span>', livre && !j.oferta, 'pt-carimbo entra'),
        e.regras.includes('exame') ? b('carimbo:soClube', '🟡 <span>SÓ O CLUBE</span>', livre && !j.oferta, 'pt-carimbo so-clube') : '',
        b('carimbo:hojeNao', '⛔ <span>HOJE NÃO</span>', livre && !j.oferta, 'pt-carimbo hoje-nao'),
      ].join('')
      : e.podeTerminar && (e.fechou || !e.podeChamar)
        ? b('terminar', '🏁 <span>Terminar o dia</span>', livre, 'pt-grande')
        : b('chamar', '🛎️ <span>Chamar o próximo</span>', livre && e.podeChamar, 'pt-grande');
    this.ferramentas.innerHTML = `<div class="pt-linha-ferr">${ferr}</div><div class="pt-linha-ferr carimbos">${carimbos}</div>`;
  }

  /** o popover das perguntas, da sacola ou do agrado */
  private pintarFlutuante(): void {
    const j = this.estado?.janela;
    if (j?.oferta) {
      this.flutuante.innerHTML = `<div class="pt-pop oferta"><p>${escapar(j.oferta)}</p>
        <div><button data-acao="oferta:nao">🙅 Recusar</button><button data-acao="oferta:sim">🤲 Aceitar</button></div></div>`;
      this.flutuante.classList.add('show');
      return;
    }
    if (!j || !this.popover) {
      this.flutuante.classList.remove('show');
      this.flutuante.innerHTML = '';
      return;
    }
    if (this.popover === 'perguntar') {
      const feitos = new Set(j.transcricao.map((t) => t.assunto));
      this.flutuante.innerHTML = `<div class="pt-pop"><h4>💬 Perguntar</h4>${j.assuntos.map((a) =>
        `<button data-pergunta="${a}" class="${feitos.has(a) ? 'feita' : ''}">${escapar(ROTULO_DO_ASSUNTO(a))}</button>`).join('')}</div>`;
    } else {
      this.flutuante.innerHTML = `<div class="pt-pop"><h4>🎒 A sacola</h4>${j.sacola.map((i) => {
        const fora = j.confiscados.includes(i);
        return `<button data-confiscar="${i}"${fora ? ' disabled' : ''}>${escapar(NOME_DO_ITEM[i])}${fora ? ' · nos achados' : ' · tirar'}</button>`;
      }).join('')}</div>`;
    }
    this.flutuante.classList.add('show');
  }

  // ================================================================ o clique

  private clicou(ev: MouseEvent): void {
    const alvo = (ev.target as HTMLElement).closest<HTMLElement>('button');
    if (!alvo || !this.acoes || !this.estado) return;
    const d = alvo.dataset;
    if (d.pista && this.modoLupa) {
      this.escolher(d.pista);
      return;
    }
    if (d.aba) {
      this.som?.('folhear');
      if (d.aba.startsWith('doc:')) {
        const i = Number(d.aba.slice(4));
        this.aba = { tipo: 'doc', indice: i };
        const doc = this.estado.janela?.docs[i];
        if (doc) this.acoes.abriuPapel?.(doc.tipo);
      } else this.aba = { tipo: d.aba as 'lista' | 'manual' | 'hoje' };
      this.desenhar(this.estado);
      return;
    }
    if (d.pergunta) {
      this.popover = null;
      this.acoes.perguntar(d.pergunta as Assunto);
      return;
    }
    if (d.confiscar) {
      this.acoes.confiscar(d.confiscar as ItemDaSacola);
      return;
    }
    switch (d.acao) {
      case 'ampliar': this.raiz.classList.toggle('ampliada'); this.desenhar(this.estado); break;
      case 'lupa': this.lupa(!this.modoLupa); break;
      case 'perguntar': this.popover = this.popover === 'perguntar' ? null : 'perguntar'; this.desenhar(this.estado); break;
      case 'sacola': this.popover = this.popover === 'sacola' ? null : 'sacola'; this.desenhar(this.estado); break;
      case 'ajuda': this.acoes.ajuda(); break;
      case 'chamar': this.acoes.chamar(); break;
      case 'terminar': this.acoes.terminar(); break;
      case 'oferta:sim': this.acoes.responderOferta(true); break;
      case 'oferta:nao': this.acoes.responderOferta(false); break;
      default:
        if (d.acao?.startsWith('carimbo:')) {
          this.lupa(false);
          this.popover = null;
          this.acoes.carimbar(d.acao.slice(8) as Carimbo);
        }
    }
  }

  lupa(sim: boolean): void {
    this.modoLupa = sim;
    this.primeira = null;
    this.popover = null;
    if (sim) this.avisar('🔍 Toque em duas coisas que não batem.');
    if (this.estado) this.desenhar(this.estado);
  }

  /** a lupa: a primeira pista fica marcada, a segunda aponta */
  private escolher(pista: Pista): void {
    if (!this.primeira) {
      this.primeira = pista;
      this.som?.('escolha');
      this.desenhar(this.estado!);
      return;
    }
    if (this.primeira === pista) {
      this.primeira = null;
      this.desenhar(this.estado!);
      return;
    }
    const a = this.primeira;
    this.modoLupa = false;
    this.primeira = null;
    this.desenhar(this.estado!);
    this.acoes!.apontar(a, pista);
  }

  abrirFolha(tipo: TipoDeDocumento | 'lista' | 'manual' | 'hoje'): void {
    if (!this.estado) return;
    if (tipo === 'lista' || tipo === 'manual' || tipo === 'hoje') this.aba = { tipo };
    else {
      const i = this.estado.janela?.docs.findIndex((d) => d.tipo === tipo) ?? -1;
      if (i < 0) return;
      this.aba = { tipo: 'doc', indice: i };
    }
    this.som?.('folhear');
    this.desenhar(this.estado);
  }

  // ================================================================ o balão e o aviso

  falar(quem: string, falas: readonly string[], icone?: string): Promise<void> {
    if (!falas.length) return Promise.resolve();
    return new Promise((pronto) => {
      falas.forEach((fala, i) => this.filaDeFalas.push({ quem, fala, icone, pronto: i === falas.length - 1 ? pronto : undefined }));
      if (!this.falando) this.mostrarFala();
    });
  }

  private mostrarFala(): void {
    const f = this.filaDeFalas[0];
    if (!f) {
      this.falando = false;
      this.balao.classList.remove('show');
      return;
    }
    this.falando = true;
    this.som?.('fala');
    this.balao.innerHTML = `<b>${f.icone ? `${f.icone} ` : ''}${escapar(f.quem)}</b><p>${escapar(f.fala)}</p><i>▶</i>`;
    this.balao.classList.add('show');
  }

  private seguirFala(): void {
    const f = this.filaDeFalas.shift();
    f?.pronto?.();
    this.mostrarFala();
  }

  avisar(texto: string): void {
    this.aviso.textContent = texto;
    this.aviso.classList.add('show');
    window.clearTimeout(this.timerDoAviso);
    this.timerDoAviso = window.setTimeout(() => this.aviso.classList.remove('show'), 2600);
  }

  // ================================================================ o envelope

  envelope(fim: FimDoDia, extras: ExtrasDoEnvelope): Promise<void> {
    const estrelas = '⭐'.repeat(fim.estrelas) + '☆'.repeat(3 - fim.estrelas);
    const linhas = fim.linhas.map((l) => `<li class="${l.valor < 0 ? 'menos' : l.valor > 0 ? 'mais' : ''}">
      <span>${escapar(l.texto)}</span><b>${l.valor > 0 ? '+' : ''}${l.valor === 0 ? '' : `R$ ${l.valor}`}</b></li>`).join('');
    const boletim = fim.boletim.map((m) => `<article class="${m.tom}"><h5>${escapar(m.titulo)}</h5><p>${escapar(m.linha)}</p></article>`).join('');
    this.envelopeEl.innerHTML = `<div class="pt-env">
      <h3>✉️ O envelope da Gina</h3>
      <div class="pt-estrelas">${estrelas}</div>
      <ul>${linhas}</ul>
      <p class="pt-total">Para a carteira: <b>R$ ${fim.total}</b>${extras.recorde ? ' <em>recorde!</em>' : ''}</p>
      ${extras.premio ? `<p class="pt-premio">${extras.premio.icone} ${escapar(extras.premio.nome)} para os dois!</p>` : ''}
      ${extras.abriu ? `<p class="pt-abriu">Amanhã: o dia ${extras.abriu} abriu na escala da Gina.</p>` : ''}
      ${boletim ? `<h4>📰 Boletim do Clube</h4><div class="pt-boletim">${boletim}</div>` : ''}
      <button class="pt-grande" data-env="ok">Fechar o dia</button>
    </div>`;
    this.envelopeEl.classList.add('show');
    this.som?.('memoria');
    return new Promise((pronto) => {
      const botao = this.envelopeEl.querySelector('[data-env="ok"]')!;
      botao.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.envelopeEl.classList.remove('show');
        pronto();
      }, { once: true });
    });
  }
}

/** a data por extenso para a mesa ("segunda, 23/11/2026") */
export const hojePorExtenso = (d: Data): string => `${diaDaSemana(d)}, ${escrever(d)}`;
/** (a lista das pistas de fora dos papéis, para o teste conferir que todas têm botão) */
export const PISTAS_DA_MESA = ALVOS_DA_MESA.map((a) => a.pista);
