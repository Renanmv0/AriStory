import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import { Marcas, Particulas } from '../../world/particulas';
import type { EstiloDoJato } from './cartas';
import type { SomNome } from '../../audio/efeitos';

/**
 * O JATO DO REGADOR — tudo o que se VÊ quando a rodada ataca.
 *
 * A regra é do Renan, e ela manda neste arquivo inteiro: **toda carta que
 * mexe no jato muda alguma coisa na animação de ataque**, e muda do jeito que
 * a carta DESCREVE. A tabela carta por carta está no §6 do plano ("O jato
 * também muda de cara"); cada método daqui é uma linha daquela tabela.
 *
 * ESTE ARQUIVO SÓ DESENHA. Quem decide quem leva água, quanto e quando é a
 * rodada (`rodada.ts`); aqui chega "sai daqui, vai para lá, com este estilo",
 * e volta um aviso na hora em que a água CHEGA (`aoChegar`) — o dano acontece
 * quando o jogador vê a água bater, e não quando o jato sai.
 *
 * O TEMPO É O DA RODADA. Tudo anda em `update(dt)`, e a rodada não chama
 * `update` enquanto a tela de cartas está aberta: a água congela no ar junto
 * com o resto, em vez de continuar caindo por trás do pop-up.
 *
 * ================================================ AS QUATRO CAMADAS
 *
 * - **forma** — por onde a água vai: `jatoEm()` escolhe cone, fio, linha,
 *   arco ou três fios;
 * - **tinta** — a cor e a textura: `corDaAgua()` e os enfeites do caminho
 *   (vapor, bolhas, cristais, arco-íris);
 * - **impacto** — `respingo()` e o que acompanha (tranco, cristais, vapor);
 * - **chão** — `poca()`, `garoa()`, `rachadura()`.
 */

// ------------------------------------------------------------------ ajustes

/** metros por segundo da água do jato básico */
const VELOCIDADE = 8.5;
/** a gravidade da água do jato: menor que a de verdade, para o arco ser bonito */
const GRAVIDADE = 7;
/** quanto tempo o jato fica saindo do bico, em segundos */
const DURACAO = 0.16;

const ARCO_IRIS = [P.arcoIris1, P.arcoIris2, P.arcoIris3, P.arcoIris4, P.arcoIris5, P.arcoIris6];

/** Um jato que está saindo agora: a rodada pede, e ele emite quadro a quadro. */
interface JatoNoAr {
  de: THREE.Vector3;
  para: THREE.Vector3;
  /** segundos que ainda falta sair água */
  resta: number;
  duracao: number;
  /** quantas gotas por segundo */
  taxa: number;
  acumulado: number;
  forma: 'cone' | 'fio' | 'linha' | 'arco' | 'reto';
  /** meia abertura do leque, em radianos */
  abertura: number;
  tamanho: number;
  velocidade: number;
  gravidade: number;
  tinta: Tinta;
  contador: number;
  /** o vapor do Orvalho e as bolhas do sabão vão junto */
  vapor: boolean;
  bolhas: boolean;
}

type Tinta = 'agua' | 'gelo' | 'sabao' | 'arco-iris' | 'carga';

/** Um aviso marcado no relógio do jato: "daqui a t segundos, faça isto". */
interface Agendado { t: number; fazer: () => void }

export interface Disparo {
  /** a ponta do bico */
  de: THREE.Vector3;
  /** onde a água cai (o bicho, ou o ponto no chão) */
  para: THREE.Vector3;
  estilo: EstiloDoJato;
  /** a abertura do leque, em graus (`FichaDaRodada.largura`) */
  largura: number;
  /** chamado quando a água chega em `para` */
  aoChegar?: () => void;
  /** o jato especial deste disparo, quando há um */
  especial?: 'pressao-cheia' | 'carregado' | 'arco-iris';
  /** força a forma (o borrifador desenha três fios, o segundo bico um cone) */
  forma?: JatoNoAr['forma'];
}

/**
 * O QUE O DESENHO JÁ FEZ, contado. É o que o teste (`scripts/jato.mjs`) lê para
 * provar que cada carta desenhou o efeito dela — foto sozinha não diz se a
 * poça apareceu porque a carta mandou ou por acaso.
 */
export interface ContagemDoJato {
  disparos: number;
  formas: Record<string, number>;
  tintas: Record<string, number>;
  respingos: number;
  trancos: number;
  cristais: number;
  vapores: number;
  bolhas: number;
  pocas: number;
  garoas: number;
  rachaduras: number;
  geiseres: number;
  aneis: number;
  carga: number;
  arcosIris: number;
  sacudidas: number;
  miras: number;
  chuvas: number;
  /** os jatos especiais: tanque cheio, carregado, o décimo do arco-íris */
  especiais: Record<string, number>;
  /** o vapor do Orvalho no caminho do jato */
  vaporDoCaminho: number;
  /** a gota mais alta que já subiu (o Jato em arco) */
  alturaMaxima: number;
  // o que não é jato: as cartas de jardineiro e de jardim
  poeiras: number;
  notas: number;
  ondas: number;
  brotos: number;
  ardidos: number;
  adubos: number;
}

function contagemZerada(): ContagemDoJato {
  return {
    disparos: 0, formas: {}, tintas: {}, respingos: 0, trancos: 0, cristais: 0, vapores: 0,
    bolhas: 0, pocas: 0, garoas: 0, rachaduras: 0, geiseres: 0, aneis: 0, carga: 0,
    arcosIris: 0, sacudidas: 0, miras: 0, chuvas: 0, especiais: {}, vaporDoCaminho: 0, alturaMaxima: 0,
    poeiras: 0, notas: 0, ondas: 0, brotos: 0, ardidos: 0, adubos: 0,
  };
}

export class DesenhoDoJato {
  readonly grupo = new THREE.Group();
  readonly contagem: ContagemDoJato = contagemZerada();
  /**
   * O SOM de cada efeito. O desenho sabe QUAL efeito aconteceu, então é ele
   * quem escolhe o som (a tabela do §6: um por carta que muda o jato); quem
   * toca é a rodada, que tem o `GameAPI`.
   */
  aoSoar: ((nome: SomNome) => void) | null = null;
  private soar(nome: SomNome): void {
    this.aoSoar?.(nome);
  }
  private cargaAvisada = false;
  /** a água: gotas opacas com um brilho leve */
  private readonly agua = new Particulas(900, 0.28, 1, 6);
  /** faíscas: brilho forte (arco-íris, gelo, carga) */
  private readonly faiscas = new Particulas(420, 0.4, 1, 5);
  /** o que é translúcido: vapor e bolhas */
  private readonly nevoa = new Particulas(220, 0.35, 0.45, 8);
  /** poeirinha de terra e folhas picadas: opaco e sem brilho */
  private readonly terra = new Particulas(160, 0, 1, 4);
  private readonly aneis = new Marcas('anel', 60, 0.7, 0.3);
  private readonly pocas = new Marcas('disco', 90, 0.55, 0.35);
  private readonly rachas = new Marcas('disco', 40, 0.85, 0);

