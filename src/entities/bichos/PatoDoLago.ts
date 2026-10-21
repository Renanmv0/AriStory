import * as THREE from 'three';
import { toon } from '../../core/materials';
import { fundir } from '../../world/fundir';
import { PALETTE as P } from '../../palette';
import { Bicho, type AreaDoBicho, type PoseDoBicho } from './Bicho';

/** o que separa o pato grande do patinho: cor, tamanho e proporção */
export interface FichaDePato {
  pena: number;
  sombra: number;
  bico: number;
  bicoEscuro: number;
  /** escala do bicho inteiro */
  escala: number;
  /** a cabeça em relação ao corpo: o patinho é quase só cabeça */
  cabeca: number;
  /** o rabinho de pena para cima (o patinho tem só um toquinho) */
  rabo: number;
  semente: number;
}

export const PATO_BRANCO: Omit<FichaDePato, 'semente'> = {
  pena: P.patoPena, sombra: P.patoPenaSombra, bico: P.patoBico, bicoEscuro: P.patoBicoEscuro,
  escala: 1.15, cabeca: 1, rabo: 1,
};
export const PATO_CREME: Omit<FichaDePato, 'semente'> = {
  pena: P.patoPenaSombra, sombra: 0xd9caa8, bico: P.patoBico, bicoEscuro: P.patoBicoEscuro,
  escala: 1.08, cabeca: 1, rabo: 1,
};
export const PATINHO: Omit<FichaDePato, 'semente'> = {
  pena: P.patinho, sombra: P.patinhoSombra, bico: P.patoBicoEscuro, bicoEscuro: P.patoBicoEscuro,
  escala: 0.52, cabeca: 1.4, rabo: 0.35,
};

/** o que o pato está fazendo além de nadar */
type Gesto = 'nenhum' | 'mergulho' | 'arrumar' | 'asas' | 'olhar';

const DURACAO: Record<Exclude<Gesto, 'nenhum'>, number> = {
  mergulho: 2.6,
  arrumar: 2.2,
  asas: 1.6,
  olhar: 1.8,
};

/**
 * O PATO DO LAGO — os patos brancos que estavam parados no lago desde a
 * primeira versão do parque, agora nadando de verdade.
 *
 * O CORPO segue o que o Jean-Luc já ensinou sobre o que faz pato ser lido como
 * pato: o bico de espátula (chato e largo, com a mandíbula um degrau abaixo),
 * o pescoço curto inclinado para a frente e o rabinho levantado. O pé não
 * aparece: pato de lago nada, e o chão do mundo esconde tudo o que está abaixo
 * da linha d'água — o corpo nasce com o terço de baixo enterrado nela.
 *
 * NADA EM CURVA (`curva` do `Bicho`): sem isso ele girava no lugar e saía
 * reto, como carrinho de controle. E entre um trecho e outro ele faz uma das
 * coisas que pato faz parado:
 *
 *  - **o mergulho de cabeça**: tomba para a frente até o rabo ficar de pé e a
 *    cabeça sumir na água, fica um pouco, e volta sacudindo — a cena ganha a
 *    marola na hora (`aoTocarAAgua`);
 *  - **arrumar a pena**: a cabeça vira para trás e bica a asa;
 *  - **bater as asas**: ergue o peito da água e bate quatro vezes;
 *  - **olhar em volta**: vira a cabeça devagar de um lado para o outro.
 *
 * O PATINHO é a mesma classe com outra ficha (`PATINHO`): amarelo, metade do
 * tamanho e a cabeça proporcionalmente maior — e quem o põe atrás da mãe é a
 * cena, com `seguir()`.
 */
export class PatoDoLago extends Bicho {
  private readonly ficha: FichaDePato;
  private readonly corpo = new THREE.Group();
  private readonly pescoco = new THREE.Group();
  private readonly cabeca = new THREE.Group();
  private readonly rabo = new THREE.Group();
  private readonly asas: THREE.Group[] = [];
  private gesto: Gesto = 'nenhum';
  private tGesto = 0;
  private ateGesto = 2;
  private olharAlvo = 0;
  /** o pato fugindo (assustado): o relógio do susto */
  private susto = 0;
  /** a cena liga aqui o som e a marola: o pato encostou a cabeça (ou as asas) na água */
  aoTocarAAgua: ((forca: number) => void) | null = null;
  /** de onde veio o último passo, para saber a velocidade (o rastro na água) */
  private readonly antes = new THREE.Vector3();
  private velocidadeAgora = 0;

