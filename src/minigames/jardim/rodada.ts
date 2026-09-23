import * as THREE from 'three';
import { PALETTE as P } from '../../palette';
import { toon } from '../../core/materials';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Interactable } from '../../world/Interactable';
import { PRAGAS, type FichaDePraga } from '../../world/bichosDoJardim';
import { GotasDoJardim } from '../../entities/GotasDoJardim';
import { MaoDeCartas } from './baralho';
import { cartaPorId, type FichaDaRodada } from './cartas';
import { nivelDasGotas, planoDaOnda, type EntradaDePraga } from './progressao';
import { cartaNaTela } from './tela';
import { DesenhoDoJato } from './jato';

/**
 * A RODADA DO JARDIM — o minigame da estufa da Josefina, rodando.
 *
 * O plano está em `docs/MINIGAME-JARDIM.md`. Esta é a **etapa 3**: o
 * esqueleto que decide se o resto vale. Uma onda (a primeira, só de
 * Lagartejos), o regador atirando SOZINHO, os bichos entrando pelas brechas e
 * pelos portões atrás de canteiro, a água que acaba e o tonel que enche, as
 * gotas no chão, a tela das três cartas — e o jato de cada carta que mexe no
 * jato, desenhado como a carta descreve (`jato.ts`).
 *
 * ELA NÃO É CUTSCENE: é uma máquina que anda em `atualizar(dt)` com o jogador
 * SOLTO, como o turno do Mania. Os únicos `await` são os da tela de cartas e o
 * da cutscene de um chamado — e a rodada inteira CONGELA enquanto eles duram
 * (bicho, água no ar, gota no chão), senão a escolha da carta custaria um
 * canteiro.
 *
 * ELA NÃO SABE QUE EXISTE UMA ESTUFA. Quem conhece o cenário é a cena, que
 * entrega a `PlantaDoJardim` pronta: onde os bichos nascem, por onde passam,
 * onde estão os canteiros e o tonel.
 *
 * NADA MORRE AQUI (§3 do plano): bicho encharcado SACODE e vai embora pela
 * brecha por onde entrou. "Espantar" é a palavra, e é regra, não texto.
 *
 * ============================================= O QUE CADA CARTA FAZ AQUI
 *
 * As cartas escrevem na `FichaDaRodada`; esta classe só LÊ a ficha. As que já
 * funcionam de ponta a ponta nesta etapa são todas as que mexem no JATO
 * (forma, tinta, impacto e chão, com a animação de cada uma), os números do
 * tanque e do tonel, o passo, a coleta, a vida dos canteiros, e mais três
 * baratas de jardineiro (Fôlego, Chinelada, Descanso na sombra). As regras
 * que dependem de peça que ainda não existe (espantalho, portão emperrado,
 * os chamados agindo, os bichos das outras ondas) ficam para as próximas
 * etapas, e o §6 do plano marca cada uma.
 */

// ------------------------------------------------------------------ ajustes

/** quanto um canteiro aguenta ser comido, antes da Terra adubada */
const VIDA_DO_CANTEIRO = 24;
/** a distância do tonel em que o regador enche */
const PERTO_DO_TONEL = 1.9;
/** jatos por segundo que o tonel põe no regador, antes do Refil rápido */
const ENCHE_NO_TONEL = 5;
/** quantas ondas esta etapa joga (as outras entram com os bichos delas) */
export const ONDAS_DESTA_ETAPA = 1;

/** como cada praga ANDA e COME — o resto da ficha é do desenho */
const JEITO: Record<string, { velocidade: number; mordida: number; raio: number }> = {
  lagartejo: { velocidade: 1.25, mordida: 1, raio: 0.3 },
  gafanhopo: { velocidade: 1.35, mordida: 1, raio: 0.3 },
  coelhatu: { velocidade: 1.6, mordida: 1.6, raio: 0.45 },
  tucanguru: { velocidade: 1.5, mordida: 1.2, raio: 0.45 },
  preguipolvo: { velocidade: 0.45, mordida: 2.4, raio: 0.9 },
  'mae-lagartejo': { velocidade: 0.55, mordida: 4, raio: 0.8 },
};

// ------------------------------------------------------------------ a planta

export interface CanteiroDaPlanta {
  x: number;
  z: number;
  /** meia largura em X e meia profundidade em Z, já com o giro do canteiro */
  meioX: number;
  meioZ: number;
  /** a peça do canteiro: `userData.terra` e `userData.mudas` */
  peca: THREE.Object3D;
  /** a cor das folhas que voam quando ele é comido */
  folha: number;
}

export interface PlantaDoJardim {
  /** um ponto do lado de FORA da sebe, por porta: é de lá que o bicho aparece */
  entradas: readonly { x: number; z: number }[];
  brechas: readonly { x: number; z: number }[];
  portoes: readonly { x: number; z: number }[];
  /** um passo para dentro de cada portão */
  bocas: readonly { x: number; z: number }[];
  canteiros: readonly CanteiroDaPlanta[];
  tonel: { x: number; z: number; altura: number };
  /** o meio do terreiro e o raio que cobre a estufa inteira (a Chuva) */
  centro: { x: number; z: number; raio: number };
}

// ------------------------------------------------------------------ estado

interface Canteiro extends CanteiroDaPlanta {
  vida: number;
  vidaMax: number;
  escalas: number[];
  terraOriginal: THREE.Material | THREE.Material[] | null;
}

type Estado = 'andando' | 'comendo' | 'sacudindo' | 'fugindo' | 'voando' | 'preso' | 'parado';

interface Invasor {
  ficha: FichaDePraga;
  jeito: { velocidade: number; mordida: number; raio: number };
  /** o grupo que a rodada gira e move; `corpo` é a peça do desenho */
  raiz: THREE.Group;
  corpo: THREE.Group;
  partes: Record<string, unknown>;
  barra: THREE.Group;
  enchido: THREE.Mesh;
  x: number;
  z: number;
  rumo: number;
  estado: Estado;
  relogio: number;
  vida: number;
  vidaMax: number;
  porta: number;
  caminho: { x: number; z: number }[];
  passo: number;
  canteiro: Canteiro | null;
  /** um ponto ao longo da borda do canteiro, para os que comem juntos não se empilharem */
  lugarNaBorda: number;
  lento: number;
  gelado: number;
  /** empurrão em curso (tranco, chinelada, susto), em m/s */
  empurraX: number;
  empurraZ: number;
  /** piscada branca de quem acabou de levar água */
  molhado: number;
  fase: number;
  gotasVezes: number;
  voo: { de: { x: number; z: number }; para: { x: number; z: number }; t: number; dur: number } | null;
  chineladaEspera: number;
  /** na vitrine: onde ele nasce de novo */
  casa: { x: number; z: number } | null;
}

/** o que a rodada anima na peça da mão */
type GestoDaMao = { tipo: 'giro' | 'balde' | 'treme'; t: number; dur: number };

export class RodadaDoJardim {
  rodando = false;
  /** a tela de cartas ou uma cutscene está aberta: tudo congela */
  private pausada = false;

  readonly mao = new MaoDeCartas();
  private ficha: FichaDaRodada = this.mao.ficha();
  private readonly jato = new DesenhoDoJato();
  private readonly gotas = new GotasDoJardim();

  private canteiros: Canteiro[] = [];
  private invasores: Invasor[] = [];
  private plano: EntradaDePraga[] = [];
  private onda = 0;
  private tempoDaOnda = 0;
  private espantados = 0;

  private agua = 0;
  private enchendo = false;
  private tanqueCheio = true;
  private recarga = 0;
  private jatosDados = 0;
  private parado = 0;
  private carga = 0;
  private ultimaPosicao = new THREE.Vector3();
  private andouDesdeGaroa = 0;
  private garoas: Array<{ x: number; z: number; vida: number; pisados: Set<Invasor> }> = [];
  private crivo = 0;
  private geiser = 0;
  private chuva = 0;
  private danca = 0;
  private dancando = 0;
  private baldeSegurado = 0;
  private baldeEspera = 0;
  private gesto: GestoDaMao | null = null;
  private relogioDoPainel = 0;
  private relogioDoTonel = 0;

  private nivel = 0;
  private juntadas = 0;
  private suspensas: Interactable[] = [];
  private vitrine = false;
  private semente = 20260923;

