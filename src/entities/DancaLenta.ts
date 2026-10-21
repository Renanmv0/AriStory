import type { PapelNaDanca } from '../characters/CharacterRig';
import type { Companion } from './Companion';
import type { Player } from './Player';

/**
 * O balanço: um vaivém inteiro a cada quatro tempos de 66 bpm (o clima
 * `'danca-lenta'` do radinho) — o peso troca de pé a cada dois tempos, que é
 * o passo de quem dança agarradinho e não tem pressa nenhuma.
 */
const BALANCO = (Math.PI * 2 * 66) / 60 / 4;
/** a voltinha inteira, em segundos */
const VOLTINHA = 2.4;
/** o raio da cabeça em fração da altura (o `headR` do `CharacterRig`) */
const RAIO_DA_CABECA = 0.17;
/**
 * Quanto os dois ficam perto: as cabeças quase encostando. Na régua chibi do
 * jogo é a cabeça, e não o peito, que decide — e as duas tombam cada uma para
 * um lado, então dá para chegar mais perto que a soma dos raios.
 */
const FOLGA = 1.12;

/**
 * A DANÇA LENTA: os dois de frente um para o outro, agarradinhos — quem leva
 * as mãos na cintura (o Renan: ele é o mais alto) e quem abraça pelos ombros —,
 * balançando juntos de olhos fechados. De vez em quando, a voltinha.
 *
 * Como o beijo deitado, é da CENA (`g.dancaLenta`, `g.voltinhaNaDanca`): só
 * existe dentro de uma cutscene, com os dois montados na mesma âncora (quem
 * gira devagar enquanto eles dançam é a âncora; aqui é só o corpo). O motor
 * põe os dois de frente no X dela, à distância das cabeças, e dá a cada rig a
 * mesma fase do balanço — com meia volta de diferença, para os dois
 * inclinarem para o mesmo lado do mundo (ver `CharacterRig.poseDeDanca`).
 */
export class DancaLenta {
  /** o quanto a pose está valendo (sobe e desce devagar) */
  private forca = 0;
  private alvo = 0;
  private fase = 0;
  private naCintura: string | null = null;
  /** relógio da voltinha; -1 é sem voltinha */
  private tVoltinha = -1;
  private aoVoltar: (() => void) | null = null;

  get dancando(): boolean {
    return this.alvo > 0 || this.forca > 0.001;
  }

  comecar(naCintura: string, a: Player, b: Companion): void {
    this.naCintura = naCintura;
    this.alvo = 1;
    // de frente um para o outro, no X da âncora em comum, à distância das cabeças
    if (a.riding && b.riding && a.object.parent && a.object.parent === b.object.parent) {
      const d = (a.rig.spec.height + b.rig.spec.height) * RAIO_DA_CABECA * FOLGA;
      const meioX = (a.object.position.x + b.object.position.x) / 2;
      const meioZ = (a.object.position.z + b.object.position.z) / 2;
      const aNaEsquerda = a.object.position.x <= b.object.position.x;
      const [esq, dir] = aNaEsquerda ? [a, b] : [b, a];
      esq.object.position.set(meioX - d / 2, esq.object.position.y, meioZ);
      dir.object.position.set(meioX + d / 2, dir.object.position.y, meioZ);
      esq.rig.group.rotation.y = Math.PI / 2;
      esq.rig.setFacing(Math.PI / 2);
      dir.rig.group.rotation.y = -Math.PI / 2;
      dir.rig.setFacing(-Math.PI / 2);
    }
  }

  /** para de dançar: os braços voltam devagar */
  parar(): void {
    this.alvo = 0;
  }

  /** na hora (troca de cena, soltar da âncora) */
  cancelar(a: Player, b: Companion): void {
    this.alvo = 0;
    this.forca = 0;
    this.tVoltinha = -1;
    const r = this.aoVoltar;
    this.aoVoltar = null;
    r?.();
    a.rig.setDanca(0);
    b.rig.setDanca(0);
  }

  /** a voltinha de quem está pelos ombros; resolve quando ela termina */
  voltinha(): Promise<void> {
    if (this.alvo === 0) return Promise.resolve();
    this.aoVoltar?.();
    this.tVoltinha = 0;
    return new Promise((r) => {
      this.aoVoltar = r;
    });
  }

  update(dt: number, a: Player, b: Companion): void {
    if (this.alvo === 0 && this.forca <= 0.001) return;
    this.forca += (this.alvo - this.forca) * Math.min(1, dt * 2.2);
    if (this.alvo === 0 && this.forca < 0.003) {
      this.forca = 0;
      a.rig.setDanca(0);
      b.rig.setDanca(0);
      return;
    }
    let v = 0;
    if (this.tVoltinha >= 0) {
      this.tVoltinha += dt;
      v = Math.min(1, this.tVoltinha / VOLTINHA);
      if (v >= 1) {
        this.tVoltinha = -1;
        v = 0;
        const r = this.aoVoltar;
        this.aoVoltar = null;
        r?.();
      }
    }
    // na voltinha o balanço quase para: quem gira está com o peso no meio
    this.fase += dt * BALANCO * (v > 0 ? 0.25 : 1);
    const papel = (quem: Player | Companion): PapelNaDanca => (quem.rig.spec.name === this.naCintura ? 'cintura' : 'ombros');
    a.rig.setDanca(this.forca, papel(a), this.fase, v);
    b.rig.setDanca(this.forca, papel(b), this.fase + Math.PI, v);
  }
}