  constructor(area: AreaDoBicho, ficha: FichaDePato) {
    super(area, {
      velocidade: ficha.escala < 0.6 ? 0.5 : 0.42,
      descansoMin: 1.5,
      descansoMax: 5,
      chanceDeSentar: 0,
      somCadaMin: ficha.escala < 0.6 ? 5 : 11,
      somCadaMax: ficha.escala < 0.6 ? 12 : 26,
      curva: 1.5,
      semente: ficha.semente,
    });
    this.ficha = ficha;
    this.montar();
    this.prontoParaAparecer(ficha.escala < 0.6 ? 'patinho' : 'pato-do-lago');
    this.antes.copy(this.group.position);
    this.ateGesto = 1 + this.sorte() * 5;
  }

  /** quanto ele anda agora, em m/s (o tamanho do V atrás dele) */
  get velocidade(): number {
    return this.velocidadeAgora;
  }

  get escala(): number {
    return this.ficha.escala;
  }

  /** a cabeça está debaixo d'água agora */
  get mergulhando(): boolean {
    return this.gesto === 'mergulho' && this.corpo.rotation.x > 0.9;
  }

  /**
   * O MAIOR TOMBO do último gesto (o teste mede o mergulho por aqui, e não
   * pela foto: o navegador do teste mostra poucos quadros por segundo).
   */
  maiorTombo = 0;

  get gestoAgora(): string {
    return this.gesto;
  }