  /** a cena ouve isto: carta pega (para a cutscene de um chamado) */
  aoPegarCarta: ((id: string) => Promise<void>) | null = null;
  /** a cena ouve isto: a rodada acabou, com quantos canteiros de pé */
  aoAcabar: ((resultado: { canteiros: number; total: number; espantados: number }) => void) | null = null;


  constructor(
    private readonly w: WorldBuilder,
    private readonly g: GameAPI,
    private readonly planta: PlantaDoJardim,
  ) {
    w.root.add(this.jato.grupo);
    this.jato.aoSoar = (nome) => this.g.som(nome);
    w.root.add(this.gotas.grupo);
    this.canteiros = planta.canteiros.map((c) => {
      const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
      const terra = c.peca.userData.terra as THREE.Mesh | undefined;
      return {
        ...c,
        vida: VIDA_DO_CANTEIRO,
        vidaMax: VIDA_DO_CANTEIRO,
        escalas: mudas.map((m) => m.scale.x),
        terraOriginal: terra ? terra.material : null,
      };
    });
  }

  private sorte(): number {
    let s = this.semente;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    this.semente = s >>> 0;
    return (this.semente % 100000) / 100000;
  }

  private readonly dado = (): number => this.sorte();

  // ================================================================ liga

  /**
   * COMEÇA A RODADA. A mão de cartas nasce vazia e o nível no zero: ninguém
   * entra na rodada já forte (§7). `cartas` só serve ao teste e à vitrine —
   * uma rodada de verdade começa sempre de mão vazia.
   */
  comecar(opcoes: { cartas?: readonly string[]; vitrine?: boolean } = {}): void {
    if (this.rodando) return;
    this.rodando = true;
    this.pausada = false;
    this.vitrine = !!opcoes.vitrine;
    for (const id of opcoes.cartas ?? []) this.mao.pegar(id);
    this.aplicarFicha(true);
    this.agua = this.ficha.tanque;
    this.tanqueCheio = true;
    this.onda = 0;
    this.nivel = 0;
    this.juntadas = 0;
    this.espantados = 0;
    this.jatosDados = 0;
    this.crivo = 0;
    this.geiser = 0;
    this.chuva = 0;
    this.ultimaPosicao.copy(this.g.playerPosition());

    /**
     * TUDO O QUE NÃO É DA RODADA DESLIGA — a porta de volta, o "regar" dos
     * canteiros, a conversa com a Josefina. A lista é calculada aqui, e não
     * recebida pronta, pelo mesmo motivo do turno do Mania: ponto novo que
     * alguém puser na cena amanhã já nasce suspenso durante a rodada.
     */
    this.suspensas = this.w.interactables.filter((p) => p.enabled);
    for (const p of this.suspensas) p.enabled = false;

    this.g.showExperiencia(nivelDasGotas(0));
    if (this.vitrine) {
      this.onda = 1;
      this.plano = [];
    } else {
      this.proximaOnda();
    }
    this.pintarPainel();
  }

  private proximaOnda(): void {
    this.onda += 1;
    this.tempoDaOnda = 0;
    this.plano = planoDaOnda(this.onda, this.dado);
    // sem aviso: o painel já diz a onda, e o aviso caía em cima da barra
  }

  /**
   * ACABA, arruma a estufa e devolve tudo como estava: os canteiros voltam
   * (a Josefina replanta), o regador volta a ser a lata de fábrica, o painel
   * some e os pontos da cena religam.
   */
  terminar(): void {
    if (!this.rodando) return;
    this.rodando = false;
    const vivos = this.canteiros.filter((c) => c.vida > 0).length;
    for (const inv of this.invasores) this.tirar(inv);
    this.invasores = [];
    this.jato.limpar();
    this.gotas.limpar();
    this.garoas = [];
    this.g.mirarJogador(null);
    this.g.setVelocidadeDoJogador(1);
    this.g.showJardim(null);
    this.g.showExperiencia(null);
    this.g.vestirRegador(null);
    this.pararGesto();
    for (const c of this.canteiros) this.replantar(c);
    for (const p of this.suspensas) p.enabled = true;
    this.suspensas = [];
    this.aoAcabar?.({ canteiros: vivos, total: this.canteiros.length, espantados: this.espantados });
  }

  /** para o teste: o que está acontecendo agora */
  estado(): Record<string, unknown> {
    return {
      rodando: this.rodando,
      pausada: this.pausada,
      onda: this.onda,
      agua: this.agua,
      tanque: this.ficha.tanque,
      nivel: this.nivel,
      juntadas: this.juntadas,
      mao: [...this.mao.ids],
      espantados: this.espantados,
      invasores: this.invasores.map((i) => ({
        praga: i.ficha.id, x: i.x, z: i.z, estado: i.estado, vida: i.vida, vidaMax: i.vidaMax,
        lento: i.lento > 0, gelado: i.gelado > 0,
      })),
      canteiros: this.canteiros.map((c) => ({ x: c.x, z: c.z, vida: c.vida, vidaMax: c.vidaMax })),
      faltamEntrar: this.plano.length,
      gotasNoAr: this.jato.gotasNoAr,
      gotasNoChao: this.gotas.quantasNoChao,
      jatosDados: this.jatosDados,
      desenho: this.jato.contagem,
      carga: this.carga,
    };
  }

  // ================================================================ as cartas

  /** Lê a ficha de novo (carta nova) e empurra o que ela muda no mundo. */
  private aplicarFicha(inicio = false): void {
    const antes = this.ficha;
    this.ficha = this.mao.ficha();
    this.g.vestirRegador(this.mao.estiloDoRegador());
    this.g.setVelocidadeDoJogador(this.ficha.velocidade);
    // a Terra adubada vale para o que ainda está de pé, na mesma proporção
    for (const c of this.canteiros) {
      const max = VIDA_DO_CANTEIRO * this.ficha.vidaDoCanteiro;
      c.vida = inicio ? max : c.vida * (max / c.vidaMax);
      c.vidaMax = max;
    }
    // tanque maior: a água que cabe a mais chega cheia
    if (!inicio && this.ficha.tanque > antes.tanque) this.agua += this.ficha.tanque - antes.tanque;
  }

  /**
   * SUBIU DE NÍVEL: a rodada congela, a tela das três cartas abre, e a carta
   * pega entra na mão. Cada nível ganho é uma tela — pular uma seria perder a
   * carta dela.
   */
  private async subir(ate: number): Promise<void> {
    this.pausada = true;
    this.g.mirarJogador(null);
    while (this.nivel < ate && this.rodando) {
      this.nivel += 1;
      const oferta = this.mao.oferta(this.nivel, this.dado);
      const id = await this.g.escolherCartaDoJardim(oferta.map(cartaNaTela), {
        nivel: this.nivel,
        mao: this.mao.cartas.map((c) => ({ id: c.id, nome: c.nome, icone: c.icone, raridade: c.raridade })),
      });
      await this.pegarCarta(id);
    }
    this.pausada = false;
  }

  /** a carta escolhida: entra na mão, a ficha muda, e o que ela faz NA HORA acontece */
  async pegarCarta(id: string): Promise<void> {
    const carta = cartaPorId(id);
    if (!carta) return;
    this.mao.pegar(id, Math.max(this.nivel, 1));
    if (carta.repetivel) {
      this.naHora(carta.naHora);
      this.g.toast(carta.texto, carta.icone);
      return;
    }
    this.aplicarFicha();
    if (carta.chama && this.aoPegarCarta) {
      const estava = this.pausada;
      this.pausada = true;
      await this.aoPegarCarta(id);
      this.pausada = estava;
    }
  }

  /** os CONSOLOS: não entram na mão, fazem uma coisa agora */
  private naHora(efeito: string | undefined): void {
    const eu = this.g.playerPosition();
    if (efeito === 'encher-tanque') {
      this.agua = this.ficha.tanque;
      this.tanqueCheio = true;
      this.jato.anelDeAgua(this.pontaDoBico(), 0.8, 'giro', this.ficha.jato);
      this.g.som('gluglu');
    } else if (efeito === 'curar-canteiro') {
      const pior = [...this.canteiros].sort((a, b) => a.vida / a.vidaMax - b.vida / b.vidaMax)[0];
      if (pior) {
        pior.vida = Math.max(pior.vida, pior.vidaMax * 0.5);
        this.pintarCanteiro(pior);
      }
    } else if (efeito === 'susto') {
      for (const inv of this.invasores) {
        const d = Math.hypot(inv.x - eu.x, inv.z - eu.z);
        if (d < 4 && this.vulneravel(inv)) this.empurrar(inv, inv.x - eu.x, inv.z - eu.z, 3);
      }
    }
  }