  private readonly noAr: JatoNoAr[] = [];
  private readonly agenda: Agendado[] = [];
  private relogio = 0;

  /** o alvinho das miras, reaproveitado */
  private readonly alvinho: THREE.Group;
  private alvinhoResta = 0;
  private alvinhoSegue: THREE.Object3D | null = null;
  private alvinhoAltura = 1;

  /** as bolhas grandes do sabão: malhas reaproveitadas */
  private readonly bolhas: Array<{ malha: THREE.Mesh; idade: number; viva: boolean; raio: number }> = [];

  /** a nuvem da Chuva e da Dança da chuva */
  private readonly nuvem: THREE.Group;
  private nuvemResta = 0;
  private nuvemTotal = 0;
  /** o tamanho da NUVEM desenhada, que não é o da chuva */
  private nuvemRaio = 1;
  private nuvemChove = 0;
  /** onde a chuva cai, e de que altura: pode ser muito maior que a nuvem */
  private chuvaCentro = new THREE.Vector3();
  private chuvaRaio = 1;
  private chuvaAltura = 3;
  /** a chuvinha é um som de 1 s: enquanto chove, ele se repete */
  private proximaChuvinha = 0;

  constructor() {
    this.grupo.name = 'jato-do-regador';
    for (const pool of [this.agua, this.faiscas, this.nevoa, this.terra]) this.grupo.add(pool.malha);
    for (const m of [this.aneis, this.pocas, this.rachas]) this.grupo.add(m.malha);

    this.alvinho = montarAlvinho();
    this.alvinho.visible = false;
    this.grupo.add(this.alvinho);

    for (let i = 0; i < 6; i++) {
      const malha = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 12),
        toon(P.jatoSabao, { opacity: 0.42, glow: 0.3 }),
      );
      malha.visible = false;
      malha.renderOrder = 6;
      // o brilho da bolha: uma calota branca pequena, como reflexo de janela
      const reflexo = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), toon(P.jatoCristal, { glow: 0.9 }));
      reflexo.position.set(-0.45, 0.55, 0.6);
      reflexo.scale.set(1, 0.6, 0.5);
      malha.add(reflexo);
      this.grupo.add(malha);
      this.bolhas.push({ malha, idade: 0, viva: false, raio: 0.4 });
    }

    this.nuvem = montarNuvem();
    this.nuvem.visible = false;
    this.grupo.add(this.nuvem);
  }

  // ============================================================ o relógio

  /** Faz algo daqui a `t` segundos de RODADA (congela junto com ela). */
  depois(t: number, fazer: () => void): void {
    this.agenda.push({ t: this.relogio + t, fazer });
  }

  update(dt: number): void {
    this.relogio += dt;
    for (let i = this.agenda.length - 1; i >= 0; i--) {
      if (this.agenda[i].t <= this.relogio) {
        const { fazer } = this.agenda[i];
        this.agenda.splice(i, 1);
        fazer();
      }
    }
    for (let i = this.noAr.length - 1; i >= 0; i--) {
      const j = this.noAr[i];
      const agora = Math.min(dt, j.resta);
      j.resta -= dt;
      j.acumulado += agora * j.taxa;
      // as gotas deste quadro nascem espalhadas no tempo dele (ver `adiantar`):
      // a primeira já voou quase o quadro inteiro, a última acabou de sair
      const quantas = Math.floor(j.acumulado);
      for (let k = 0; k < quantas; k++) {
        j.acumulado -= 1;
        this.gotaDoJato(j, agora * (1 - (k + 0.5) / quantas));
      }
      if (j.resta <= 0) this.noAr.splice(i, 1);
    }
    this.agua.update(dt);
    this.faiscas.update(dt);
    this.nevoa.update(dt);
    this.terra.update(dt);
    this.aneis.update(dt);
    this.pocas.update(dt);
    this.rachas.update(dt);
    this.animarAlvinho(dt);
    this.animarBolhas(dt);
    this.animarNuvem(dt);
  }

  /** para o teste e para o painel: tem água no ar? */
  get gotasNoAr(): number {
    return this.agua.vivas + this.faiscas.vivas;
  }

  /** poças no chão agora — a regra da Poça consulta aqui */
  pocasPerto(x: number, z: number): number {
    return this.pocas.vivasPerto(x, z, 0);
  }

  limpar(): void {
    this.noAr.length = 0;
    this.agenda.length = 0;
    for (const pool of [this.agua, this.faiscas, this.nevoa, this.terra]) pool.limpar();
    for (const m of [this.aneis, this.pocas, this.rachas]) m.limpar();
    this.alvinho.visible = false;
    this.alvinhoResta = 0;
    for (const b of this.bolhas) {
      b.viva = false;
      b.malha.visible = false;
    }
    this.nuvem.visible = false;
    this.nuvemResta = 0;
  }

  dispose(): void {
    for (const pool of [this.agua, this.faiscas, this.nevoa, this.terra]) pool.dispose();
    for (const m of [this.aneis, this.pocas, this.rachas]) m.dispose();
  }

  // ======================================================== O JATO (forma)

  /**
   * UM JATO: sai do bico e vai até `para`.
   *
   * A FORMA sai do estilo, na ordem de quem manda mais: o jatão carregado e a
   * pressão são RETOS; o Jato em arco sobe em parábola; a Mangueira é uma
   * linha comprida e fina; o resto é o CONE do básico, que o Leque abre. Devolve
   * o tempo que a água leva para chegar — a rodada agenda o dano para essa hora.
   */
  disparar(d: Disparo): number {
    const e = d.estilo;
    const especial = d.especial;
    /*
     * AS FORMAS SE SOMAM, e não se apagam (regra do Renan: carta com carta
     * vira build). Arco com Pressão é um arco que passa do bicho (quem estica
     * o `para` é a rodada); Arco com Mangueira é um arco fino e comprido; o
     * Leque abre qualquer forma, e não só o cone.
     */
    const forma: JatoNoAr['forma'] = d.forma
      ?? (especial === 'carregado' ? 'reto'
        : e.arco ? 'arco'
          : e.reto ? 'reto'
            : e.mangueira ? 'linha'
              : 'cone');
    const tinta: Tinta = especial === 'arco-iris' ? 'arco-iris'
      : especial === 'carregado' ? 'carga'
        : e.gelo ? 'gelo'
          : e.sabao ? 'sabao'
            : 'agua';

    const dist = Math.hypot(d.para.x - d.de.x, d.para.z - d.de.z);
    // cada forma tem a sua velocidade, e é isso que dá o caráter dela
    const gravidade = forma === 'reto' ? 0.6 : forma === 'arco' ? 9 : forma === 'linha' ? 4 : GRAVIDADE;
    /*
     * O ARCO é decidido pela ALTURA, e não pela velocidade: a carta diz que
     * ele passa por cima do canteiro, então o topo fica bem acima do bico
     * (1,2 m, mais um pouco quanto mais longe). A velocidade de lado sai da
     * conta do tempo de voo que essa altura dá.
     */
    let velocidade = forma === 'reto' ? 14 : forma === 'linha' ? 11 : VELOCIDADE;
    if (forma === 'arco') {
      const topo = 1.2 + dist * 0.12;
      const sobe = Math.sqrt(2 * gravidade * topo);
      const desce = d.para.y - d.de.y;
      // y(T) = sobe·T − g·T²/2 = desce  →  a raiz positiva
      const T = (sobe + Math.sqrt(sobe * sobe - 2 * gravidade * desce)) / gravidade;
      velocidade = Math.max(1.5, dist / T);
    }
    const grosso = (e.grosso ?? 0) + (especial === 'pressao-cheia' ? 3 : 0) + (especial === 'carregado' ? 4 : 0);
    const aberto = e.aberto ?? 0;

    const arcoFino = forma === 'arco' && !!e.mangueira;
    const abertura = forma === 'cone'
      ? THREE.MathUtils.degToRad(d.largura) / 2 * 0.55
      : forma === 'fio' ? 0.04
        : forma === 'linha' ? 0.025 + aberto * 0.03
          : forma === 'reto' ? 0.02 + aberto * 0.02
            : (arcoFino ? 0.04 : 0.1) + aberto * 0.04;
    const duracao = forma === 'linha' || arcoFino ? 0.34 : forma === 'reto' ? 0.22 : forma === 'arco' ? 0.2 : DURACAO;
    // mais gotas quando o leque abre (as da borda) e quando o jato engrossa
    const quantas = (forma === 'linha' || arcoFino ? 56 : forma === 'fio' ? 22 : 44) + aberto * 8 + grosso * 5
      + (especial ? 18 : 0);

    this.contagem.disparos += 1;
    this.contagem.formas[forma] = (this.contagem.formas[forma] ?? 0) + 1;
    this.contagem.tintas[tinta] = (this.contagem.tintas[tinta] ?? 0) + 1;
    if (especial) this.contagem.especiais[especial] = (this.contagem.especiais[especial] ?? 0) + 1;
    this.noAr.push({
      de: d.de.clone(),
      para: d.para.clone(),
      resta: duracao,
      duracao,
      taxa: quantas / duracao,
      acumulado: 0,
      forma,
      abertura,
      tamanho: (forma === 'linha' || forma === 'fio' ? 0.02 : forma === 'reto' ? 0.036 : 0.03) * (1 + grosso * 0.22),
      velocidade,
      gravidade,
      tinta,
      contador: 0,
      vapor: !!e.vapor,
      bolhas: !!e.sabao,
    });

    // O SOM DA SAÍDA: o especial manda, depois a forma, depois a tinta
    if (especial === 'carregado') this.soar('jatao');
    else if (especial === 'pressao-cheia' || forma === 'reto') this.soar('jatoForte');
    else if (forma === 'linha') this.soar('jatoLongo');
    else if (forma === 'arco') this.soar('jatoArco');
    else this.soar('jato');
    if (especial === 'arco-iris') this.soar('arcoIris');
    if (tinta === 'sabao') this.soar('bolha');
    if (e.vapor) this.soar('vapor');
    // na saída: um borrifo pequeno no bico, que é o "fsh" visual
    this.borrifoNoBico(d.de, d.para, tinta, especial === 'pressao-cheia' || especial === 'carregado');

    const tempo = dist / velocidade + duracao * 0.5;
    if (d.aoChegar) this.depois(tempo, d.aoChegar);
    return tempo;
  }

  /** uma gota do jato, com a forma e a tinta dele */
  private gotaDoJato(j: JatoNoAr, adiantar = 0): void {
    j.contador += 1;
    const dx = j.para.x - j.de.x;
    const dz = j.para.z - j.de.z;
    const dist = Math.max(0.3, Math.hypot(dx, dz));
    const rumo = Math.atan2(dx, dz);

    /*
     * O MIOLO E O LEQUE. Metade das gotas sai no MESMO trilho, uma colada na
     * outra: é o fio contínuo que faz o jato ler como água correndo, e não como
     * chuva de bolinha. A outra metade abre o leque em volta (a maioria perto
     * do meio, algumas na borda) — é ela que desenha o cone e que o Leque
     * aberto alarga.
     */
    const miolo = j.contador % 2 === 0;
    const sorteio = Math.random() * 2 - 1;
    const desvio = miolo
      ? sorteio * 0.015
      : j.forma === 'cone'
        ? Math.sign(sorteio) * Math.abs(sorteio) ** 1.4 * j.abertura
        : sorteio * j.abertura;
    const r = rumo + desvio;
    // a distância também espalha um pouco: o jato não cai todo num ponto
    const alcance = dist * (miolo ? 0.98 + Math.random() * 0.04 : 0.88 + Math.random() * 0.24);
    const tempo = alcance / j.velocidade;
    const dy = j.para.y - j.de.y;
    const vy = (dy + 0.5 * j.gravidade * tempo * tempo) / tempo;

    // o topo da parábola desta gota — é o que prova que o Jato em arco subiu
    if (vy > 0) this.contagem.alturaMaxima = Math.max(this.contagem.alturaMaxima, j.de.y + (vy * vy) / (2 * Math.max(0.1, j.gravidade)));
    const cor = this.corDaAgua(j.tinta, j.contador, miolo);
    const pool = j.tinta === 'arco-iris' || j.tinta === 'carga' ? this.faiscas : this.agua;
    pool.emitir({
      x: j.de.x, y: j.de.y, z: j.de.z,
      vx: Math.sin(r) * j.velocidade,
      vy,
      vz: Math.cos(r) * j.velocidade,
      vida: tempo + 0.25,
      tamanho: j.tamanho * (miolo ? 1.25 : 0.8) * (0.85 + Math.random() * 0.3),
      cor,
      gravidade: j.gravidade,
      esticar: j.forma === 'linha' || j.forma === 'reto' ? 0.02 : 0.011,
      adiantar,
    });

    // o GELO solta faísca no caminho: é o "tilintar" que se vê
    if (j.tinta === 'gelo' && j.contador % 3 === 0) {
      this.faiscas.emitir({
        x: j.de.x, y: j.de.y, z: j.de.z,
        vx: Math.sin(r) * j.velocidade * 0.9, vy: vy * 0.9, vz: Math.cos(r) * j.velocidade * 0.9,
        vida: tempo, tamanho: 0.018, cor: P.jatoCristal, gravidade: j.gravidade,
      });
    }
    // o ORVALHO: vapor fininho nascendo ao longo do caminho, subindo devagar
    if (j.vapor && j.contador % 7 === 0) {
      this.contagem.vaporDoCaminho += 1;
      const t = 0.15 + Math.random() * 0.7;
      this.nevoa.emitir({
        x: j.de.x + dx * t, y: j.de.y + dy * t * 0.8 + 0.12, z: j.de.z + dz * t,
        vx: (Math.random() - 0.5) * 0.15, vy: 0.3, vz: (Math.random() - 0.5) * 0.15,
        vida: 0.9, tamanho: 0.035, cor: P.jatoVapor, gravidade: -0.25, arrasto: 1.2, cresce: 1.2,
        balanco: 0.3,
      });
    }
    // o SABÃO: bolhinhas no meio do jato, mais lentas, que sobem ao chegar
    if (j.bolhas && j.contador % 4 === 1) {
      this.nevoa.emitir({
        x: j.de.x, y: j.de.y, z: j.de.z,
        vx: Math.sin(r) * j.velocidade * 0.75, vy: vy * 0.55, vz: Math.cos(r) * j.velocidade * 0.75,
        vida: tempo * 1.5 + 0.7, tamanho: 0.05 + Math.random() * 0.05,
        cor: Math.random() < 0.5 ? P.jatoSabao : P.jatoSabaoBorda,
        gravidade: 1.2, arrasto: 0.6, balanco: 0.4, chao: 'quica',
      });
    }
  }

  /** A TINTA: de que cor sai cada gota. */
  private corDaAgua(tinta: Tinta, n: number, miolo: boolean): number {
    switch (tinta) {
      case 'arco-iris': return ARCO_IRIS[n % ARCO_IRIS.length];
      case 'gelo': return miolo ? P.jatoCristal : P.jatoGelo;
      case 'sabao': return miolo ? P.jatoMiolo : (n % 3 ? P.jatoAgua : P.jatoSabao);
      case 'carga': return miolo ? P.jatoCarga : P.jatoMiolo;
      default: return miolo ? (n % 2 ? P.jatoMiolo : P.jatoAgua) : (n % 3 === 0 ? P.jatoFundo : P.jatoAgua);
    }
  }

  /** o borrifo na ponta do bico, quando o jato sai */
  private borrifoNoBico(de: THREE.Vector3, para: THREE.Vector3, tinta: Tinta, forte: boolean): void {
    const rumo = Math.atan2(para.x - de.x, para.z - de.z);
    const n = forte ? 12 : 5;
    for (let i = 0; i < n; i++) {
      const a = rumo + (Math.random() - 0.5) * 1.6;
      const v = 1.2 + Math.random() * (forte ? 2.4 : 1.2);
      this.agua.emitir({
        x: de.x, y: de.y, z: de.z,
        vx: Math.sin(a) * v, vy: 0.8 + Math.random() * 1.2, vz: Math.cos(a) * v,
        vida: 0.45, tamanho: 0.022, cor: this.corDaAgua(tinta, i, true), gravidade: 9,
      });
    }
    if (forte) this.aneis.deixar({ x: de.x, z: de.z, raio: 0.35, vida: 0.4, cor: P.jatoRespingo, abrir: 3, y: de.y });
  }

  // ======================================================== o IMPACTO

  /**
   * O RESPINGO NO BICHO — o que diz "acertou".
   *
   * `forca` cresce com o Jato firme (gota mais grossa, respingo maior) e com
   * os jatos especiais. O anel no chão é o que se lê de longe; as gotas que
   * sobem são o que se lê de perto.
   */
  respingo(
    x: number, y: number, z: number, estilo: EstiloDoJato, forca = 1, tinta: Tinta = 'agua', comSom = true,
  ): void {
    this.contagem.respingos += 1;
    if (comSom) this.soar('respingo');
    const f = forca * (1 + (estilo.grosso ?? 0) * 0.3);
    const n = Math.round(9 * f);
    const cor = tinta === 'agua'
      ? (estilo.gelo ? 'gelo' : estilo.sabao ? 'sabao' : 'agua')
      : tinta;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.8 + Math.random() * 1.6 * f;
      this.agua.emitir({
        x, y, z,
        vx: Math.cos(a) * v, vy: 1.6 + Math.random() * 2.2 * Math.sqrt(f), vz: Math.sin(a) * v,
        vida: 0.7, tamanho: 0.03 + Math.random() * 0.025 * f,
        cor: this.corDaAgua(cor as Tinta, i, i % 2 === 0), gravidade: 9, chao: 'some',
      });
    }
    this.aneis.deixar({ x, z, raio: 0.28 * Math.sqrt(f), vida: 0.45, cor: P.jatoRespingo, abrir: 2.4 });
  }

  /**
   * A GOTA PESADA: o bicho dá um TRANCO para trás, e o chão levanta poeira
   * atrás dele. O tranco do corpo quem faz é a rodada (ela move o bicho); o
   * que é daqui é a poeirinha, que é o que VENDE o peso.
   */
  tranco(x: number, z: number, rumo: number, degrau: number): void {
    this.contagem.trancos += 1;
    this.soar('tranco');
    const n = 4 + degrau * 3;
    for (let i = 0; i < n; i++) {
      const a = rumo + Math.PI + (Math.random() - 0.5) * 1.4;
      const v = 0.6 + Math.random() * 0.9 * degrau;
      this.terra.emitir({
        x: x + Math.sin(rumo) * 0.15, y: 0.05, z: z + Math.cos(rumo) * 0.15,
        vx: Math.sin(a) * -v, vy: 0.6 + Math.random() * 0.7, vz: Math.cos(a) * -v,
        vida: 0.5, tamanho: 0.035 + Math.random() * 0.03, cor: P.terraUmida, gravidade: 5, arrasto: 2,
      });
    }
  }

  /**
   * A GOTA GELADA: cristaizinhos grudam no bicho molhado. Eles são filhos do
   * próprio bicho (andam com ele) e somem sozinhos quando o frio passa — quem
   * sabe o tempo é a rodada, que chama `derreter`.
   */
  congelar(bicho: THREE.Object3D, altura: number): void {
    this.contagem.cristais += 1;
    this.soar('gelo');
    let cristais = bicho.getObjectByName('cristais-de-gelo');
    if (!cristais) {
      cristais = new THREE.Group();
      cristais.name = 'cristais-de-gelo';
      for (let i = 0; i < 6; i++) {
        const c = new THREE.Mesh(new THREE.OctahedronGeometry(0.05 + (i % 3) * 0.015, 0), toon(P.jatoGelo, { glow: 0.55 }));
        const a = (i / 6) * Math.PI * 2;
        c.position.set(Math.cos(a) * 0.2, altura * (0.35 + (i % 3) * 0.2), Math.sin(a) * 0.2);
        c.rotation.set(i, i * 0.7, 0);
        c.scale.y = 1.6;
        cristais.add(c);
      }
      bicho.add(cristais);
    }
    cristais.visible = true;
    cristais.userData.brilho = 0;
    // o estalo do gelo: faíscas brancas no bicho
    const p = new THREE.Vector3();
    bicho.getWorldPosition(p);
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * 6.28;
      this.faiscas.emitir({
        x: p.x, y: altura * 0.6, z: p.z,
        vx: Math.cos(a) * 0.8, vy: 1 + Math.random(), vz: Math.sin(a) * 0.8,
        vida: 0.5, tamanho: 0.02, cor: P.jatoCristal, gravidade: 4,
      });
    }
  }

  derreter(bicho: THREE.Object3D): void {
    const cristais = bicho.getObjectByName('cristais-de-gelo');
    if (cristais) cristais.visible = false;
  }

  /** a Água morna: vapor sobe do bicho grande quando leva jato */
  vaporDoBicho(x: number, altura: number, z: number): void {
    this.contagem.vapores += 1;
    this.soar('vapor');
    for (let i = 0; i < 7; i++) {
      this.nevoa.emitir({
        x: x + (Math.random() - 0.5) * 0.5, y: altura * 0.7, z: z + (Math.random() - 0.5) * 0.5,
        vy: 0.5 + Math.random() * 0.3, vida: 1.3, tamanho: 0.08, cor: P.jatoVapor,
        gravidade: -0.3, arrasto: 1, cresce: 2.2, balanco: 0.3,
      });
    }
  }

  /**
   * A BOLHA GRANDE DO SABÃO: nasce no bicho espantado, incha, sobe um palmo e
   * ESTOURA num anel de gotas — é nessa hora que ela molha quem está perto
   * (`aoEstourar`, a rodada decide quem).
   */
  bolhaGrande(x: number, z: number, raio: number, aoEstourar: () => void): void {
    this.contagem.bolhas += 1;
    const livre = this.bolhas.find((b) => !b.viva) ?? this.bolhas[0];
    livre.viva = true;
    livre.idade = 0;
    livre.raio = raio;
    livre.malha.position.set(x, 0.3, z);
    livre.malha.scale.setScalar(0.01);
    livre.malha.visible = true;
    livre.malha.userData.estourar = () => {
      this.soar('estouro');
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        this.agua.emitir({
          x: livre.malha.position.x, y: livre.malha.position.y, z: livre.malha.position.z,
          vx: Math.cos(a) * 2.6, vy: 1.2 + Math.random(), vz: Math.sin(a) * 2.6,
          vida: 0.6, tamanho: 0.03, cor: i % 2 ? P.jatoSabao : P.jatoMiolo, gravidade: 8,
        });
      }
      this.aneis.deixar({ x: livre.malha.position.x, z: livre.malha.position.z, raio: raio * 1.4, vida: 0.5, cor: P.jatoSabao, abrir: 2, crescer: 0.1 });
      aoEstourar();
    };
  }

  private animarBolhas(dt: number): void {
    for (const b of this.bolhas) {
      if (!b.viva) continue;
      b.idade += dt;
      const t = b.idade / 0.9;
      // incha rápido, sobe, e treme um pouco antes de estourar
      const r = b.raio * Math.min(1, t * 2.2) * (1 + Math.sin(b.idade * 22) * 0.04);
      b.malha.scale.set(r, r * 0.94, r);
      b.malha.position.y = 0.3 + t * 0.5 + r * 0.6;
      b.malha.rotation.y += dt * 1.5;
      if (t >= 1) {
        b.viva = false;
        b.malha.visible = false;
        (b.malha.userData.estourar as (() => void) | undefined)?.();
      }
    }
  }

  // ======================================================== o CHÃO

  /** a Poça: onde o jato cai fica uma mancha molhada e brilhante por 4 s */
  poca(x: number, z: number, raio = 0.7, vida = 4): void {
    this.contagem.pocas += 1;
    this.pocas.deixar({
      x, z, raio, vida, cor: P.jatoPoca, crescer: 0.25,
      achata: 0.75 + Math.random() * 0.25, giro: Math.random() * 3.14,
    });
    // dois brilhinhos na água parada, que é o que diz "molhado"
    for (let i = 0; i < 2; i++) {
      this.faiscas.emitir({
        x: x + (Math.random() - 0.5) * raio, y: 0.04, z: z + (Math.random() - 0.5) * raio,
        vida: vida * 0.7, tamanho: 0.03, cor: P.jatoCristal, gravidade: 0, chao: 'fica',
      });
    }
  }

  /** a Garoa: gotinhas caem do regador e ficam no chão atrás de você */
  garoa(de: THREE.Vector3): void {
    this.contagem.garoas += 1;
    this.soar('pingo');
    for (let i = 0; i < 3; i++) {
      this.agua.emitir({
        x: de.x + (Math.random() - 0.5) * 0.15, y: de.y, z: de.z + (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 0.3, vy: -0.3, vz: (Math.random() - 0.5) * 0.3,
        vida: 1, tamanho: 0.022, cor: P.jatoAgua, gravidade: 9, esticar: 0.03,
      });
    }
    this.pocas.deixar({ x: de.x, z: de.z, raio: 0.2, vida: 3, cor: P.jatoPoca, crescer: 0.4 });
  }

  /**
   * O GÊISER, em dois tempos: primeiro o chão RACHA (meio segundo de aviso, em
   * que dá para ver onde vai ser), depois sobe a coluna d'água.
   */
  rachadura(x: number, z: number): void {
    this.contagem.rachaduras += 1;
    this.soar('ronco');
    for (let i = 0; i < 7; i++) {
      const giro = (i / 7) * Math.PI * 2 + Math.random() * 0.4;
      const comp = 0.5 + Math.random() * 0.45;
      this.rachas.deixar({
        x: x + Math.sin(giro) * comp * 0.5, z: z + Math.cos(giro) * comp * 0.5,
        raio: comp * 0.5, achata: 0.09, giro: -giro, vida: 1.6, cor: P.jatoRachadura, crescer: 0.45,
      });
    }
    this.rachas.deixar({ x, z, raio: 0.3, vida: 1.6, cor: P.jatoRachadura, crescer: 0.3 });
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * 6.28;
      this.terra.emitir({
        x, y: 0.05, z, vx: Math.cos(a) * 0.7, vy: 1.2 + Math.random(), vz: Math.sin(a) * 0.7,
        vida: 0.6, tamanho: 0.04, cor: P.terraUmida, gravidade: 7,
      });
    }
  }

  geiser(x: number, z: number): void {
    this.contagem.geiseres += 1;
    this.soar('geiser');
    // a coluna: gotas grossas subindo rápido num tubo estreito, caindo em volta
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * 6.28;
      const r = Math.random() * 0.22;
      const alto = 7 + Math.random() * 3.5;
      this.agua.emitir({
        x: x + Math.cos(a) * r, y: 0.05, z: z + Math.sin(a) * r,
        vx: Math.cos(a) * (0.4 + Math.random() * 1.4), vy: alto, vz: Math.sin(a) * (0.4 + Math.random() * 1.4),
        vida: 2, tamanho: 0.05 + Math.random() * 0.05, cor: i % 3 ? P.jatoAgua : P.jatoMiolo,
        gravidade: 9, esticar: 0.035,
      });
    }
    this.aneis.deixar({ x, z, raio: 0.9, vida: 0.7, cor: P.jatoRespingo, abrir: 2.2, crescer: 0.05 });
    this.aneis.deixar({ x, z, raio: 0.5, vida: 0.9, cor: P.jatoRespingo, abrir: 3.2, crescer: 0.05 });
    this.poca(x, z, 1.1, 3);
  }

  /**
   * UM ANEL DE ÁGUA em volta de alguém — o Crivo giratório (a cada 4 s) e o
   * Balde (a onda que cai do regador virado). O anel no chão abre junto com
   * as gotas, e é ele que diz até onde a água foi.
   */
  anelDeAgua(centro: THREE.Vector3, raio: number, jeito: 'giro' | 'balde', estilo: EstiloDoJato): void {
    this.contagem.aneis += 1;
    this.soar(jeito === 'giro' ? 'anel' : 'balde');
    const tinta: Tinta = estilo.gelo ? 'gelo' : estilo.sabao ? 'sabao' : 'agua';
    if (jeito === 'giro') {
      const n = 56;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const v = raio / 0.45;
        // cada gota sai com um atraso que acompanha o giro: o anel "gira" ao sair
        this.depois((i / n) * 0.22, () => this.agua.emitir({
          x: centro.x, y: centro.y, z: centro.z,
          vx: Math.cos(a) * v, vy: 1.4, vz: Math.sin(a) * v,
          vida: 0.6, tamanho: 0.04, cor: this.corDaAgua(tinta, i, i % 3 === 0), gravidade: 7, esticar: 0.03,
        }));
      }
      this.depois(0.3, () => this.aneis.deixar({ x: centro.x, z: centro.z, raio, vida: 0.6, cor: P.jatoRespingo, crescer: 0.25 }));
    } else {
      // o balde: a água despenca do regador virado e esparrama em roda
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = Math.random() * raio * 1.7;
        this.agua.emitir({
          x: centro.x + Math.cos(a) * 0.2, y: centro.y + 0.3, z: centro.z + Math.sin(a) * 0.2,
          vx: Math.cos(a) * v, vy: 0.5 + Math.random() * 1.5, vz: Math.sin(a) * v,
          vida: 1.1, tamanho: 0.04 + Math.random() * 0.04, cor: this.corDaAgua(tinta, i, i % 2 === 0),
          gravidade: 9, chao: 'quica',
        });
      }
      this.depois(0.35, () => {
        this.aneis.deixar({ x: centro.x, z: centro.z, raio, vida: 0.8, cor: P.jatoRespingo, crescer: 0.3 });
        this.pocas.deixar({ x: centro.x, z: centro.z, raio: raio * 0.9, vida: 2.5, cor: P.jatoPoca, crescer: 0.35 });
      });
    }
  }

  /**
   * O JATO CARREGANDO: faíscas amarelas convergindo para a ponta do bico. A
   * rodada chama isto a cada quadro enquanto a carga sobe (0 a 1).
   */
  carregando(ponta: THREE.Vector3, carga: number): void {
    this.contagem.carga = Math.max(this.contagem.carga, carga);
    // o zumbido de "pronto" toca uma vez, quando a carga enche
    if (carga >= 1 && !this.cargaAvisada) this.soar('carga');
    this.cargaAvisada = carga >= 1;
    if (Math.random() > 0.35 + carga * 0.6) return;
    const a = Math.random() * 6.28;
    const r = 0.5 - carga * 0.2;
    const px = ponta.x + Math.cos(a) * r;
    const pz = ponta.z + Math.sin(a) * r;
    const py = ponta.y + (Math.random() - 0.5) * 0.4;
    this.faiscas.emitir({
      x: px, y: py, z: pz,
      vx: (ponta.x - px) * 3, vy: (ponta.y - py) * 3, vz: (ponta.z - pz) * 3,
      vida: 0.3, tamanho: 0.02 + carga * 0.02, cor: carga > 0.99 ? P.jatoCristal : P.jatoCarga, gravidade: 0,
    });
  }

  /**
   * O ARCO-ÍRIS NO AR: seis fitas de faísca paradas ao longo do caminho do jato,
   * uma de cada cor, que ficam um instante depois que a água passou.
   */
  arcoNoAr(de: THREE.Vector3, para: THREE.Vector3): void {
    this.contagem.arcosIris += 1;
    const dx = para.x - de.x;
    const dz = para.z - de.z;
    const dist = Math.hypot(dx, dz) || 1;
    // o lado do arco: perpendicular ao jato, no chão
    const lx = -dz / dist;
    const lz = dx / dist;
    // o vermelho por fora (em cima), o violeta por dentro, como no céu
    for (let faixa = 0; faixa < 6; faixa++) {
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const alto = Math.sin(t * Math.PI) * (0.9 + dist * 0.12 - faixa * 0.055);
        this.faiscas.emitir({
          x: de.x + dx * t + lx * faixa * 0.01, y: de.y * (1 - t) + 0.3 * t + alto, z: de.z + dz * t + lz * faixa * 0.01,
          vida: 1.1 + t * 0.3, tamanho: 0.03, cor: ARCO_IRIS[faixa], gravidade: 0,
        });
      }
    }
  }

  /** a sacudida do bicho espantado: a água que ele joga para os lados */
  sacudida(x: number, altura: number, z: number): void {
    this.contagem.sacudidas += 1;
    this.soar('sacudida');
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      this.agua.emitir({
        x, y: altura * 0.55, z,
        vx: Math.cos(a) * 2.2, vy: 1 + Math.random() * 1.2, vz: Math.sin(a) * 2.2,
        vida: 0.55, tamanho: 0.028, cor: i % 2 ? P.jatoAgua : P.jatoMiolo, gravidade: 9, esticar: 0.02,
      });
    }
  }

  /** folhas picadas voando do canteiro que está sendo comido */
  folhinhas(x: number, z: number, cor: number): void {
    const a = Math.random() * 6.28;
    this.terra.emitir({
      x, y: 0.35, z,
      vx: Math.cos(a) * 0.6, vy: 1.2 + Math.random() * 0.6, vz: Math.sin(a) * 0.6,
      vida: 0.7, tamanho: 0.04, cor, gravidade: 5, arrasto: 1.5,
    });
  }

  // ======================================================== o que não é jato
  /*
   * AS CARTAS QUE NÃO MEXEM NO JATO também se veem: o Pique levanta poeira, o
   * Assobio solta notinha, o Grito abre uma onda, o que brota solta faísca
   * verde. Moram aqui porque usam os MESMOS pools de partícula — um segundo
   * conjunto de malhas instanciadas para a mesma estufa seria desperdício.
   */

  /** a poeirinha dos pés de quem corre (o Pique) */
  poeira(x: number, z: number, rumo: number): void {
    this.contagem.poeiras += 1;
    for (let i = 0; i < 2; i++) {
      const a = rumo + Math.PI + (Math.random() - 0.5) * 1.2;
      this.terra.emitir({
        x: x + (Math.random() - 0.5) * 0.2, y: 0.05, z: z + (Math.random() - 0.5) * 0.2,
        vx: Math.sin(a) * 0.5, vy: 0.4 + Math.random() * 0.4, vz: Math.cos(a) * 0.5,
        vida: 0.55, tamanho: 0.05 + Math.random() * 0.03, cor: P.efeitoPoeira, gravidade: 1.2, arrasto: 2,
      });
    }
  }

  /** as notinhas do Assobio: sobem balançando da cabeça de quem assobia */
  notinhas(x: number, y: number, z: number): void {
    this.contagem.notas += 1;
    for (let i = 0; i < 5; i++) {
      this.depois(i * 0.09, () => this.faiscas.emitir({
        x: x + (Math.random() - 0.5) * 0.3, y, z: z + (Math.random() - 0.5) * 0.3,
        vx: (Math.random() - 0.5) * 0.4, vy: 0.9 + Math.random() * 0.4, vz: (Math.random() - 0.5) * 0.4,
        vida: 1.1, tamanho: 0.06, cor: P.efeitoNota, gravidade: -0.2, arrasto: 0.5, balanco: 0.5,
      }));
    }
  }

  /**
   * UMA ONDA DE SOM no chão: o Grito, o apito da Gina, o latido do Walter, o
   * sino da porta. Dois anéis que abrem, um atrás do outro — é o desenho de
   * "fez barulho" que qualquer um lê.
   */
  ondaDeSom(x: number, z: number, raio: number, cor: number = P.efeitoGrito): void {
    this.contagem.ondas += 1;
    this.aneis.deixar({ x, z, raio: raio * 0.6, vida: 0.55, cor, abrir: 1.8, crescer: 0.05 });
    this.depois(0.15, () => this.aneis.deixar({ x, z, raio: raio * 0.8, vida: 0.55, cor, abrir: 1.4, crescer: 0.05 }));
  }

  /** o que brota: faíscas verdes subindo de um canteiro que se recuperou */
  broto(x: number, z: number, meioX = 0.8, meioZ = 0.8): void {
    this.contagem.brotos += 1;
    for (let i = 0; i < 14; i++) {
      this.faiscas.emitir({
        x: x + (Math.random() - 0.5) * 2 * meioX, y: 0.3, z: z + (Math.random() - 0.5) * 2 * meioZ,
        vy: 0.7 + Math.random() * 0.6, vida: 0.9 + Math.random() * 0.4, tamanho: 0.035,
        cor: i % 3 ? P.efeitoBroto : P.jatoCristal, gravidade: -0.3, arrasto: 0.6, balanco: 0.2,
      });
    }
  }

  /** o ardido da pimenta: fagulha vermelha e fumacinha na boca de quem mordeu */
  ardido(x: number, y: number, z: number): void {
    this.contagem.ardidos += 1;
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * 6.28;
      this.faiscas.emitir({
        x, y, z, vx: Math.cos(a) * 1.2, vy: 1 + Math.random() * 1.2, vz: Math.sin(a) * 1.2,
        vida: 0.5, tamanho: 0.03, cor: i % 2 ? P.efeitoArdido : P.pimentaVermelha, gravidade: 3,
      });
    }
    for (let i = 0; i < 4; i++) {
      this.nevoa.emitir({
        x: x + (Math.random() - 0.5) * 0.2, y: y + 0.1, z: z + (Math.random() - 0.5) * 0.2,
        vy: 0.6, vida: 0.9, tamanho: 0.07, cor: P.jatoVapor, gravidade: -0.2, arrasto: 1, cresce: 1.8,
      });
    }
  }

  /** o adubo do Noel caindo num canteiro regado: pitadas marrons que assentam */
  adubo(x: number, z: number): void {
    this.contagem.adubos += 1;
    for (let i = 0; i < 6; i++) {
      this.terra.emitir({
        x: x + (Math.random() - 0.5) * 0.6, y: 0.9, z: z + (Math.random() - 0.5) * 0.6,
        vx: (Math.random() - 0.5) * 0.3, vy: 0.3, vz: (Math.random() - 0.5) * 0.3,
        vida: 0.8, tamanho: 0.035, cor: P.efeitoAdubo, gravidade: 4, arrasto: 1,
      });
    }
  }

  /** o tonel enchendo o regador: espirro de água na boca do tonel */
  espirroDoTonel(x: number, y: number, z: number, forca: number): void {
    for (let i = 0; i < Math.round(2 + forca * 2); i++) {
      const a = Math.random() * 6.28;
      this.agua.emitir({
        x: x + Math.cos(a) * 0.25, y, z: z + Math.sin(a) * 0.25,
        vx: Math.cos(a) * 0.6 * forca, vy: 1.3 + Math.random() * forca, vz: Math.sin(a) * 0.6 * forca,
        vida: 0.5, tamanho: 0.025, cor: P.jatoAgua, gravidade: 9,
      });
    }
  }

  // ======================================================== a mira

  /**
   * O ALVINHO das duas cartas de mira: aparece em cima do bicho que o regador
   * ESCOLHEU, gira e fecha — e só então a água sai. É o que mostra que a
   * escolha mudou (o grandão, ou quem está comendo), e não o mais perto.
   */
  mirar(bicho: THREE.Object3D, altura: number, duracao = 0.45): void {
    this.contagem.miras += 1;
    this.soar('mira');
    this.alvinhoSegue = bicho;
    this.alvinhoAltura = altura;
    this.alvinhoResta = duracao;
    this.alvinho.visible = true;
    this.alvinho.userData.total = duracao;
  }

  private animarAlvinho(dt: number): void {
    if (this.alvinhoResta <= 0) return;
    this.alvinhoResta -= dt;
    const total = (this.alvinho.userData.total as number) || 0.45;
    const t = 1 - this.alvinhoResta / total;
    if (this.alvinhoSegue) {
      this.alvinhoSegue.getWorldPosition(this.alvinho.position);
      this.alvinho.position.y = this.alvinhoAltura + 0.25;
    }
    // entra grande e fecha no bicho, girando
    const s = 1.6 - Math.min(1, t * 1.8) * 0.8;
    this.alvinho.scale.setScalar(s);
    this.alvinho.rotation.y += dt * 5;
    if (this.alvinhoResta <= 0) this.alvinho.visible = false;
  }

  // ======================================================== a nuvem

  /**
   * A NUVEM: a Chuva (a estufa inteira) e a Dança da chuva (em volta de você).
   * Ela incha, chove por `duracao` segundos e se desfaz. `aoPingar` é chamado
   * a cada gota que cai, com onde ela caiu — a rodada molha quem estiver ali.
   */
  chover(
    centro: THREE.Vector3, raio: number, duracao: number, altura: number,
    nuvem: { em: THREE.Vector3; raio: number } = { em: new THREE.Vector3(centro.x, altura, centro.z), raio },
  ): void {
    /*
     * A NUVEM E A CHUVA SÃO DUAS COISAS. Na Dança da chuva elas coincidem (a
     * nuvem pequena chove embaixo dela). Na Chuva a estufa inteira leva água,
     * mas uma nuvem de 24 m de largura taparia a tela: quem cresce é a
     * nuvenzinha do regador, em cima da dupla, e a chuva cai do alto em tudo.
     */
    this.contagem.chuvas += 1;
    // a chuva grande (a estufa inteira) começa com um trovão lá longe
    if (raio > 5) this.soar('trovao');
    this.soar('chuvinha');
    this.proximaChuvinha = 1;
    this.nuvem.position.copy(nuvem.em);
    this.nuvem.visible = true;
    this.nuvemTotal = duracao + 1;
    this.nuvemResta = duracao + 1;
    this.nuvemRaio = nuvem.raio;
    this.nuvemChove = duracao;
    this.chuvaCentro.copy(centro);
    this.chuvaRaio = raio;
    this.chuvaAltura = altura;
  }

  get chovendo(): boolean {
    return this.nuvemResta > 0;
  }

  private animarNuvem(dt: number): void {
    if (this.nuvemResta <= 0) return;
    this.nuvemResta -= dt;
    const decorrido = this.nuvemTotal - this.nuvemResta;
    // incha em meio segundo, e desincha no último meio segundo
    const s = Math.min(1, decorrido / 0.5, Math.max(0, this.nuvemResta) / 0.5);
    this.nuvem.scale.set(this.nuvemRaio * s, Math.max(0.3, this.nuvemRaio * 0.35) * s, this.nuvemRaio * s);
    this.nuvem.rotation.y += dt * 0.2;
    if (decorrido > 0.4 && decorrido < 0.4 + this.nuvemChove) {
      this.proximaChuvinha -= dt;
      if (this.proximaChuvinha <= 0) {
        this.proximaChuvinha = 0.95;
        this.soar('chuvinha');
      }
      // chuva grande tem teto de gotas por quadro: o pool é um só para tudo
      const quantas = Math.min(40, Math.round(this.chuvaRaio * this.chuvaRaio * 26 * dt) + 1);
      for (let i = 0; i < quantas; i++) {
        const a = Math.random() * 6.28;
        const r = Math.sqrt(Math.random()) * this.chuvaRaio * 0.95;
        this.agua.emitir({
          x: this.chuvaCentro.x + Math.cos(a) * r,
          y: this.chuvaAltura - 0.2,
          z: this.chuvaCentro.z + Math.sin(a) * r,
          vy: -6, vida: 1.2, tamanho: 0.025, cor: i % 3 ? P.jatoAgua : P.jatoMiolo, gravidade: 5, esticar: 0.05,
          aoTocarOChao: (x, z) => {
            if (Math.random() < 0.18) this.aneis.deixar({ x, z, raio: 0.12, vida: 0.3, cor: P.jatoRespingo, abrir: 2 });
          },
        });
      }
    }
    if (this.nuvemResta <= 0) this.nuvem.visible = false;
  }
}