  private montar(): void {
    const f = this.ficha;
    const pena = toon(f.pena);
    const sombra = toon(f.sombra);
    const bico = toon(f.bico);
    const bicoEscuro = toon(f.bicoEscuro);
    const filhote = f.escala < 0.6;

    // ------------------------------------------------------------- o corpo
    // o pivô do corpo é a LINHA D'ÁGUA no meio do bicho: é em volta dela que
    // ele tomba no mergulho, e a parte de baixo some no chão do mundo
    const barco = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), pena);
    barco.scale.set(0.15, filhote ? 0.13 : 0.115, filhote ? 0.19 : 0.24);
    barco.position.set(0, 0.045, -0.01);
    this.corpo.add(barco);
    const peito = new THREE.Mesh(new THREE.SphereGeometry(filhote ? 0.11 : 0.118, 14, 10), pena);
    peito.position.set(0, 0.075, filhote ? 0.08 : 0.12);
    this.corpo.add(peito);

    // o rabinho levantado: a cunha que diz "pato" de longe
    const cunha = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.17, 5), pena);
    cunha.scale.set(1, 1, 0.5);
    cunha.position.y = 0.07;
    this.rabo.add(cunha);
    this.rabo.position.set(0, 0.09, -0.2);
    this.rabo.rotation.x = -1.15;
    this.rabo.scale.setScalar(f.rabo);
    this.corpo.add(this.rabo);

    // as asas dobradas no LOMBO, num pivô no ombro (para abrir e bater). Elas
    // deitam por cima das costas, e não penduradas nos lados: de frente,
    // asa no flanco lia como dois bracinhos
    for (const lado of [-1, 1]) {
      const pivo = new THREE.Group();
      pivo.position.set(lado * 0.075, 0.125, 0.05);
      const asa = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), sombra);
      asa.scale.set(0.045, 0.065, filhote ? 0.1 : 0.17);
      asa.position.set(lado * 0.012, 0.0, -0.11);
      // o alto da asa encosta no lombo: a da esquerda (em -X) tomba com `z` negativo
      asa.rotation.set(0.15, 0, lado * 0.55);
      pivo.add(asa);
      // a ponta da asa cruzando por cima do rabo
      if (!filhote) {
        const ponta = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6), sombra);
        ponta.scale.set(0.035, 0.035, 0.09);
        ponta.position.set(lado * 0.0, 0.0, -0.25);
        ponta.rotation.x = -0.35;
        pivo.add(ponta);
      }
      this.asas.push(pivo);
      this.corpo.add(pivo);
    }

    // ------------------------------------------------- o pescoço e a cabeça
    const k = f.cabeca;
    const colo = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.065, 0.13, 10), pena);
    colo.position.y = 0.06;
    this.pescoco.add(colo);
    this.pescoco.position.set(0, 0.12, filhote ? 0.1 : 0.15);
    this.pescoco.rotation.x = 0.28;
    this.corpo.add(this.pescoco);

    const cranio = new THREE.Mesh(new THREE.SphereGeometry(0.085 * k, 14, 10), pena);
    cranio.scale.set(0.95, 1, 1.08);
    this.cabeca.add(cranio);
    // o bico de espátula: chato, largo, com a mandíbula um degrau abaixo
    const espatula = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), bico);
    espatula.scale.set(0.044 * k, 0.017 * k, 0.078 * k);
    espatula.position.set(0, -0.012 * k, 0.098 * k);
    this.cabeca.add(espatula);
    const mandibula = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6), bicoEscuro);
    mandibula.scale.set(0.037 * k, 0.012 * k, 0.066 * k);
    mandibula.position.set(0, -0.025 * k, 0.092 * k);
    this.cabeca.add(mandibula);
    for (const lado of [-1, 1]) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.0145 * k, 8, 6), toon(P.pragaPupila));
      olho.position.set(lado * 0.056 * k, 0.022 * k, 0.045 * k);
      this.cabeca.add(olho);
      const brilho = new THREE.Mesh(new THREE.SphereGeometry(0.0048 * k, 6, 4), toon(P.patoPena));
      brilho.position.set(lado * 0.064 * k, 0.03 * k, 0.052 * k);
      this.cabeca.add(brilho);
      if (filhote) {
        // a bochecha do patinho, que é o que deixa ele fofo de perto
        const bochecha = new THREE.Mesh(new THREE.SphereGeometry(0.014 * k, 8, 5), toon(P.patoBochecha));
        bochecha.scale.set(1, 0.6, 1);
        bochecha.position.set(lado * 0.06 * k, -0.008 * k, 0.04 * k);
        this.cabeca.add(bochecha);
      }
    }
    this.cabeca.position.set(0, 0.13 + (k - 1) * 0.03, 0.01);
    this.pescoco.add(this.cabeca);

    this.group.add(this.corpo);
    this.group.scale.setScalar(f.escala);
    // o que se mexe tem nome (é fronteira do \`fundir\`); o resto de cada parte
    // vira uma malha por material — o pato desenha metade das vezes
    this.corpo.name = 'corpo';
    this.pescoco.name = 'pescoco';
    this.cabeca.name = 'cabeca';
    this.rabo.name = 'rabo';
    for (const asa of this.asas) asa.name = 'asa';
    fundir(this.group);
  }

  /**
   * O SUSTO: algo caiu perto (a pedrinha, a moeda) ou alguém chegou pisando
   * forte. Ele bate as asas e nada para longe do ponto, rápido, e depois volta
   * a passear.
   */
  assustar(deX: number, deZ: number, para: { x: number; z: number }): void {
    if (this.susto > 0) return;
    this.susto = 2.2;
    this.gesto = 'asas';
    this.tGesto = 0;
    this.aoTocarAAgua?.(1);
    void deX;
    void deZ;
    void this.irPara(para.x, para.z, 1.2).then(() => {
      if (this.susto <= 0) this.voltarAPassear();
    });
  }

  /** a cena pediu um gesto (o teste mede um por um) */
  fazer(gesto: Exclude<Gesto, 'nenhum'>): void {
    this.gesto = gesto;
    this.tGesto = 0;
    this.maiorTombo = 0;
  }

  protected animar(dt: number, { andando, fase }: PoseDoBicho): void {
    const g = this.group.position;
    this.velocidadeAgora += (Math.hypot(g.x - this.antes.x, g.z - this.antes.z) / Math.max(dt, 1e-4) - this.velocidadeAgora) * Math.min(1, dt * 6);
    this.antes.copy(g);

    if (this.susto > 0) {
      this.susto -= dt;
      if (this.susto <= 0) this.voltarAPassear();
    }

    // -------------------------------------------- escolher o próximo gesto
    if (this.gesto === 'nenhum') {
      this.ateGesto -= dt;
      if (this.ateGesto <= 0 && !andando) {
        const s = this.sorte();
        this.gesto = s < 0.38 ? 'mergulho' : s < 0.62 ? 'olhar' : s < 0.86 ? 'arrumar' : 'asas';
        this.tGesto = 0;
        this.olharAlvo = (this.sorte() - 0.5) * 2.2;
      }
    } else {
      this.tGesto += dt;
      // nadando, o gesto de parado se desfaz (menos as asas do susto)
      const dur = DURACAO[this.gesto];
      if (this.tGesto >= dur || (andando && this.gesto !== 'asas' && this.susto <= 0)) {
        this.gesto = 'nenhum';
        this.ateGesto = 2.5 + this.sorte() * 6;
      }
    }

    // --------------------------------------------------------- a pose base
    const boia = Math.sin(fase * 2.1) * 0.006;
    let corpoX = Math.sin(fase * 1.3) * 0.02;
    let corpoY = boia;
    let pescocoX = 0.28 + (andando ? Math.sin(fase * 7) * 0.05 : Math.sin(fase * 0.8) * 0.03);
    let cabecaY = Math.sin(fase * 0.45) * 0.3;
    let cabecaX = 0;
    let raboX = -1.15 + Math.sin(fase * (andando ? 6 : 1.4)) * 0.06;
    let raboZ = 0;
    const abre = [0, 0];

    const k = this.gesto === 'nenhum' ? 0 : this.tGesto / DURACAO[this.gesto];
    const sobe = (a: number, b: number, x: number): number => Math.max(0, Math.min(1, (x - a) / (b - a)));
    switch (this.gesto) {
      case 'mergulho': {
        // tomba (0–0,2), fica de rabo para cima (0,2–0,7), volta (0,7–0,85) e sacode
        const tomba = sobe(0, 0.2, k) * (1 - sobe(0.7, 0.85, k));
        const suave = tomba * tomba * (3 - 2 * tomba);
        corpoX = 1.35 * suave + Math.sin(this.tGesto * 9) * 0.04 * suave;
        corpoY = boia + 0.015 * suave;
        raboZ = Math.sin(this.tGesto * 14) * 0.25 * suave;
        pescocoX = 0.28 + 0.7 * suave;
        const sacode = sobe(0.85, 0.9, k) * (1 - sobe(0.95, 1, k));
        cabecaY = Math.sin(this.tGesto * 40) * 0.5 * sacode;
        if (this.tGesto - dt < DURACAO.mergulho * 0.12 && this.tGesto >= DURACAO.mergulho * 0.12) this.aoTocarAAgua?.(0.6);
        if (this.tGesto - dt < DURACAO.mergulho * 0.8 && this.tGesto >= DURACAO.mergulho * 0.8) this.aoTocarAAgua?.(0.5);
        break;
      }
      case 'arrumar': {
        const vira = Math.sin(Math.min(1, k * 1.25) * Math.PI);
        cabecaY = 2.3 * vira;
        cabecaX = 0.5 * vira;
        pescocoX = 0.28 - 0.55 * vira;
        cabecaY += Math.sin(this.tGesto * 22) * 0.12 * vira;
        break;
      }
      case 'asas': {
        const ergue = Math.sin(Math.min(1, k * 1.15) * Math.PI);
        corpoX = -0.45 * ergue;
        corpoY = boia + 0.07 * ergue;
        const bate = Math.sin(this.tGesto * 15);
        abre[0] = (0.6 + 0.55 * bate) * ergue;
        abre[1] = (0.6 + 0.55 * bate) * ergue;
        pescocoX = 0.1;
        if (this.tGesto - dt < 0.25 && this.tGesto >= 0.25) this.aoTocarAAgua?.(0.9);
        break;
      }
      case 'olhar':
        cabecaY = this.olharAlvo * Math.sin(k * Math.PI);
        break;
    }

    const lerp = Math.min(1, dt * 9);
    this.corpo.rotation.x += (corpoX - this.corpo.rotation.x) * lerp;
    if (this.gesto !== 'nenhum') this.maiorTombo = Math.max(this.maiorTombo, this.corpo.rotation.x);
    this.corpo.position.y += (corpoY - this.corpo.position.y) * lerp;
    this.corpo.rotation.z = Math.sin(fase * 1.7) * 0.03;
    this.pescoco.rotation.x += (pescocoX - this.pescoco.rotation.x) * lerp;
    this.cabeca.rotation.y += (cabecaY - this.cabeca.rotation.y) * Math.min(1, dt * 6);
    this.cabeca.rotation.x += (cabecaX - this.cabeca.rotation.x) * lerp;
    this.rabo.rotation.x += (raboX - this.rabo.rotation.x) * lerp;
    this.rabo.rotation.z = raboZ;
    // a asa da esquerda nasce em -X: erguer é `rotation.z` NEGATIVO nela
    this.asas[0].rotation.z += (-abre[0] - this.asas[0].rotation.z) * Math.min(1, dt * 18);
    this.asas[1].rotation.z += (abre[1] - this.asas[1].rotation.z) * Math.min(1, dt * 18);
  }
}