  // ================================================================ o quadro

  /**
   * Quanto o relógio da rodada anda por segundo de jogo. É 1 no jogo; o teste
   * sobe para a onda inteira caber no Chromium sem tela (que já roda a ~1/5).
   */
  escalaDoTempo = 1;

  /** onde estão as gotas no chão — o robô do teste anda até elas */
  gotasNoChao(): Array<{ x: number; z: number }> {
    return this.gotas.grupo.children
      .filter((o) => o.visible)
      .map((o) => ({ x: o.position.x, z: o.position.z }));
  }

  atualizar(dtDoJogo: number): void {
    if (!this.rodando) return;
    const dt = dtDoJogo * this.escalaDoTempo;
    const pausado = this.pausada;
    // as gotas no chão precisam do quadro mesmo pausadas (o `pausado` delas
    // congela a vida e o pulo, e não o desenho)
    const pegas = this.gotas.update(pausado ? 0 : dt, this.g.playerPosition(), this.ficha.coleta, pausado);
    if (pausado) return;

    this.jato.update(dt);
    this.chegadas(dt);
    for (const inv of [...this.invasores]) this.viver(inv, dt);
    this.regador(dt);
    this.animarGesto(dt);
    this.garoa(dt);

    if (pegas > 0) {
      this.g.som('pegar');
      this.juntadas += pegas;
      const agora = nivelDasGotas(this.juntadas);
      this.g.showExperiencia(agora);
      if (agora.nivel > this.nivel) void this.subir(agora.nivel);
    }

    this.relogioDoPainel -= dt;
    if (this.relogioDoPainel <= 0) {
      this.relogioDoPainel = 0.1;
      this.pintarPainel();
    }
    this.fimDaOnda();
  }

  private pintarPainel(): void {
    this.g.showJardim({
      onda: this.onda,
      ondas: ONDAS_DESTA_ETAPA,
      agua: this.agua,
      tanque: this.ficha.tanque,
      canteiros: this.canteiros.filter((c) => c.vida > 0).length,
      totalDeCanteiros: this.canteiros.length,
      enchendo: this.enchendo,
    });
  }

  /**
   * A ONDA ACABOU quando ninguém falta entrar e não sobrou bicho na estufa —
   * ou quando o último canteiro caiu. Esta etapa joga só a primeira; as
   * outras entram quando os bichos delas existirem (etapa 7 do plano).
   */
  private fimDaOnda(): void {
    if (this.vitrine) return;
    const semCanteiro = this.canteiros.every((c) => c.vida <= 0);
    if (!semCanteiro && (this.plano.length > 0 || this.invasores.length > 0)) return;
    if (!semCanteiro && this.onda < ONDAS_DESTA_ETAPA) {
      this.proximaOnda();
      return;
    }
    this.terminar();
  }

  // ================================================================ os bichos

  private chegadas(dt: number): void {
    this.tempoDaOnda += dt;
    while (this.plano.length > 0 && this.plano[0].t <= this.tempoDaOnda) {
      const e = this.plano.shift()!;
      this.nascer(e.praga, e.porta);
    }
    if (this.vitrine) {
      for (const inv of this.invasores) {
        if (inv.estado === 'parado' && inv.casa) {
          inv.x += (inv.casa.x - inv.x) * Math.min(1, dt * 2);
          inv.z += (inv.casa.z - inv.z) * Math.min(1, dt * 2);
        }
      }
    }
  }

  /** Um bicho aparece do lado de fora da sebe, na porta sorteada. */
  private nascer(praga: string, porta: number, casa: { x: number; z: number } | null = null): Invasor {
    const ficha = PRAGAS.find((p) => p.id === praga) ?? PRAGAS[0];
    const jeito = JEITO[ficha.id] ?? JEITO.lagartejo;
    const raiz = new THREE.Group();
    const corpo = ficha.monta(1, this.sorte());
    raiz.add(corpo);
    const { barra, enchido } = montarBarra();
    const de = casa ?? this.planta.entradas[porta];
    const inv: Invasor = {
      ficha, jeito, raiz, corpo,
      partes: (corpo.userData.partes ?? {}) as Record<string, unknown>,
      barra, enchido,
      x: de.x + (casa ? 0 : (this.sorte() - 0.5) * 1.2),
      z: de.z,
      rumo: 0,
      estado: casa ? 'parado' : 'andando',
      relogio: 0,
      vida: ficha.encharque,
      vidaMax: ficha.encharque,
      porta,
      caminho: casa ? [] : [
        this.planta.brechas[porta], this.planta.portoes[porta], this.planta.bocas[porta],
      ].map((p) => ({ x: p.x + (this.sorte() - 0.5) * 0.9, z: p.z })),
      passo: 0,
      canteiro: null,
      lugarNaBorda: this.sorte() * 2 - 1,
      lento: 0,
      gelado: 0,
      empurraX: 0,
      empurraZ: 0,
      molhado: 0,
      fase: this.sorte() * 6,
      gotasVezes: 1,
      voo: null,
      chineladaEspera: 0,
      casa,
    };
    raiz.position.set(inv.x, 0, inv.z);
    this.w.root.add(raiz);
    this.w.root.add(barra);
    this.invasores.push(inv);
    return inv;
  }

  /** tira o bicho do mundo e devolve a geometria (o material é do cache) */
  private tirar(inv: Invasor): void {
    this.w.root.remove(inv.raiz);
    this.w.root.remove(inv.barra);
    inv.raiz.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
  }

  /** o canteiro vivo mais perto de um ponto */
  private canteiroMaisPerto(x: number, z: number): Canteiro | null {
    let melhor: Canteiro | null = null;
    let d = Infinity;
    for (const c of this.canteiros) {
      if (c.vida <= 0) continue;
      const dd = Math.hypot(c.x - x, c.z - z);
      if (dd < d) { d = dd; melhor = c; }
    }
    return melhor;
  }