/** O alvinho: um anel com quatro traços, laranja de aviso. */
function montarAlvinho(): THREE.Group {
  const g = new THREE.Group();
  const cor = toon(P.jatoMira, { glow: 0.5 });
  const anel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 24), cor);
  anel.rotation.x = Math.PI / 2;
  g.add(anel);
  for (let i = 0; i < 4; i++) {
    const traco = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.11), cor);
    const a = (i / 4) * Math.PI * 2;
    traco.position.set(Math.sin(a) * 0.27, 0, Math.cos(a) * 0.27);
    traco.rotation.y = a;
    g.add(traco);
  }
  // e uma setinha apontando para baixo, para o bicho
  const seta = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 4), cor);
  seta.rotation.x = Math.PI;
  seta.position.y = -0.14;
  g.add(seta);
  return g;
}

/** A nuvem: bolotas de raio 1, que a escala estica para o tamanho da chuva. */
function montarNuvem(): THREE.Group {
  const g = new THREE.Group();
  const clara = toon(P.jatoNuvem);
  const escura = toon(P.jatoNuvemFundo);
  const bolotas: Array<[number, number, number, number, boolean]> = [
    [0, 0, 0, 0.55, false], [0.45, -0.05, 0.1, 0.42, false], [-0.45, -0.05, -0.05, 0.44, false],
    [0.1, 0.1, 0.4, 0.4, false], [-0.1, 0.05, -0.42, 0.4, false], [0.2, 0.25, -0.1, 0.38, false],
    [0, -0.3, 0, 0.6, true], [0.5, -0.3, -0.3, 0.35, true], [-0.4, -0.3, 0.35, 0.35, true],
  ];
  for (const [x, y, z, r, fundo] of bolotas) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 9), fundo ? escura : clara);
    b.position.set(x, y, z);
    b.scale.y = 0.75;
    g.add(b);
  }
  return g;
}
