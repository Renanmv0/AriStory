import { EFEITOS, type SomNome } from './efeitos';
import { Musica } from './musica';
import { nota, tom } from './nucleo';

const CHAVE = 'aristory.som';
/** dois disparos do mesmo som mais juntos que isto viram um estalo só */
const INTERVALO_MINIMO = 0.035;

/**
 * O som do jogo, num lugar só.
 *
 * Navegador nenhum deixa tocar áudio antes de a pessoa encostar na página, então
 * o AudioContext só nasce no primeiro clique ou tecla — antes disso `play()` é
 * um no-op silencioso, e ninguém precisa saber disso do lado de fora.
 *
 * Volume: `mestre` manda em tudo (é o mudo), e música e efeitos têm ganho
 * próprio para a marimba nunca cobrir um passo ou uma fala.
 */
export class Som {
  private ctx: AudioContext | null = null;
  private mestre: GainNode | null = null;
  private canalMusica: GainNode | null = null;
  private canalEfeitos: GainNode | null = null;
  private musica: Musica | null = null;

  private mudo: boolean;
  private climaPendente = 'padrao';
  private contadores = new Map<string, number>();
  private ultimoEm = new Map<string, number>();
  /** oscilador da barra de força do frisbee, enquanto ela está na tela */
  private carregando: { osc: OscillatorNode; ganho: GainNode } | null = null;

  /** quantas vezes cada som tocou — existe para os testes conferirem */
  readonly contagem = new Map<string, number>();

  constructor() {
    this.mudo = localStorage.getItem(CHAVE) === '0';
    const acordar = (): void => this.ligar();
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
      window.addEventListener(ev, acordar, { once: false, passive: true });
    }
  }

  get ligado(): boolean {
    return !this.mudo;
  }

  get pronto(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  /**
   * Acorda o áudio. Pode ser chamado quantas vezes for: só o primeiro monta a
   * cadeia, os outros no máximo tiram o contexto da suspensão.
   */
  ligar(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      this.ctx = ctx;

      this.mestre = ctx.createGain();
      this.mestre.gain.value = this.mudo ? 0 : 0.9;
      this.mestre.connect(ctx.destination);

      this.canalMusica = ctx.createGain();
      this.canalMusica.gain.value = 0.9;
      this.canalMusica.connect(this.mestre);

      this.canalEfeitos = ctx.createGain();
      this.canalEfeitos.gain.value = 1;
      this.canalEfeitos.connect(this.mestre);

      this.musica = new Musica(ctx, this.canalMusica);
      this.musica.setClima(this.climaPendente);
    }
    void this.ctx.resume().then(() => {
      if (!this.mudo) this.musica?.start();
    });
  }

  setMudo(mudo: boolean): void {
    this.mudo = mudo;
    localStorage.setItem(CHAVE, mudo ? '0' : '1');
    if (this.mestre && this.ctx) {
      // rampa curta: cortar o ganho no seco estala
      const t = this.ctx.currentTime;
      this.mestre.gain.cancelScheduledValues(t);
      this.mestre.gain.setValueAtTime(this.mestre.gain.value, t);
      this.mestre.gain.linearRampToValueAtTime(mudo ? 0 : 0.9, t + 0.12);
    }
    if (mudo) this.musica?.stop();
    else if (this.ctx?.state === 'running') this.musica?.start();
  }

  /** Cada cenário tem seu clima; ver CLIMAS em musica.ts. */
  setClima(id: string): void {
    this.climaPendente = id;
    this.musica?.setClima(id);
  }

  /** Toca um efeito. Silencioso e sem erro se o áudio ainda não acordou. */
  play(nome: SomNome): void {
    this.contagem.set(nome, (this.contagem.get(nome) ?? 0) + 1);
    if (this.mudo || !this.ctx || !this.canalEfeitos || this.ctx.state !== 'running') return;

    const t = this.ctx.currentTime;
    if (t - (this.ultimoEm.get(nome) ?? -1) < INTERVALO_MINIMO) return;
    this.ultimoEm.set(nome, t);

    const n = (this.contadores.get(nome) ?? 0) + 1;
    this.contadores.set(nome, n);
    EFEITOS[nome]({ ctx: this.ctx, destino: this.canalEfeitos, t, n });
  }

  /**
   * A barra de força do frisbee vira um som que sobe junto — é o mesmo dado na
   * tela e no ouvido. `null` solta a nota.
   */
  carga(valor: number | null): void {
    if (!this.ctx || !this.canalEfeitos || this.mudo || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;

    if (valor === null) {
      if (this.carregando) {
        const { osc, ganho } = this.carregando;
        ganho.gain.cancelScheduledValues(t);
        ganho.gain.setValueAtTime(ganho.gain.value, t);
        ganho.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        osc.stop(t + 0.1);
        this.carregando = null;
      }
      return;
    }

    if (!this.carregando) {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      const ganho = this.ctx.createGain();
      ganho.gain.setValueAtTime(0.0001, t);
      ganho.gain.exponentialRampToValueAtTime(0.05, t + 0.05);
      osc.connect(ganho);
      ganho.connect(this.canalEfeitos);
      osc.start(t);
      this.carregando = { osc, ganho };
    }
    // sobe uma oitava e meia do começo ao fim da carga
    const alvo = nota(60 + valor * 19);
    this.carregando.osc.frequency.setTargetAtTime(alvo, t, 0.04);
  }

  /** Fanfarrinha de duas notas, usada quando o jogo volta do zero. */
  aplauso(): void {
    if (!this.ctx || !this.canalEfeitos) return;
    const t = this.ctx.currentTime;
    [0, 5, 9, 12].forEach((g, i) => {
      tom(this.ctx!, this.canalEfeitos!, {
        freq: nota(72 + g),
        quando: t + i * 0.1,
        dur: 0.5,
        vol: 0.09,
        tipo: 'triangle',
      });
    });
  }
}
