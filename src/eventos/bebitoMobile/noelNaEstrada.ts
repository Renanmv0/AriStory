import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import { CarroDoNoel } from '../../world/carroDoNoel';
import type { NaPista } from '../../world/estrada';

type Fase = 'esperando' | 'alinhando' | 'ultrapassando' | 'freando' | 'falando' | 'saindo' | 'feito';
const suave = (t: number): number => { const k = Math.max(0, Math.min(1, t)); return k * k * (3 - 2 * k); };

/** Uma cena no relógio da viagem, isolada dos obstáculos e com as faixas reservadas. */
export class NoelNaEstrada {
  readonly carro = new CarroDoNoel();
  readonly estado = { fase: 'esperando' as Fase, relativo: -28, tempo: 0, s: 0 };
  private falas = false;
  private anterior: THREE.Vector3 | null = null;
  private inicioDaFreada = 0;
  parada: number | null = null;
  constructor(private readonly g: GameAPI, readonly s: number, private readonly naPista: NaPista, private readonly rumo: (s: number) => number, private readonly carona: string) {
    this.carro.group.visible = false;
  }
  get ativo(): boolean { return this.estado.fase !== 'esperando' && this.estado.fase !== 'feito'; }
  /** O evento aguarda menu/olhar terminar para não abrir outra fala por cima. */
  update(dt: number, viagem: { s: number; v: number; l: number }, podeComecar: boolean): void {
    const e = this.estado;
    if (e.fase === 'esperando') {
      if (viagem.s < this.s - 60 || !podeComecar) return;
      e.fase = 'alinhando'; e.tempo = 0;
      this.g.toast('Uma buzinadinha atrás… é o Noel!', '🦃'); this.g.som('buzinaDoBebito');
    }
    if (e.fase === 'feito') return;
    e.tempo += dt;
    if (e.fase === 'alinhando' && e.tempo >= 2.4 && Math.abs(viagem.l - 1.75) < 0.12) {
      e.fase = 'ultrapassando'; e.tempo = 0;
    }
    if (e.fase === 'ultrapassando') {
      e.relativo = -28 + 42 * suave(e.tempo / 2.7);
      if (e.tempo >= 2.7) {
        e.fase = 'freando'; e.tempo = 0;
        this.inicioDaFreada = viagem.s + e.relativo;
        this.parada = this.inicioDaFreada + 8.75;
      }
    } else if (e.fase === 'freando') {
      // Ele freia adiante e o Bebito alcança a parada; nunca desliza de ré
      // para emparelhar. 7 m/s desacelerando a zero em 2,5 s percorrem 8,75 m.
      const t = Math.min(2.5, e.tempo);
      e.relativo = this.inicioDaFreada + 7 * (t - t * t / 5) - viagem.s;
      if (e.tempo >= 2.5 && viagem.v < 0.1 && Math.abs(viagem.s - this.parada!) < 0.2) { e.fase = 'falando'; e.tempo = 0; }
    } else if (e.fase === 'falando' && !this.falas) {
      this.falas = true;
      void this.conversar().then(() => { e.fase = 'saindo'; e.tempo = 0; });
    } else if (e.fase === 'saindo') {
      e.relativo = 4 * e.tempo + 3.5 * e.tempo * e.tempo;
      if (e.relativo > 65) {
        e.fase = 'feito'; this.carro.group.visible = false;
        this.g.toast('Ele tem mais pressa que o liquidificador.', '🦃');
      }
    }
    e.s = viagem.s + e.relativo;
    this.carro.group.visible = e.fase !== 'feito';
    const p = this.naPista(e.s, -1.75);
    this.carro.group.position.copy(p); this.carro.group.rotation.y = this.rumo(e.s);
    this.carro.update(dt, this.anterior ? this.anterior.distanceTo(p) : 0, e.fase === 'falando');
    this.anterior = p;
  }
  /** O Bebito deixa a esquerda livre e para ao lado dele para o comentário. */
  velocidade(s: number): number {
    const e = this.estado;
    if (e.fase === 'freando') return Math.min(7, Math.sqrt(6 * Math.max(0, this.parada! - s)));
    return e.fase === 'falando' ? 0 : 7;
  }
  private async conversar(): Promise<void> {
    const g = this.g;
    g.som('gluglu');
    await g.say(['BEBITOS! Eu ia só buscar laranja. Voltei com três caixas e ESQUECI O GELO!'], 'Noel');
    await g.say(['Você tá fazendo suco ou abastecendo o clube inteiro?'], this.carona);
    await g.say(['OS DOIS! O suco não se espreme sozinho! Já chego lá!'], 'Noel');
  }
  /** Vista frontal dos dois carros; também funciona no celular em pé. */
  camera(viagem: { s: number }): { de: THREE.Vector3; para: THREE.Vector3 } {
    const longe = window.innerWidth / window.innerHeight < 0.8 ? 1.65 : 1;
    const alvo = this.naPista(viagem.s + 1, 0, 1.25);
    return { de: this.naPista(viagem.s + 10 * longe, 7 * longe, 4.8 * longe), para: alvo };
  }
}