  /** onde, na borda do canteiro, este bicho vai parar para comer */
  private pontoDeComer(inv: Invasor, c: Canteiro): { x: number; z: number } {
    // o ponto da borda mais perto do bicho, deslizado pelo lugar dele na fila
    const alongX = c.meioX >= c.meioZ;
    const bx = alongX ? THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX) + inv.lugarNaBorda * c.meioX * 0.8 : inv.x;
    const bz = alongX ? inv.z : THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ) + inv.lugarNaBorda * c.meioZ * 0.8;
    const cx = THREE.MathUtils.clamp(bx, c.x - c.meioX, c.x + c.meioX);
    const cz = THREE.MathUtils.clamp(bz, c.z - c.meioZ, c.z + c.meioZ);
    let nx = inv.x - cx;
    let nz = inv.z - cz;
    const n = Math.hypot(nx, nz);
    if (n < 0.001) { nx = 0; nz = -1; } else { nx /= n; nz /= n; }
    const folga = inv.jeito.raio + 0.12;
    return { x: cx + nx * folga, z: cz + nz * folga };
  }

  /**
   * EMPURRA UM PONTO PARA FORA DOS CANTEIROS. Gota que pousa em cima de um
   * canteiro é gota que a dupla não alcança a pé (o canteiro tem colisor), e
   * foi exatamente o que o Renan achou jogando: uma gota presa na horta.
   */
  private foraDeCanteiro(x: number, z: number): { x: number; z: number } {
    const FOLGA = 0.55;
    for (const c of this.canteiros) {
      const dx = x - c.x;
      const dz = z - c.z;
      const sobraX = c.meioX + FOLGA - Math.abs(dx);
      const sobraZ = c.meioZ + FOLGA - Math.abs(dz);
      if (sobraX <= 0 || sobraZ <= 0) continue;
      // sai pelo lado mais curto
      if (sobraX < sobraZ) x = c.x + Math.sign(dx || 1) * (c.meioX + FOLGA);
      else z = c.z + Math.sign(dz || -1) * (c.meioZ + FOLGA);
    }
    return { x, z };
  }

  private vulneravel(inv: Invasor): boolean {
    return inv.estado === 'andando' || inv.estado === 'comendo' || inv.estado === 'parado' || inv.estado === 'preso';
  }

  private viver(inv: Invasor, dt: number): void {
    inv.relogio += dt;
    inv.fase += dt;
    inv.lento = Math.max(0, inv.lento - dt);
    inv.chineladaEspera = Math.max(0, inv.chineladaEspera - dt);
    if (inv.gelado > 0) {
      inv.gelado -= dt;
      if (inv.gelado <= 0) this.jato.derreter(inv.corpo);
    }
    inv.molhado = Math.max(0, inv.molhado - dt * 3);

    // o empurrão em curso (tranco, chinelada, susto): desliza e freia
    if (inv.empurraX || inv.empurraZ) {
      inv.x += inv.empurraX * dt;
      inv.z += inv.empurraZ * dt;
      const freio = Math.max(0, 1 - dt * 6);
      inv.empurraX *= freio;
      inv.empurraZ *= freio;
      if (Math.hypot(inv.empurraX, inv.empurraZ) < 0.05) { inv.empurraX = 0; inv.empurraZ = 0; }
    }

    // a Poça e a Gota gelada seguram o passo
    let ritmo = 1;
    if (inv.lento > 0) ritmo *= 0.7;
    if (this.ficha.jato.poca && this.jato.pocasPerto(inv.x, inv.z) > 0) ritmo *= 0.6;
    const velocidade = inv.jeito.velocidade * ritmo;

    switch (inv.estado) {
      case 'andando': this.andar(inv, velocidade, dt); break;
      case 'comendo': this.comer(inv, dt); break;
      case 'sacudindo':
        if (inv.relogio > 0.55) {
          inv.estado = 'fugindo';
          inv.relogio = 0;
        }
        break;
      case 'fugindo': this.fugir(inv, dt); break;
      case 'voando': this.voar(inv, dt); break;
      case 'preso':
        if (inv.relogio > 0.6) inv.estado = 'voando';
        break;
      case 'parado': {
        // na vitrine ele fica de frente para quem rega
        const eu = this.g.playerPosition();
        this.virarPara(inv, Math.atan2(eu.x - inv.x, eu.z - inv.z), dt * 0.4);
        break;
      }
    }

    // a Chinelada: encostar no bicho joga ele para trás
    if (this.ficha.regras.has('empurrao') && this.vulneravel(inv) && inv.chineladaEspera <= 0) {
      const eu = this.g.playerPosition();
      const d = Math.hypot(inv.x - eu.x, inv.z - eu.z);
      if (d < inv.jeito.raio + 0.5) {
        this.empurrar(inv, inv.x - eu.x, inv.z - eu.z, 2);
        this.jato.tranco(inv.x, inv.z, Math.atan2(inv.x - eu.x, inv.z - eu.z), 2);
        inv.chineladaEspera = 1;
      }
    }

    this.pintarInvasor(inv, dt);
  }

  private andar(inv: Invasor, velocidade: number, dt: number): void {
    // o caminho de fora: brecha → portão → boca; depois, o canteiro
    let alvo: { x: number; z: number } | null = inv.caminho[inv.passo] ?? null;
    if (!alvo) {
      if (!inv.canteiro || inv.canteiro.vida <= 0) inv.canteiro = this.canteiroMaisPerto(inv.x, inv.z);
      if (!inv.canteiro) return;
      alvo = this.pontoDeComer(inv, inv.canteiro);
    }
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    const passo = velocidade * dt;
    if (d <= Math.max(0.08, passo)) {
      inv.x = alvo.x;
      inv.z = alvo.z;
      if (inv.passo < inv.caminho.length) inv.passo += 1;
      else if (inv.canteiro) {
        inv.estado = 'comendo';
        inv.relogio = 0;
      }
      return;
    }
    inv.x += (dx / d) * passo;
    inv.z += (dz / d) * passo;
    this.virarPara(inv, Math.atan2(dx, dz), dt);
  }

  private comer(inv: Invasor, dt: number): void {
    const c = inv.canteiro;
    if (!c || c.vida <= 0) {
      inv.estado = 'andando';
      inv.canteiro = null;
      return;
    }
    // de frente para a borda que ele está comendo
    this.virarPara(inv, Math.atan2(
      THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX) - inv.x,
      THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ) - inv.z,
    ), dt);
    c.vida = Math.max(0, c.vida - inv.jeito.mordida * dt);
    if (Math.random() < dt * 5) {
      this.jato.folhinhas(
        THREE.MathUtils.clamp(inv.x, c.x - c.meioX, c.x + c.meioX),
        THREE.MathUtils.clamp(inv.z, c.z - c.meioZ, c.z + c.meioZ),
        c.folha,
      );
    }
    this.pintarCanteiro(c);
    if (c.vida <= 0) {
      this.g.toast('Um canteiro foi comido', '🥀');
      inv.estado = 'andando';
      inv.canteiro = null;
    }
  }

  private fugir(inv: Invasor, dt: number): void {
    // volta pelo caminho de fora, de trás para a frente, com pressa
    const volta = [this.planta.bocas[inv.porta], this.planta.portoes[inv.porta],
      this.planta.brechas[inv.porta], this.planta.entradas[inv.porta]];
    if (inv.casa) {
      // na vitrine ele só dá uns passos para trás e nasce de novo
      if (inv.relogio > 1.2) this.renascerNaVitrine(inv);
      inv.x -= Math.sin(inv.rumo) * 2 * dt;
      inv.z -= Math.cos(inv.rumo) * 2 * dt;
      return;
    }
    // o próximo ponto da volta é o primeiro que ainda está "na frente" dele (em z)
    const alvo = volta.find((p) => p.z < inv.z - 0.3) ?? volta[volta.length - 1];
    const dx = alvo.x - inv.x;
    const dz = alvo.z - inv.z;
    const d = Math.hypot(dx, dz);
    const v = inv.jeito.velocidade * 2 + 0.6;
    if (d < 0.3 && alvo === volta[volta.length - 1]) {
      this.tirar(inv);
      this.invasores.splice(this.invasores.indexOf(inv), 1);
      return;
    }
    inv.x += (dx / Math.max(d, 0.001)) * v * dt;
    inv.z += (dz / Math.max(d, 0.001)) * v * dt;
    this.virarPara(inv, Math.atan2(dx, dz), dt * 2);
    // pinga no caminho: ainda está encharcado
    // (mudo: é só o bicho pingando, e tocaria o tempo todo)
    if (Math.random() < dt * 6) this.jato.respingo(inv.x, 0.15, inv.z, {}, 0.25, 'agua', false);
  }

  /** o Gêiser: o bicho voa em parábola até a porta dele */
  private voar(inv: Invasor, dt: number): void {
    if (!inv.voo) {
      const destino = this.planta.brechas[inv.porta];
      inv.voo = { de: { x: inv.x, z: inv.z }, para: { x: destino.x, z: destino.z + 1.5 }, t: 0, dur: 1.5 };
      this.jato.geiser(inv.x, inv.z);
    }
    const v = inv.voo;
    v.t += dt;
    const t = Math.min(1, v.t / v.dur);
    inv.x = v.de.x + (v.para.x - v.de.x) * t;
    inv.z = v.de.z + (v.para.z - v.de.z) * t;
    inv.raiz.position.y = Math.sin(t * Math.PI) * 6;
    inv.corpo.rotation.x += dt * 9;
    if (t >= 1) {
      inv.raiz.position.y = 0;
      inv.corpo.rotation.x = 0;
      this.jato.respingo(inv.x, 0.1, inv.z, {}, 1.5);
      if (inv.casa) {
        this.renascerNaVitrine(inv);
        return;
      }
      this.tirar(inv);
      this.invasores.splice(this.invasores.indexOf(inv), 1);
    }
  }

  private renascerNaVitrine(inv: Invasor): void {
    const casa = inv.casa!;
    this.tirar(inv);
    this.invasores.splice(this.invasores.indexOf(inv), 1);
    this.jato.depois(0.8, () => {
      if (this.rodando) this.nascer(inv.ficha.id, inv.porta, casa);
    });
  }

  private virarPara(inv: Invasor, rumo: number, dt: number): void {
    let d = rumo - inv.rumo;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    inv.rumo += d * Math.min(1, dt * 8);
  }

  private empurrar(inv: Invasor, dx: number, dz: number, metros: number): void {
    const n = Math.hypot(dx, dz) || 1;
    // v inicial que, freando a 6/s, anda `metros`
    const v = metros * 6;
    inv.empurraX += (dx / n) * v;
    inv.empurraZ += (dz / n) * v;
    if (inv.estado === 'comendo') {
      inv.estado = 'andando';
    }
  }

  /**
   * O DESENHO DO BICHO, a cada quadro: posição, giro, o passinho, a mordida,
   * a piscada de molhado e a sacudida. E a barra de vida, que vive no mundo
   * (e não dentro do bicho) para não girar com ele.
   */
  private pintarInvasor(inv: Invasor, dt: number): void {
    inv.raiz.position.x = inv.x;
    inv.raiz.position.z = inv.z;
    inv.raiz.rotation.y = inv.rumo;
    const c = inv.corpo;
    const andando = inv.estado === 'andando' || inv.estado === 'fugindo';
    const ritmo = inv.estado === 'fugindo' ? 16 : 10 * (inv.lento > 0 ? 0.6 : 1);
    // o passinho: sobe e desce, e as patinhas se revezam
    c.position.y = andando ? Math.abs(Math.sin(inv.fase * ritmo)) * 0.035 : 0;
    const pernas = (inv.partes.pernas ?? []) as THREE.Object3D[];
    pernas.forEach((p, i) => {
      if (p.userData.y0 === undefined) p.userData.y0 = p.position.y;
      p.position.y = (p.userData.y0 as number) + (andando ? Math.max(0, Math.sin(inv.fase * ritmo + i * 1.7)) * 0.03 : 0);
    });
    // as pinças abrem e fecham: devagar andando, rápido comendo
    const pincas = (inv.partes.pincas ?? []) as THREE.Object3D[];
    pincas.forEach((p, i) => {
      if (p.userData.ry0 === undefined) p.userData.ry0 = p.rotation.y;
      const s = i === 0 ? -1 : 1;
      const abre = inv.estado === 'comendo' ? Math.sin(inv.fase * 14) * 0.35 : Math.sin(inv.fase * 3) * 0.12;
      p.rotation.y = (p.userData.ry0 as number) + s * abre;
    });
    const cabeca = inv.partes.cabeca as THREE.Object3D | undefined;
    if (cabeca) {
      if (cabeca.userData.x0 === undefined) cabeca.userData.x0 = cabeca.rotation.x;
      cabeca.rotation.x = (cabeca.userData.x0 as number) + (inv.estado === 'comendo' ? 0.25 + Math.sin(inv.fase * 12) * 0.12 : 0);
    }
    // a sacudida do espantado: balança de um lado para o outro
    c.rotation.z = inv.estado === 'sacudindo' ? Math.sin(inv.relogio * 40) * 0.35 * (1 - inv.relogio / 0.55) : 0;
    // o tranco: o corpo inclina para trás enquanto o empurrão dura
    const empurrado = Math.min(1, Math.hypot(inv.empurraX, inv.empurraZ) / 6);
    c.rotation.x = -empurrado * 0.45;
    // a piscada de quem levou água: incha um tiquinho
    const s = 1 + inv.molhado * 0.12;
    c.scale.set(s, 1 - inv.molhado * 0.08, s);

    // a barra: em cima da cabeça, de frente para a câmera
    const b = inv.barra;
    b.position.set(inv.x, inv.ficha.alturaDaBarra + inv.raiz.position.y, inv.z);
    b.rotation.y = this.g.anguloDaCamera();
    const fracao = Math.max(0, inv.vida / inv.vidaMax);
    const alvo = Math.max(0.0001, fracao);
    const atual = inv.enchido.scale.x;
    inv.enchido.scale.x = atual + (alvo - atual) * Math.min(1, dt * 10);
    b.visible = inv.estado !== 'fugindo' && inv.estado !== 'voando' && inv.estado !== 'sacudindo';
    // acabou de levar água: a barra pisca branco
    inv.enchido.material = inv.molhado > 0.4 ? toon(P.barraMolhada, { glow: 0.6 }) : toon(P.barraAgua, { glow: 0.35 });
  }

  // ================================================================ canteiros

  /** as mudas encolhem com a vida do canteiro; comido até o fim, some tudo */
  private pintarCanteiro(c: Canteiro): void {
    const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
    const fracao = c.vida / c.vidaMax;
    mudas.forEach((m, i) => {
      const base = c.escalas[i] ?? 1;
      // cada muda some num ponto diferente: o canteiro esvazia aos poucos
      const limite = (i + 1) / (mudas.length + 1);
      m.visible = fracao > limite * 0.9;
      m.scale.setScalar(base * (0.45 + 0.55 * fracao));
    });
    const terra = c.peca.userData.terra as THREE.Mesh | undefined;
    if (terra && c.vida <= 0) terra.material = toon(P.terraComida);
    else if (terra && c.terraOriginal) terra.material = c.terraOriginal;
  }

  private replantar(c: Canteiro): void {
    c.vida = VIDA_DO_CANTEIRO;
    c.vidaMax = VIDA_DO_CANTEIRO;
    const mudas = (c.peca.userData.mudas ?? []) as THREE.Object3D[];
    mudas.forEach((m, i) => {
      m.visible = true;
      m.scale.setScalar(c.escalas[i] ?? 1);
    });
    const terra = c.peca.userData.terra as THREE.Mesh | undefined;
    if (terra && c.terraOriginal) terra.material = c.terraOriginal;
  }

  // ================================================================ o regador

  /** a ponta do bico do regador na mão, no mundo — é de lá que a água sai */
  private pontaDoBico(): THREE.Vector3 {
    const obj = this.g.objetoNaMao();
    let achou: THREE.Vector3 | null = null;
    obj?.traverse((o) => {
      if (achou) return;
      const partes = o.userData.partes as { bico?: THREE.Object3D; pontaDoBico?: number } | undefined;
      if (partes?.bico && partes.pontaDoBico !== undefined) {
        achou = partes.bico.localToWorld(new THREE.Vector3(0, 0, partes.pontaDoBico));
      }
    });
    if (achou) return achou;
    const eu = this.g.playerPosition();
    const f = this.g.playerFacing();
    return new THREE.Vector3(eu.x + Math.sin(f) * 0.45, 1.3, eu.z + Math.cos(f) * 0.45);
  }

  private comRegador(): boolean {
    return this.g.getActiveHandItem()?.id === 'regador';
  }

  /** o bicho está atrás de um canteiro, do ponto de vista de quem rega? */
  private atrasDeCanteiro(de: { x: number; z: number }, inv: Invasor): boolean {
    for (const c of this.canteiros) {
      if (segmentoCruzaRetangulo(de.x, de.z, inv.x, inv.z, c.x, c.z, c.meioX - 0.1, c.meioZ - 0.1)) return true;
    }
    return false;
  }

  /**
   * O REGADOR, a cada quadro: enche (sozinho, no tonel, parado, andando com
   * Fôlego), carrega o jatão, gira o crivo, faz chover, e — quando a cadência
   * deixa e há água — escolhe o alvo e atira. O jogador não aperta nada: é o
   * gênero (§1 do plano).
   */
  private regador(dt: number): void {
    const f = this.ficha;
    const e = f.jato;
    const eu = this.g.playerPosition();
    const andou = Math.hypot(eu.x - this.ultimaPosicao.x, eu.z - this.ultimaPosicao.z);
    this.ultimaPosicao.copy(eu);
    const estaParado = andou < 0.004;
    this.parado = estaParado ? this.parado + dt : 0;
    this.andouDesdeGaroa += andou;

    // ---- a água: sozinha, parado (Descanso), andando (Fôlego) e no tonel
    const perto = Math.hypot(eu.x - this.planta.tonel.x, eu.z - this.planta.tonel.z) < PERTO_DO_TONEL;
    let enche = f.recarga * (estaParado ? f.recargaParado : 1);
    if (!estaParado && f.regras.has('enche-andando')) enche += 0.6;
    this.enchendo = perto && this.agua < f.tanque;
    if (this.enchendo) {
      enche += ENCHE_NO_TONEL * f.refil;
      this.relogioDoTonel -= dt;
      if (this.relogioDoTonel <= 0) {
        this.relogioDoTonel = 0.55 / f.refil;
        this.g.som('gluglu');
      }
      // o Refil rápido é um espirro maior na boca do tonel
      this.jato.espirroDoTonel(this.planta.tonel.x, this.planta.tonel.altura, this.planta.tonel.z, f.refil);
    }
    const antes = this.agua;
    this.agua = Math.min(f.tanque, this.agua + enche * dt);
    if (antes < f.tanque && this.agua >= f.tanque) this.tanqueCheio = true;

    if (!this.comRegador()) {
      this.g.mirarJogador(null);
      return;
    }
    const ponta = this.pontaDoBico();

    // ---- o Jato carregado: parado junta força, o regador treme e brilha
    if (e.carregado) {
      this.carga = estaParado ? Math.min(1, this.carga + dt / 1.5) : Math.max(0, this.carga - dt * 2);
      if (this.carga > 0.05) {
        this.jato.carregando(ponta, this.carga);
        if (!this.gesto || this.gesto.tipo === 'treme') this.gesto = { tipo: 'treme', t: 0, dur: 0.1 };
      }
    }

    // ---- o Crivo giratório: a cada 4 s, um anel em volta
    if (e.crivoGiratorio) {
      this.crivo += dt;
      if (this.crivo >= 4 && this.algumPerto(eu, f.alcance * 0.9)) {
        this.crivo = 0;
        this.gesto = { tipo: 'giro', t: 0, dur: 0.45 };
        this.jato.anelDeAgua(ponta, f.alcance * 0.9, 'giro', e);
        this.jato.depois(0.35, () => {
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - eu.x, inv.z - eu.z) <= f.alcance * 0.9) this.molhar(inv, f.dano, eu);
          }
        });
      }
    }

    // ---- o Balde: segurar E derrama o tanque inteiro em volta
    if (e.balde) {
      this.baldeEspera = Math.max(0, this.baldeEspera - dt);
      if (this.g.keyDown('KeyE')) this.baldeSegurado += dt;
      else this.baldeSegurado = 0;
      if (this.baldeSegurado > 0.35 && this.baldeEspera <= 0 && this.agua >= 1) {
        this.baldeSegurado = 0;
        this.baldeEspera = 1.5;
        const derramado = this.agua;
        this.agua = 0;
        this.gesto = { tipo: 'balde', t: 0, dur: 0.7 };
        const onde = new THREE.Vector3(eu.x, 1.2, eu.z);
        this.jato.depois(0.2, () => this.jato.anelDeAgua(onde, 2, 'balde', e));
        this.jato.depois(0.5, () => {
          for (const inv of [...this.invasores]) {
            // "num círculo de 2 m": conta o corpo do bicho, e não só o centro dele
            if (this.vulneravel(inv) && Math.hypot(inv.x - eu.x, inv.z - eu.z) <= 2 + inv.jeito.raio) {
              this.molhar(inv, f.dano * (1 + derramado * 0.35), eu);
            }
          }
        });
      }
    }

    // ---- o Gêiser: a cada 20 s, o bicho mais forte vai pela porta
    if (e.geiser) {
      this.geiser += dt;
      if (this.geiser >= 20) {
        const forte = this.invasores.filter((i) => this.vulneravel(i) && i.z > this.planta.portoes[0].z)
          .sort((a, b) => b.vida - a.vida)[0];
        if (forte) {
          this.geiser = 0;
          forte.estado = 'preso';
          forte.relogio = 0;
          this.jato.rachadura(forte.x, forte.z);
          this.espantado(forte, 'geiser');
        }
      }
    }

    // ---- a Chuva: a cada 30 s, a estufa inteira leva um jato
    if (e.chuva) {
      this.chuva += dt;
      if (this.chuva >= 30) {
        this.chuva = 0;
        const c = this.planta.centro;
        // a nuvenzinha do regador cresce em cima da dupla, e a chuva cai na estufa toda
        this.jato.chover(new THREE.Vector3(c.x, 0, c.z), c.raio, 1.6, 7, {
          em: new THREE.Vector3(eu.x, 3.1, eu.z), raio: 1.3,
        });
        this.jato.depois(1.2, () => {
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - c.x, inv.z - c.z) <= c.raio) this.molhar(inv, f.dano, null);
          }
        });
      }
    }

    // ---- a Dança da chuva: parado 3 s, chove 5 s em volta
    if (e.dancaDaChuva) {
      if (this.dancando > 0) {
        this.dancando -= dt;
        this.danca += dt;
        if (this.danca >= 0.5) {
          this.danca = 0;
          const onde = this.dancaEm;
          for (const inv of [...this.invasores]) {
            if (this.vulneravel(inv) && Math.hypot(inv.x - onde.x, inv.z - onde.z) <= 2.5) this.molhar(inv, f.dano * 0.5, null);
          }
        }
      } else if (this.parado >= 3 && !this.jato.chovendo) {
        this.parado = 0;
        this.dancando = 5;
        this.danca = 0;
        this.dancaEm = { x: eu.x, z: eu.z };
        this.jato.chover(new THREE.Vector3(eu.x, 0, eu.z), 2.5, 5, 3.6, {
          // alta e pequena o bastante para não tapar a cabeça da dupla
          em: new THREE.Vector3(eu.x, 3.9, eu.z), raio: 1.3,
        });
      }
    }

    // ---- o jato de verdade: cadência, água e alvo
    this.recarga += dt;
    const gasto = f.gastoPorJato;
    const alvo = this.escolherAlvo(eu);
    this.g.mirarJogador(alvo ? { x: alvo.x, z: alvo.z } : null);
    if (!alvo || this.recarga < f.cadencia || this.agua < gasto) return;
    this.recarga = 0;
    this.agua -= gasto;
    this.atirar(eu, alvo);
  }

  private dancaEm = { x: 0, z: 0 };

  private algumPerto(eu: THREE.Vector3, raio: number): boolean {
    return this.invasores.some((i) => this.vulneravel(i) && Math.hypot(i.x - eu.x, i.z - eu.z) <= raio);
  }

  /**
   * QUEM LEVA O JATO: o mais perto, por padrão. As duas cartas de mira mudam
   * isso (o de mais vida, ou quem já está comendo), e o bicho atrás de um
   * canteiro só é alcançável pelo Jato em arco.
   */
  private escolherAlvo(eu: THREE.Vector3): Invasor | null {
    const f = this.ficha;
    const candidatos = this.invasores.filter((i) => this.vulneravel(i)
      && Math.hypot(i.x - eu.x, i.z - eu.z) <= f.alcance
      && (f.jato.arco || !this.atrasDeCanteiro(eu, i)));
    if (candidatos.length === 0) return null;
    const dist = (i: Invasor): number => Math.hypot(i.x - eu.x, i.z - eu.z);
    if (f.jato.mira === 'grandao') return candidatos.sort((a, b) => b.vida - a.vida || dist(a) - dist(b))[0];
    if (f.jato.mira === 'come') {
      const comendo = candidatos.filter((i) => i.estado === 'comendo');
      if (comendo.length) return comendo.sort((a, b) => dist(a) - dist(b))[0];
    }
    return candidatos.sort((a, b) => dist(a) - dist(b))[0];
  }

  /**
   * UM ATAQUE. Decide quem leva água (o cone, a sombra de um bicho no outro, o
   * atravessar), qual jato especial sai agora (tanque cheio, carregado, o
   * décimo do arco-íris), e manda o desenho — o dano cai quando a água chega.
   */
  private atirar(eu: THREE.Vector3, alvo: Invasor): void {
    const f = this.ficha;
    const e = f.jato;
    this.jatosDados += 1;
    const rumo = Math.atan2(alvo.x - eu.x, alvo.z - eu.z);

    // qual jato especial é este
    let especial: 'pressao-cheia' | 'carregado' | 'arco-iris' | undefined;
    if (e.carregado && this.carga >= 1) especial = 'carregado';
    else if (e.pressaoAcumulada && this.tanqueCheio) especial = 'pressao-cheia';
    else if (e.arcoIris && this.jatosDados % 10 === 0) especial = 'arco-iris';
    this.tanqueCheio = false;
    if (especial === 'carregado') this.carga = 0;

    const multiplicador = especial === 'carregado' || especial === 'pressao-cheia' ? 3 : 1;
    const atravessa = f.regras.has('atravessa') || especial === 'arco-iris';

    // a mira mostra quem foi escolhido antes de a água sair
    const atraso = e.mira ? 0.3 : 0;
    if (e.mira) this.jato.mirar(alvo.raiz, alvo.ficha.alturaDaBarra, 0.55);

    const saida = (): void => {
      const de = this.pontaDoBico();
      if (e.borrifador && !especial) {
        this.borrifar(eu, de, rumo);
      } else if (especial === 'carregado') {
        this.jatao(eu, de, rumo);
      } else {
        const atingidos = this.noCone(eu, rumo, f.alcance, THREE.MathUtils.degToRad(f.largura) / 2, alvo, atravessa);
        const longe = atingidos.length ? atingidos[atingidos.length - 1] : alvo;
        // a água vai até o último atingido; a Pressão e o Arco-íris passam dele
        const para = atravessa
          ? pontoAFrente(eu, rumo, Math.max(Math.hypot(longe.x - eu.x, longe.z - eu.z) + 1.2, f.alcance * 0.9))
          : new THREE.Vector3(alvo.x, 0.25, alvo.z);
        const tempo = this.jato.disparar({ de, para, estilo: e, largura: f.largura, especial });
        for (const inv of atingidos) {
          const t = tempo * (Math.hypot(inv.x - eu.x, inv.z - eu.z) / Math.max(0.5, Math.hypot(para.x - eu.x, para.z - eu.z)));
          this.jato.depois(atravessa ? t : tempo, () => this.acertar(inv, f.dano * multiplicador, eu, especial));
        }
        if (especial === 'arco-iris') this.jato.depois(tempo * 0.6, () => this.jato.arcoNoAr(de, para));
        if (especial === 'pressao-cheia') this.jato.depois(tempo, () => this.jato.anelDeAgua(new THREE.Vector3(alvo.x, 0.3, alvo.z), 0.9, 'giro', e));
        if (e.poca) this.jato.depois(tempo, () => this.jato.poca(para.x, para.z));
      }
      // o Segundo bico: um cone para trás, ao mesmo tempo
      if (e.segundoBico) this.paraTras(eu, de, rumo);
    };
    if (atraso) this.jato.depois(atraso, saida);
    else saida();
  }

  /** os bichos no cone, do mais perto ao mais longe, com a sombra de um no outro */
  private noCone(
    eu: THREE.Vector3, rumo: number, alcance: number, meiaAbertura: number,
    alvo: Invasor | null, atravessa: boolean,
  ): Invasor[] {
    const f = this.ficha;
    const lista = this.invasores
      .filter((i) => this.vulneravel(i))
      .map((i) => ({ i, d: Math.hypot(i.x - eu.x, i.z - eu.z), a: difAngulo(Math.atan2(i.x - eu.x, i.z - eu.z), rumo) }))
      .filter(({ i, d, a }) => d <= alcance + i.jeito.raio && Math.abs(a) <= meiaAbertura
        && (f.jato.arco || !this.atrasDeCanteiro(eu, i)))
      .sort((a, b) => a.d - b.d);
    const acertados: Array<{ i: Invasor; a: number }> = [];
    for (const c of lista) {
      // quem está na sombra de um bicho já molhado (mesma linha, mais longe)
      // não leva — a menos que o jato atravesse
      const sombra = acertados.some((x) => Math.abs(x.a - c.a) < 0.2);
      if (sombra && !atravessa) continue;
      acertados.push({ i: c.i, a: c.a });
    }
    if (alvo && !acertados.some((x) => x.i === alvo) && this.vulneravel(alvo)) acertados.unshift({ i: alvo, a: 0 });
    return acertados.map((x) => x.i);
  }

  /** o Borrifador: três fiozinhos em leque, cada um com 40% do dano */
  private borrifar(eu: THREE.Vector3, de: THREE.Vector3, rumo: number): void {
    const f = this.ficha;
    const meia = THREE.MathUtils.degToRad(f.largura) / 2;
    for (const desvio of [-meia, 0, meia]) {
      const r = rumo + desvio;
      const primeiro = this.noCone(eu, r, f.alcance, 0.22, null, false)[0];
      const para = primeiro ? new THREE.Vector3(primeiro.x, 0.25, primeiro.z) : pontoAFrente(eu, r, f.alcance);
      this.jato.disparar({
        de, para, estilo: f.jato, largura: 6, forma: 'fio',
        aoChegar: () => {
          if (primeiro) this.acertar(primeiro, f.dano * 0.4, eu);
          else this.jato.respingo(para.x, 0.05, para.z, f.jato, 0.4);
          if (f.jato.poca) this.jato.poca(para.x, para.z, 0.45);
        },
      });
    }
  }

  /** o Jato carregado: um jatão reto que atravessa a fila inteira */
  private jatao(eu: THREE.Vector3, de: THREE.Vector3, rumo: number): void {
    const f = this.ficha;
    const longe = f.alcance * 1.6;
    const para = pontoAFrente(eu, rumo, longe);
    const tempo = this.jato.disparar({ de, para, estilo: f.jato, largura: 4, especial: 'carregado' });
    for (const inv of this.invasores) {
      if (!this.vulneravel(inv)) continue;
      const d = Math.hypot(inv.x - eu.x, inv.z - eu.z);
      const a = difAngulo(Math.atan2(inv.x - eu.x, inv.z - eu.z), rumo);
      // perto da linha do jato (em metros, e não em graus: é um tubo, não um cone)
      if (d <= longe && Math.abs(Math.sin(a) * d) < 0.45 + inv.jeito.raio && Math.cos(a) > 0) {
        this.jato.depois(tempo * (d / longe), () => this.acertar(inv, f.dano * 3, eu, 'carregado'));
      }
    }
  }

  /** o Segundo bico: um cone para trás */
  private paraTras(eu: THREE.Vector3, de: THREE.Vector3, rumo: number): void {
    const f = this.ficha;
    const atras = rumo + Math.PI;
    const alvos = this.noCone(eu, atras, f.alcance, THREE.MathUtils.degToRad(f.largura) / 2, null, f.regras.has('atravessa'));
    const primeiro = alvos[0];
    const para = primeiro ? new THREE.Vector3(primeiro.x, 0.25, primeiro.z) : pontoAFrente(eu, atras, f.alcance * 0.85);
    // o bico de trás fica do outro lado da lata: a água sai de lá
    const deTras = new THREE.Vector3(eu.x - Math.sin(rumo) * 0.25, de.y - 0.05, eu.z - Math.cos(rumo) * 0.25);
    this.jato.disparar({
      de: deTras, para, estilo: f.jato, largura: f.largura, forma: 'cone',
      aoChegar: () => {
        for (const inv of alvos) this.acertar(inv, f.dano, eu);
        if (!primeiro) this.jato.respingo(para.x, 0.05, para.z, f.jato, 0.5);
        if (f.jato.poca) this.jato.poca(para.x, para.z);
      },
    });
  }

  /** A ÁGUA CHEGOU num bicho: dano, respingo e o que cada carta de impacto faz. */
  private acertar(inv: Invasor, dano: number, de: { x: number; z: number } | null, especial?: string): void {
    if (!this.vulneravel(inv) || !this.invasores.includes(inv)) return;
    const f = this.ficha;
    const e = f.jato;
    const altura = inv.ficha.alturaDaBarra * 0.5;
    const tinta = especial === 'arco-iris' ? 'arco-iris' : especial === 'carregado' ? 'carga' : 'agua';
    this.jato.respingo(inv.x, altura, inv.z, e, especial ? 1.8 : 1, tinta);
    if (especial === 'arco-iris') inv.gotasVezes = 2;
    this.molhar(inv, dano, de);
  }

  /** o dano em si, e o que vem junto (gelo, tranco, vapor) — serve a todo tipo de água */
  private molhar(inv: Invasor, dano: number, de: { x: number; z: number } | null): void {
    if (!this.vulneravel(inv)) return;
    const f = this.ficha;
    const e = f.jato;
    const grande = inv.ficha.tier === 'tanque' || inv.ficha.tier === 'chefe';
    let d = dano;
    if (grande) {
      d *= f.contraOGrandao;
      if (e.morna) this.jato.vaporDoBicho(inv.x, inv.ficha.alturaDaBarra, inv.z);
    }
    inv.vida -= d;
    inv.molhado = 1;
    if (e.gelo) {
      inv.lento = 2;
      inv.gelado = 2;
      this.jato.congelar(inv.corpo, inv.ficha.alturaDaBarra * 0.8);
    }
    // a Gota pesada: o tranco para trás, na direção do jato
    if (de && f.empurraoDoJato > 0) {
      this.empurrar(inv, inv.x - de.x, inv.z - de.z, f.empurraoDoJato);
      this.jato.tranco(inv.x, inv.z, Math.atan2(inv.x - de.x, inv.z - de.z), e.tranco ?? 1);
    }
    if (inv.vida <= 0) this.espantado(inv, 'agua');
  }

  /**
   * ESPANTADO: sacode, joga a água para os lados, solta as gotas e vai embora.
   * Com sabão, deixa uma bolha que estoura e molha quem está perto; com a
   * Compostagem, devolve um tiquinho de vida ao canteiro mais perto.
   */
  private espantado(inv: Invasor, como: 'agua' | 'geiser'): void {
    this.espantados += 1;
    inv.vida = 0;
    inv.estado = como === 'geiser' ? 'preso' : 'sacudindo';
    inv.relogio = 0;
    inv.canteiro = null;
    inv.empurraX = 0;
    inv.empurraZ = 0;
    if (como === 'agua') this.jato.sacudida(inv.x, inv.ficha.alturaDaBarra, inv.z);
    const quantas = inv.ficha.gotas * inv.gotasVezes;
    const onde = { x: inv.x, z: inv.z };
    this.jato.depois(0.3, () => this.gotas.soltar(onde.x, onde.z, quantas, this.dado, (x, z) => this.foraDeCanteiro(x, z)));

    const f = this.ficha;
    if (f.jato.sabao && como === 'agua') {
      this.jato.bolhaGrande(onde.x, onde.z, 0.45, () => {
        for (const outro of [...this.invasores]) {
          if (outro !== inv && this.vulneravel(outro) && Math.hypot(outro.x - onde.x, outro.z - onde.z) < 1.6) {
            this.acertar(outro, f.dano * 0.6, onde);
          }
        }
      });
    }
    if (f.compostagem > 0) {
      const c = this.canteiroMaisPerto(onde.x, onde.z);
      if (c) {
        c.vida = Math.min(c.vidaMax, c.vida + c.vidaMax * f.compostagem);
        this.pintarCanteiro(c);
      }
    }
  }

  // ================================================================ o chão

  /** a Garoa: andando, fica um rastro que molha quem pisa */
  private garoa(dt: number): void {
    const e = this.ficha.jato;
    for (let i = this.garoas.length - 1; i >= 0; i--) {
      const gz = this.garoas[i];
      gz.vida -= dt;
      if (gz.vida <= 0) { this.garoas.splice(i, 1); continue; }
      for (const inv of this.invasores) {
        if (gz.pisados.has(inv) || !this.vulneravel(inv)) continue;
        if (Math.hypot(inv.x - gz.x, inv.z - gz.z) < inv.jeito.raio + 0.2) {
          gz.pisados.add(inv);
          this.jato.respingo(inv.x, 0.1, inv.z, e, 0.4);
          this.molhar(inv, this.ficha.dano * 0.5, null);
        }
      }
    }
    if (!e.garoa || !this.comRegador()) return;
    if (this.andouDesdeGaroa >= 0.45) {
      this.andouDesdeGaroa = 0;
      const ponta = this.pontaDoBico();
      this.jato.garoa(ponta.setY(Math.max(0.6, ponta.y)));
      this.garoas.push({ x: ponta.x, z: ponta.z, vida: 3, pisados: new Set() });
    }
  }

  // ================================================================ a mão

  /**
   * O GESTO DA PEÇA NA MÃO: o crivo GIRA, o balde VIRA de ponta-cabeça, o
   * carregado TREME. A peça é a mesma que o jogador segura (`objetoNaMao`), e
   * ela volta ao lugar no fim de cada gesto.
   */
  private animarGesto(dt: number): void {
    const obj = this.g.objetoNaMao();
    if (!obj || !this.gesto) return;
    const gs = this.gesto;
    gs.t += dt;
    const t = Math.min(1, gs.t / gs.dur);
    if (gs.tipo === 'giro') {
      obj.rotation.set(0, t * Math.PI * 2, 0);
    } else if (gs.tipo === 'balde') {
      // vira rápido, segura de ponta-cabeça, e volta
      const vira = t < 0.3 ? t / 0.3 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      obj.rotation.set(-vira * Math.PI * 0.85, 0, 0);
    } else {
      const forca = 0.02 + this.carga * 0.07;
      obj.rotation.set((Math.random() - 0.5) * forca, 0, (Math.random() - 0.5) * forca);
    }
    if (t >= 1) this.pararGesto();
  }

  private pararGesto(): void {
    this.gesto = null;
    this.g.objetoNaMao()?.rotation.set(0, 0, 0);
  }

  // ================================================================ vitrine

  /**
   * A VITRINE DO JATO: uma rodada sem ondas, com bichos parados na frente do
   * jogador que nascem de novo quando são espantados. Serve para OLHAR o jato
   * de uma carta (`?cena=estufa&jato=gota-gelada,poca`) e para o teste
   * fotografar cada uma — numa onda de verdade a carta que se quer ver pode
   * não sair nunca.
   */
  montarVitrine(pontos: readonly { x: number; z: number }[], praga = 'lagartejo'): void {
    pontos.forEach((p, i) => this.nascer(praga, i % 3, { x: p.x, z: p.z }));
  }

  /** o teste manda regar AGORA, sem esperar a cadência */
  forcarJato(): void {
    this.recarga = this.ficha.cadencia;
    this.agua = Math.max(this.agua, this.ficha.gastoPorJato);
  }

  /** o teste liga um contador de efeito sem esperar o relógio (gêiser, chuva, crivo) */
  adiantar(qual: 'geiser' | 'chuva' | 'crivo' | 'danca' | 'arco-iris' | 'carga'): void {
    if (qual === 'arco-iris') this.jatosDados = 9;
    if (qual === 'carga') this.carga = 1;
    if (qual === 'geiser') this.geiser = 20;
    if (qual === 'chuva') this.chuva = 30;
    if (qual === 'crivo') this.crivo = 4;
    if (qual === 'danca') this.parado = 3;
  }

  dispose(): void {
    this.jato.dispose();
  }
}

// ------------------------------------------------------------------ ajudantes

/** a barra de vida: um fundo escuro e a água que enche, da esquerda para a direita */
function montarBarra(): { barra: THREE.Group; enchido: THREE.Mesh } {
  const barra = new THREE.Group();
  const LARGURA = 0.62;
  const fundo = new THREE.Mesh(new THREE.BoxGeometry(LARGURA + 0.06, 0.1, 0.03), toon(P.barraFundo));
  barra.add(fundo);
  const geo = new THREE.BoxGeometry(1, 0.06, 0.035);
  geo.translate(0.5, 0, 0);
  const enchido = new THREE.Mesh(geo, toon(P.barraAgua, { glow: 0.35 }));
  // a água vai de 0 a 1 no trilho, e o trilho tem a largura da barra: a
  // escala `x` do enchido é a fração que falta, e ela cresce da esquerda
  const trilho = new THREE.Group();
  trilho.scale.x = LARGURA;
  trilho.position.x = -LARGURA / 2;
  enchido.position.set(0, 0, 0.005);
  trilho.add(enchido);
  barra.add(trilho);
  return { barra, enchido };
}

function difAngulo(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function pontoAFrente(eu: { x: number; z: number }, rumo: number, dist: number): THREE.Vector3 {
  return new THREE.Vector3(eu.x + Math.sin(rumo) * dist, 0.05, eu.z + Math.cos(rumo) * dist);
}

/** o segmento (x1,z1)-(x2,z2) passa por dentro do retângulo centrado em (cx,cz)? */
function segmentoCruzaRetangulo(
  x1: number, z1: number, x2: number, z2: number, cx: number, cz: number, mx: number, mz: number,
): boolean {
  // Liang-Barsky
  let t0 = 0;
  let t1 = 1;
  const dx = x2 - x1;
  const dz = z2 - z1;
  const testes: Array<[number, number]> = [
    [-dx, x1 - (cx - mx)], [dx, (cx + mx) - x1], [-dz, z1 - (cz - mz)], [dz, (cz + mz) - z1],
  ];
  for (const [p, q] of testes) {
    if (p === 0) {
      if (q < 0) return false;
      continue;
    }
    const r = q / p;
    if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; }
    else { if (r < t0) return false; if (r < t1) t1 = r; }
  }
  return t0 < t1;
}
