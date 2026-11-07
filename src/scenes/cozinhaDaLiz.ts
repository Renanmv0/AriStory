import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { SomNome } from '../audio/efeitos';
import type { WorldBuilder } from '../world/WorldBuilder';
import type { TiaLiz } from '../entities/bichos/TiaLiz';
import { PALETTE as P } from '../palette';
import { toon } from '../core/materials';
import { fundir } from '../world/fundir';
import { animarVapor, vaporDePrato } from '../world/moveisDoMania';
import {
  LUGARES_DO_BALCAO, PASSE, SOPA_NO_BALCAO, pratoDaTiaLiz, type PratoDaLiz,
} from '../world/cantinaDaTiaLiz';
import {
  BANCADA, FOGAO_DA_LIZ, FRIGIDEIRA, LUGARES_DA_BANCADA, PANELINHA, Farelos, FioDeLiquido, RefratarioDaTresLeches,
  TabuaDeCorte, chamaDoFogao, colherDePau, colherDeServir, espatula, faca, forminha, frigideira, jarrinhaDeLeite,
  morangoInteiro, naFrigideira, panelinhaDoFororo, pegador, polvilhadorDeCanela,
} from '../world/cozinhaDaTiaLiz';

/**
 * ================================================ A COZINHA DA TIA LIZ, VIVA
 *
 * O pedido do Renan: "enquanto ela está na cozinha ela fica alternando entre
 * andar pela cozinha, cozinhar no fogão e cortar legumes numa tabuazinha; e
 * cada prato que a gente pedir tem uma animação específica, bem detalhada; e
 * quando ela for atender a gente, ela acena."
 *
 * Este arquivo é o CORPO DE BAILE dela. A cena (`escolaCantina.ts`) monta a
 * cozinha e a conversa; aqui mora o que ela faz com as patas:
 *
 *  - O ROTEIRO (`Roteiro`): os passos andam no relógio do JOGO (e não no da
 *    parede, como o `g.wait`), e a rotina inteira pode ser CANCELADA no meio
 *    — quem chega para pedir comida interrompe a faca no ar, e ela larga
 *    tudo no lugar e vem para a janela.
 *  - AS CASAS: cada utensílio tem um lugar (no fogão, no balcão, na
 *    bancada). Pegar é a pata ir até a pega dele e ele passar para a mão
 *    (`attach`, que guarda a posição do mundo) e assentar; largar é o
 *    caminho de volta. Ela nunca solta nada no ar.
 *  - AS MÃOS vão a pontos do MUNDO pela IK dela (`TiaLiz.maoPara`). Com
 *    ferramenta, o alvo é a PONTA dela (a lâmina na cenoura, a concha na
 *    comida): a conta (`pegaDe`) devolve onde a pata tem que estar.
 *
 * O ALCANCE MANDA NA PLANTA: a pata dela chega ~36 cm do ombro, e tudo o
 * que ela mexe mora na faixa de trás de cada móvel. A fila, da esquerda
 * (perto da parede) para a direita: o FOGÃO de quatro bocas (a frigideira
 * na boca de perto da esquerda, a panelinha do fororo na da direita), o
 * PASSE (a ponta livre do balcão, onde o prato espera enquanto ela usa as
 * duas patas no fogão, com a pilha de louça atrás), as cubas na ordem do
 * serviço (pasta, arroz, feijão, carne), o caldeirão da sopita (o meio da
 * janela, onde ela atende), as tajadas, e a BANCADA com o refratário da
 * tres leches, a jarrinha, os morangos e a tábua.
 *
 * E A JANELA MANDA NA FILA: a câmera olha em diagonal, e quem está a 1,2 m
 * atrás da parede aparece 1,2 m mais à direita no vão. Por isso a fila
 * começa encostada na parede da esquerda e a tábua (o posto mais à direita)
 * fica no limite do que a janela mostra.
 */

// ================================================================== o relógio

/** a rotina foi interrompida (alguém veio pedir comida): quem espera, para */
export class Cancelado extends Error {
  constructor() {
    super('roteiro cancelado');
  }
}

interface Tarefa {
  dur: number;
  t: number;
  tick?: (k: number, dt: number) => void;
  ok: () => void;
  erro: (e: Error) => void;
}

/**
 * O ROTEIRO: os passos de uma coreografia no relógio do jogo. `durante(s,
 * tick)` chama `tick(k)` com `k` de 0 a 1 por `s` segundos; `ate(promessa)`
 * espera uma promessa de fora (ela chegar andando). `cancelar()` faz TODAS
 * as esperas falharem com `Cancelado`, e qualquer espera nova também — a
 * coreografia para no passo em que estava.
 */
export class Roteiro {
  private tarefas: Tarefa[] = [];
  private readonly pendentes = new Set<(e: Error) => void>();
  private morto = false;
  /** acelera os passos (o segundo prato sai mais ligeiro que o primeiro) */
  pressa = 1;

  get cancelado(): boolean {
    return this.morto;
  }

  update(dt: number): void {
    if (this.morto || !this.tarefas.length) return;
    const agora = this.tarefas;
    this.tarefas = [];
    for (const tf of agora) {
      tf.t += dt;
      const k = tf.dur > 0 ? Math.min(1, tf.t / tf.dur) : 1;
      tf.tick?.(k, dt);
      if (k >= 1) tf.ok();
      else this.tarefas.push(tf);
    }
  }

  durante(seg: number, tick?: (k: number, dt: number) => void): Promise<void> {
    if (this.morto) return Promise.reject(new Cancelado());
    return new Promise<void>((ok, erro) => {
      this.tarefas.push({ dur: seg / this.pressa, t: 0, tick, ok, erro });
    });
  }

  esperar(seg: number): Promise<void> {
    return this.durante(seg);
  }

  ate<T>(p: Promise<T>): Promise<T> {
    if (this.morto) return Promise.reject(new Cancelado());
    return new Promise<T>((ok, erro) => {
      this.pendentes.add(erro);
      p.then(
        (v) => { if (this.pendentes.delete(erro)) ok(v); },
        (e: Error) => { if (this.pendentes.delete(erro)) erro(e); },
      );
    });
  }

  cancelar(): void {
    if (this.morto) return;
    this.morto = true;
    for (const tf of this.tarefas) tf.erro(new Cancelado());
    this.tarefas = [];
    for (const e of this.pendentes) e(new Cancelado());
    this.pendentes.clear();
  }
}

// ================================================================ as contas

const v3 = (x = 0, y = 0, z = 0): THREE.Vector3 => new THREE.Vector3(x, y, z);
/** a curva macia de ida (começa e chega devagar) */
const suave = (k: number): number => k * k * (3 - 2 * k);
/** sobe e desce: 0 → 1 → 0 */
const sino = (k: number): number => Math.sin(Math.PI * k);

/** onde a pata pendura o prato (no quadro da mão): a palma embaixo da beira */
const PRATO_NA_PATA = v3(0.02, 0.004, 0.09);
/**
 * A PATA ESQUERDA CARREGANDO O PRATO, no referencial dela: DO LADO (andando
 * e esperando) e NA FRENTE (recebendo a comida). O cabeção dela, visto de
 * cima pela câmera, tapa tudo o que fica bem na frente do peito — por isso
 * o prato anda do lado, e para servir ele vai para a frente, ALÉM do
 * focinho (a 45 cm), onde a câmera vê a comida caindo.
 */
const PATA_DO_LADO = v3(-0.27, 1.05, 0.2);
const PATA_NA_FRENTE = v3(-0.15, 1.035, 0.4);

/** as ferramentas e onde fica a PONTA delas (no quadro da mão, de pé) */
const PONTA = {
  faca: v3(0, -0.012, 0.1),
  espatula: v3(0, -0.032, 0.14),
  colherDeServir: v3(0, -0.03, 0.11),
  pegador: v3(0, -0.168, 0.006),
  colherDePau: v3(0, -0.2, 0.004),
  forminha: v3(0, 0, 0.07),
  polvilhador: v3(0, 0.055, 0),
  jarrinha: v3(0, 0.04, 0.11),
} as const;

/** a pose de cada ferramenta na mão (em relação ao corpo dela) */
const DE_PE = new THREE.Euler(0, 0, 0);
const INCLINADA = (x: number): THREE.Euler => new THREE.Euler(x, 0, 0);

interface Casa {
  pai: THREE.Object3D;
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  escala: number;
}

type Lado = 0 | 1;
interface Ponto { x: number; z: number }

/** o que a cena dá para a cozinha: onde ficam as coisas e o motor do som */
export interface PlantaDaCozinha {
  /** o meio da janela (o `c.x` da cantina) e o meio do balcão no `z` */
  cx: number;
  bz: number;
  fogao: THREE.Object3D;
  /** onde fica, no mundo, quem pede (para o som só tocar com a dupla perto) */
  perto: () => boolean;
}

/** onde a fila da cozinha fica no `x`, a partir do meio da janela */
export const LINHA = {
  termico: -1.1,
  fogao: -1.1 - (1.8 + PASSE) - FOGAO_DA_LIZ.largura / 2 - 0.03,
  bancada: 1.6,
} as const;

type PratoDaLinha = 'pasta' | 'arroz' | 'feijao' | 'carne' | 'tajadas';

const ZERO = v3();


/** a louça nova chega VAZIA: as partes da comida aparecem enquanto ela monta */
function esvaziar(prato: THREE.Object3D): void {
  const comida = prato.getObjectByName('comida');
  comida?.children.forEach((c) => { c.visible = false; });
  const t = prato.getObjectByName('talher');
  if (t) t.visible = false;
  // o fororo: o creme fica escondido até o despejo
  const creme = prato.getObjectByName('creme');
  if (creme) creme.visible = false;
}

// ============================================================== a cozinha

export class CozinhaDaLiz {
  /** o teste acelera o relógio da cozinha inteira (a Liz e os passos) */
  vezes = 1;
  readonly tabua = new TabuaDeCorte();
  readonly refratario = new RefratarioDaTresLeches();
  readonly frigideira = fundir(frigideira());
  readonly panelinha = fundir(panelinhaDoFororo());
  readonly farelos = new Farelos();
  readonly fio = new FioDeLiquido();
  /** o que a rotina está fazendo agora (o teste lê) */
  estacao = 'parada';
  /** quantas vezes cada posto já rodou (o teste mede que ela alterna) */
  readonly visitas: Record<string, number> = {};
  /** o prato que ela está montando agora (o teste lê as partes dele) */
  pratoNaMontagem: THREE.Object3D | null = null;
  /** o passo da preparação em que ela está (o teste fotografa por ele) */
  passo = '';

  private readonly w: WorldBuilder;
  private readonly g: GameAPI;
  private readonly liz: TiaLiz;
  private readonly planta: PlantaDaCozinha;
  private readonly ferramentas: Record<'faca' | 'espatula' | 'espatulaDoBolo' | 'colherDeServir' | 'colherDeServirDaFrigideira' | 'pegador' | 'pegadorDaPasta' | 'colherDePau' | 'forminha' | 'polvilhador' | 'polvilhadorDoBolo' | 'jarrinha', THREE.Group>;
  private readonly casas = new Map<THREE.Object3D, Casa>();
  private readonly alvo: Array<THREE.Vector3 | null> = [null, null];
  /** onde a pata do prato está, no referencial dela */
  private readonly pataDoPrato = v3();
  private readonly giro = [new THREE.Quaternion(), new THREE.Quaternion()];
  private readonly chamas = [false, false, false, false];
  private readonly vapores: Array<{ v: THREE.Object3D; calor: number; alvo: number }> = [];
  private roteiro: Roteiro | null = null;
  private relogio = 0;
  private forcarSom = false;

  // a planta, no mundo
  private readonly FX: number;
  private readonly FZ: number;
  private readonly TX: number;
  private readonly BX: number;
  private readonly BZ: number;
  private readonly ZP: number;

  constructor(w: WorldBuilder, liz: TiaLiz, planta: PlantaDaCozinha) {
    this.w = w;
    this.g = w.game;
    this.liz = liz;
    this.planta = planta;
    const { cx, bz } = planta;
    this.TX = cx + LINHA.termico;
    this.FX = cx + LINHA.fogao;
    this.FZ = bz + 0.02;
    this.BX = cx + LINHA.bancada;
    this.BZ = bz;
    /** a linha em que ela fica de pé, atrás dos móveis (a barriga não entra neles) */
    this.ZP = bz - 0.425 - 0.235;

    const root = w.root;
    const F = FOGAO_DA_LIZ;
    // a FRIGIDEIRA na boca de perto da esquerda, o cabo para ela e para a esquerda
    {
      const c = this.boca(1);
      const giro = 0.55;
      const pega = v3(c.x - 0.3 * Math.sin(giro), F.trempe - FRIGIDEIRA.centro.y, c.z - 0.3 * Math.cos(giro));
      this.morar(this.frigideira, root, pega, giro);
      naFrigideira(this.frigideira, 'refogado');
    }
    // a PANELINHA na de perto da direita, o cabo para ela e para a direita
    {
      const c = this.boca(0);
      const giro = -0.55;
      const pega = v3(c.x - 0.25 * Math.sin(giro), F.trempe - PANELINHA.centro.y, c.z - 0.25 * Math.cos(giro));
      this.morar(this.panelinha, root, pega, giro);
    }
    // o vapor das duas panelas (só sobe com o fogo aceso)
    for (const [panela, centro] of [[this.frigideira, FRIGIDEIRA.centro], [this.panelinha, PANELINHA.centro]] as const) {
      const v = vaporDePrato();
      v.position.copy(centro).y += 0.02;
      v.scale.setScalar(0.8);
      panela.add(v);
      this.vapores.push({ v, calor: 0, alvo: 0 });
    }

    const LB = LUGARES_DO_BALCAO;
    const LD = LUGARES_DA_BANCADA;
    const T = 0.93;
    const ferr = {
      faca: fundir(faca()),
      espatula: fundir(espatula()),
      espatulaDoBolo: fundir(espatula()),
      colherDeServir: fundir(colherDeServir()),
      colherDeServirDaFrigideira: fundir(colherDeServir()),
      pegador: fundir(pegador()),
      pegadorDaPasta: fundir(pegador()),
      colherDePau: fundir(colherDePau()),
      forminha: forminha(),
      polvilhador: fundir(polvilhadorDeCanela()),
      polvilhadorDoBolo: fundir(polvilhadorDeCanela()),
      jarrinha: fundir(jarrinhaDeLeite()),
    };
    this.ferramentas = ferr;
    /*
     * AS CASAS DOS UTENSÍLIOS. Deitado é girado: a ferramenta nasce DE PÉ
     * (como fica na mão), então a casa diz o giro de deitar. Cada uma mora
     * perto de onde é usada: a espátula e a colher no meio do fogão, entre
     * as duas bocas de perto; o pegador da pasta e o polvilhador na faixa de
     * trás do balcão, perto do passe; a forminha, a colher e o pegador da
     * linha do pabellón junto das cubas; e a faca na tábua.
     */
    const deitado = (obj: THREE.Object3D, pai: THREE.Object3D, p: THREE.Vector3, rotY: number, rotX = -Math.PI / 2): void => {
      this.morar(obj, pai, p, rotY, rotX);
    };
    // no fogão: a espátula e a colher de servir deitadas entre as bocas de perto
    deitado(ferr.espatula, root, v3(this.FX - 0.02, F.topo + 0.012, this.FZ - 0.3), Math.PI / 2, 0);
    deitado(ferr.colherDeServirDaFrigideira, root, v3(this.FX + 0.06, F.topo + 0.016, this.FZ - 0.15), Math.PI / 2 + 0.2, 0.1);
    // a colher de pau mora DENTRO da panelinha, encostada na beira
    this.morar(ferr.colherDePau, this.panelinha, v3(0.05, 0.2, PANELINHA.centro.z - 0.02), 0, -0.25, 0.3);
    // no balcão (faixa de trás): o pegador da pasta e o polvilhador do fororo
    deitado(ferr.pegadorDaPasta, root, v3(this.TX - 1.32, T + 0.012, this.BZ + LB.tras), -Math.PI / 2);
    this.morar(ferr.polvilhador, root, v3(this.TX - 1.17, T + 0.035, this.BZ + LB.tras), 0);
    // a linha do pabellón: a forminha perto do arroz, a colher perto do
    // feijão e o pegador perto da carne (entre as cubas, na faixa de trás)
    this.morar(ferr.forminha, root, v3(this.TX + LB.cubas.arroz + 0.06, T + 0.001, this.BZ + LB.tras - 0.07), Math.PI);
    deitado(ferr.colherDeServir, root, v3(this.TX + LB.cubas.feijao + 0.04, T + 0.012, this.BZ + LB.tras), -Math.PI / 2);
    deitado(ferr.pegador, root, v3(this.TX + LB.cubas.carne + 0.04, T + 0.012, this.BZ + LB.tras), -Math.PI / 2);
    // a bancada: a tábua (com a faca), o refratário, a espátula do bolo, a
    // jarrinha e o polvilhador
    // a tábua e o refratário juntam os pedaços de mesmo material (o legume,
    // o pedaço da torta e os riscos têm nome: continuam soltos)
    fundir(this.tabua.group);
    fundir(this.refratario.group);
    this.tabua.group.position.set(this.BX + LD.tabua.x, BANCADA.topo, this.BZ + LD.tabua.z);
    root.add(this.tabua.group);
    deitado(ferr.faca, this.tabua.group, v3(0.06, 0.035, 0.1), 0.25, 0);
    ferr.faca.rotation.set(0, 0.25 + Math.PI / 2, Math.PI / 2);
    this.casas.get(ferr.faca)!.quat.copy(ferr.faca.quaternion);
    this.refratario.group.position.set(this.BX + LD.refratario.x, BANCADA.topo, this.BZ + LD.refratario.z);
    root.add(this.refratario.group);
    deitado(ferr.espatulaDoBolo, root, v3(this.BX + LD.espatula.x, BANCADA.topo + 0.012, this.BZ + LD.espatula.z), Math.PI / 2, 0);
    this.morar(ferr.jarrinha, root, v3(this.BX + LD.jarrinha.x, BANCADA.topo + 0.05, this.BZ + LD.jarrinha.z), Math.PI);
    this.morar(ferr.polvilhadorDoBolo, root, v3(this.BX + LD.polvilhador.x, BANCADA.topo + 0.035, this.BZ + LD.polvilhador.z), 0);

    root.add(this.farelos.mesh, this.fio.mesh);
  }

  // ------------------------------------------------------------- a planta

  /** onde fica a boca `i` do fogão no mundo (ele está girado meia volta) */
  private boca(i: number): THREE.Vector3 {
    const [bx, bz] = FOGAO_DA_LIZ.bocas[i];
    return v3(this.FX - bx, FOGAO_DA_LIZ.trempe, this.FZ - bz);
  }

  /** o botão da boca `i` (as de fora da faixa acendem as de perto) */
  private botao(i: number): THREE.Vector3 {
    const k = [0, 3, 1, 2][i];
    return v3(this.FX + 0.33 - k * 0.22, 0.8, this.FZ - FOGAO_DA_LIZ.fundo / 2 - 0.035);
  }

  /** um ponto do balcão térmico (x no referencial dele), na faixa da comida */
  private noBalcao(x: number, z: number = LUGARES_DO_BALCAO.cubaZ): THREE.Vector3 {
    return v3(this.TX + x, LUGARES_DO_BALCAO.comidaY, this.BZ + z);
  }

  /** os postos dela (onde ela fica de pé para cada coisa) */
  private posto(nome: 'frigideira' | 'panelinha' | 'passe' | 'sopa' | 'tabua' | 'refratario' | 'jarrinha' | 'atender' | PratoDaLinha): Ponto {
    const LB = LUGARES_DO_BALCAO;
    const LD = LUGARES_DA_BANCADA;
    switch (nome) {
      case 'frigideira': return { x: this.boca(1).x - 0.06, z: this.ZP + 0.02 };
      case 'panelinha': return { x: this.boca(0).x - 0.16, z: this.ZP + 0.02 };
      case 'passe': return { x: this.TX + LB.passe.x - 0.05, z: this.ZP + 0.02 };
      case 'sopa':
      case 'atender': return { x: this.TX + SOPA_NO_BALCAO.x - 0.26, z: this.BZ + SOPA_NO_BALCAO.z - 0.35 };
      case 'tabua': return { x: this.BX + LD.tabua.x - 0.02, z: this.ZP };
      case 'refratario': return { x: this.BX + LD.refratario.x + 0.208 - 0.19, z: this.ZP };
      case 'jarrinha': return { x: this.BX + LD.jarrinha.x + 0.05, z: this.ZP };
      default: return { x: this.TX + LB.cubas[nome] - 0.12, z: this.ZP };
    }
  }

  // --------------------------------------------------------------- casas

  private morar(obj: THREE.Object3D, pai: THREE.Object3D, p: THREE.Vector3, rotY = 0, rotX = 0, rotZ = 0): void {
    obj.position.copy(p);
    obj.rotation.set(rotX, rotY, rotZ);
    pai.add(obj);
    this.casas.set(obj, { pai, pos: p.clone(), quat: obj.quaternion.clone(), escala: obj.scale.x });
  }

  /** volta para casa na hora (quando a rotina é interrompida) */
  private guardarJa(obj: THREE.Object3D): void {
    const c = this.casas.get(obj);
    if (!c) return;
    c.pai.add(obj);
    obj.position.copy(c.pos);
    obj.quaternion.copy(c.quat);
    obj.scale.setScalar(c.escala);
  }

  // ------------------------------------------------------------- as mãos

  private mao(lado: Lado, p: THREE.Vector3 | null): void {
    if (p) {
      (this.alvo[lado] ??= v3()).copy(p);
      this.liz.maoPara(lado, p);
    } else {
      this.alvo[lado] = null;
      this.liz.maoPara(lado, null);
    }
  }

  /** a pata esquerda carrega o prato do lado dela (anda junto) */
  private maoDoPrato(): void {
    this.alvo[0] = null;
    this.pataDoPrato.copy(PATA_DO_LADO);
    this.liz.maoPara(0, PATA_DO_LADO, true);
  }

  /** o prato vai para a frente (para receber a comida) ou volta para o lado */
  private async pratoPara(r: Roteiro, frente: boolean): Promise<void> {
    const de = this.pataDoPrato.clone();
    const ate = frente ? PATA_NA_FRENTE : PATA_DO_LADO;
    await r.durante(0.3, (k) => {
      this.pataDoPrato.lerpVectors(de, ate, suave(k));
      this.liz.maoPara(0, this.pataDoPrato, true);
    });
  }

  /** gira a mão (o que ela segura) em relação ao corpo */
  private girar(lado: Lado, e: THREE.Euler | null): void {
    this.giro[lado].setFromEuler(e ?? DE_PE);
    this.liz.orientarMao(lado, e);
  }

  /** onde a pata tem que estar para a PONTA (`ponta`, no quadro da mão) cair em `alvo` */
  private pegaDe(lado: Lado, alvo: THREE.Vector3, ponta: THREE.Vector3): THREE.Vector3 {
    const q = this.liz.group.quaternion.clone().multiply(this.giro[lado]);
    return alvo.clone().sub(ponta.clone().applyQuaternion(q));
  }

  /** a pata vai a um ponto (ou a um ponto que anda) em `seg`, com um arco */
  private async levar(r: Roteiro, lado: Lado, para: THREE.Vector3 | (() => THREE.Vector3), seg: number, arco = 0): Promise<void> {
    const de = (this.alvo[lado] ?? this.liz.pataNoMundo(lado)).clone();
    const p = v3();
    await r.durante(seg, (k) => {
      const e = suave(k);
      const fim = typeof para === 'function' ? para() : para;
      p.copy(de).lerp(fim, e);
      p.y += arco * sino(k);
      this.mao(lado, p);
    });
  }

  /** a ponta da ferramenta vai a `alvo` (a conta da pega é refeita a cada quadro: o giro pode mudar) */
  private async levarPonta(r: Roteiro, lado: Lado, ponta: THREE.Vector3, alvo: THREE.Vector3 | (() => THREE.Vector3), seg: number, arco = 0): Promise<void> {
    await this.levar(r, lado, () => this.pegaDe(lado, typeof alvo === 'function' ? alvo() : alvo, ponta), seg, arco);
  }

  /** PEGA a coisa: a pata vai à pega dela, ela passa para a mão e assenta de pé */
  private async pegar(r: Roteiro, lado: Lado, obj: THREE.Object3D, assentar = true, giro: THREE.Euler | null = DE_PE): Promise<void> {
    const pega = obj.getWorldPosition(v3());
    await this.levar(r, lado, pega, 0.42 / 1, 0.05);
    await r.durante(0.08);
    this.girar(lado, giro);
    this.liz.maos[lado].attach(obj);
    if (!assentar) return;
    const p0 = obj.position.clone();
    const q0 = obj.quaternion.clone();
    const q1 = new THREE.Quaternion();
    await r.durante(0.22, (k) => {
      const e = suave(k);
      obj.position.lerpVectors(p0, ZERO, e);
      obj.quaternion.slerpQuaternions(q0, q1, e);
    });
  }

  /** LARGA a coisa na casa dela: a pata leva até lá, e ela assenta deitada */
  private async largar(r: Roteiro, lado: Lado, obj: THREE.Object3D): Promise<void> {
    const c = this.casas.get(obj);
    if (!c) return;
    const destino = c.pai.localToWorld(c.pos.clone());
    const desloc = this.liz.pataNoMundo(lado).sub(obj.getWorldPosition(v3()));
    await this.levar(r, lado, destino.clone().add(desloc).add(v3(0, 0.03, 0)), 0.42, 0.05);
    c.pai.attach(obj);
    const p0 = obj.position.clone();
    const q0 = obj.quaternion.clone();
    await r.durante(0.18, (k) => {
      const e = suave(k);
      obj.position.lerpVectors(p0, c.pos, e);
      obj.quaternion.slerpQuaternions(q0, c.quat, e);
    });
    this.girar(lado, null);
    await this.levar(r, lado, () => destino.clone().add(desloc).add(v3(0, 0.12, -0.08)), 0.2);
    this.mao(lado, null);
  }

  /** larga o que está na mão em cima de um ponto do mundo (o prato no passe) */
  private async pousar(r: Roteiro, lado: Lado, obj: THREE.Object3D, onde: THREE.Vector3): Promise<void> {
    const desloc = this.liz.pataNoMundo(lado).sub(obj.getWorldPosition(v3()));
    await this.levar(r, lado, onde.clone().add(desloc), 0.4, 0.04);
    this.w.root.attach(obj);
    const p0 = obj.position.clone();
    const q0 = obj.quaternion.clone();
    await r.durante(0.12, (k) => {
      obj.position.lerpVectors(p0, onde, k);
      obj.quaternion.slerpQuaternions(q0, new THREE.Quaternion(), k);
    });
    this.som('louca');
    await this.levar(r, lado, () => onde.clone().add(desloc).add(v3(0, 0.1, -0.1)), 0.18);
    this.mao(lado, null);
  }

  // ---------------------------------------------------------------- andar

  /** anda até o posto e se vira para a janela */
  private async ir(r: Roteiro, p: Ponto, vel = 1.1, inclinar = 0): Promise<void> {
    this.liz.inclinar(0);
    this.liz.olharPara(null);
    if (Math.hypot(p.x - this.liz.x, p.z - this.liz.z) > 0.06) {
      this.liz.pararDeEncarar();
      await r.ate(this.liz.irPara(p.x, p.z, vel));
    }
    this.liz.encarar(p.x, p.z + 6);
    await r.durante(0.28);
    this.liz.inclinar(inclinar);
  }

  // ------------------------------------------------------------- o fogo

  private async acender(r: Roteiro, lado: Lado, i: number, acesa: boolean): Promise<void> {
    const b = this.botao(i);
    this.liz.olharPara(b);
    await this.levar(r, lado, b.clone().add(v3(0, 0.01, -0.03)), 0.35, 0.03);
    // o giro do botão: a pata torce
    this.girar(lado, new THREE.Euler(0, 0, 0));
    if (acesa) this.som('gasDoFogareiro');
    await r.durante(0.25, (k) => this.liz.orientarMao(lado, new THREE.Euler(0, 0, -k * 1.2)));
    this.chamas[i] = acesa;
    this.som(acesa ? 'chamaAcende' : 'chamaApaga');
    this.girar(lado, null);
    await this.levar(r, lado, b.clone().add(v3(0, 0.12, -0.12)), 0.2);
    this.mao(lado, null);
  }

  // ---------------------------------------------------------------- o som

  private som(nome: SomNome): void {
    if (this.forcarSom || this.planta.perto()) this.g.som(nome);
  }

  // ============================================================ o quadro

  update(dt: number): void {
    // sumida (no Halloween ela foi para a festa), a cozinha fica quieta
    if (!this.liz.group.visible) {
      if (this.roteiro) this.pararRotina();
      return;
    }
    const d = dt * this.vezes;
    this.relogio += d;
    this.roteiro?.update(d);
    this.liz.update(d);
    this.farelos.update(d);
    for (let i = 0; i < 4; i++) chamaDoFogao(this.planta.fogao, i, this.chamas[i], this.relogio);
    // o vapor das panelas: sobe com o fogo da boca delas
    this.vapores[0].alvo = this.chamas[1] ? 0.55 : 0;
    this.vapores[1].alvo = this.chamas[0] ? 0.5 : 0;
    for (const v of this.vapores) {
      v.calor += (v.alvo - v.calor) * Math.min(1, d * 1.5);
      animarVapor(v.v, this.relogio + v.calor, v.calor);
    }
  }

  // ============================================================ a rotina

  /**
   * A ROTINA DA COZINHA: ela alterna, sem parar, entre o FOGÃO (o refogado
   * na frigideira, sacudido e mexido, ou o fororo na panelinha), a TÁBUA
   * (picar uma cenoura ou um pimentão inteiro e varrer para a tigela), o
   * CALDEIRÃO (mexer a sopita cantarolando) e um PASSEIO pela cozinha
   * (espiar o refeitório pela janela, conferir a geladeira, o cardápio).
   */
  comecarRotina(): void {
    this.pararRotina();
    const r = new Roteiro();
    this.roteiro = r;
    void this.rotina(r).catch((e: unknown) => {
      if (!(e instanceof Cancelado)) throw e;
    });
  }

  /** volta para a rotina, se ela não estiver nela */
  garantirRotina(): void {
    if (!this.roteiro) this.comecarRotina();
  }

  /** interrompe a rotina onde ela estiver, e tudo volta para o lugar */
  pararRotina(): void {
    this.roteiro?.cancelar();
    this.roteiro = null;
    this.liz.largarTudo();
    for (const obj of this.casas.keys()) this.guardarJa(obj);
    this.mao(0, null);
    this.mao(1, null);
    this.girar(0, null);
    this.girar(1, null);
    this.liz.inclinar(0);
    this.liz.olharPara(null);
    this.liz.mexerAPanela(false);
    this.liz.segurarConcha(false);
    this.liz.inclinarConcha(0);
    this.fio.mesh.visible = false;
    for (let i = 0; i < 4; i++) this.chamas[i] = false;
    this.estacao = 'parada';
  }

  private async rotina(r: Roteiro): Promise<void> {
    const ordem = ['fogao', 'passeio', 'tabua', 'sopa', 'fogao', 'tabua', 'passeio', 'sopa'] as const;
    for (let i = 0; ; i++) {
      const estacao = ordem[i % ordem.length];
      this.estacao = estacao;
      this.visitas[estacao] = (this.visitas[estacao] ?? 0) + 1;
      if (estacao === 'fogao') {
        if (this.visitas.fogao % 2 === 1) await this.refogar(r);
        else await this.mexerOFororo(r);
      } else if (estacao === 'tabua') await this.picar(r);
      else if (estacao === 'sopa') await this.mexerASopa(r);
      else await this.passear(r, i);
    }
  }

  /** O REFOGADO: acende, segura a frigideira e sacode, e mexe com a espátula */
  private async refogar(r: Roteiro): Promise<void> {
    naFrigideira(this.frigideira, 'refogado');
    await this.ir(r, this.posto('frigideira'), 1.0, 0.12);
    await this.acender(r, 1, 1, true);
    this.som('fritar');
    const refogado = this.frigideira.getObjectByName('refogado')!;
    await this.pegar(r, 1, this.ferramentas.espatula, true, INCLINADA(0.25));
    await this.pegar(r, 0, this.frigideira, false);
    const pega = this.frigideira.getWorldPosition(v3());
    this.liz.olharPara(this.boca(1));
    for (let vez = 0; vez < 2; vez++) {
      // SACODE: a pata leva a frigideira para a frente e puxa de volta, e o
      // refogado pula e cai girando
      await this.sacudir(r, pega, refogado);
      // e MEXE com a espátula, num círculo dentro da panela
      await this.mexerNaFrigideira(r, refogado, 2);
    }
    await this.largar(r, 0, this.frigideira);
    await this.largar(r, 1, this.ferramentas.espatula);
    await this.acender(r, 1, 1, false);
    this.liz.olharPara(null);
  }

  /** um sacolejo de frigideira: frente e para cima, e volta; o que está nela pula */
  private async sacudir(r: Roteiro, pega: THREE.Vector3, conteudo: THREE.Object3D, vezes = 2): Promise<void> {
    const p = v3();
    const fwd = v3(0, 0, 1);
    const y0 = conteudo.position.y;
    await r.durante(0.55 * vezes, (k) => {
      const f = (k * vezes) % 1;
      const ida = Math.sin(f * Math.PI * 2);
      p.copy(pega).addScaledVector(fwd, ida * 0.05).add(v3(0, Math.max(0, ida) * 0.04 + 0.02, 0));
      this.mao(0, p);
      // o pulo vem depois da ida (o tranco da volta joga a comida para cima)
      const pulo = Math.max(0, Math.sin((f - 0.35) * Math.PI * 2));
      conteudo.position.y = y0 + pulo * 0.05;
      conteudo.rotation.y += pulo * 0.08;
      conteudo.rotation.x = Math.sin(f * Math.PI * 2) * 0.12 * pulo;
    });
    conteudo.position.y = y0;
    conteudo.rotation.x = 0;
    this.som('fritar');
    this.farelos.soltar(this.frigideira.localToWorld(FRIGIDEIRA.centro.clone().add(v3(0, 0.03, 0))), P.oleoQuente, 6, 0.95, 0.06, 0.9, 0.006);
    await this.levar(r, 0, pega.clone().add(v3(0, 0.02, 0)), 0.15);
  }

  /** a espátula (na pata direita) dá voltas dentro da frigideira */
  private async mexerNaFrigideira(r: Roteiro, conteudo: THREE.Object3D, voltas: number): Promise<void> {
    const centro = (): THREE.Vector3 => this.frigideira.localToWorld(FRIGIDEIRA.centro.clone().add(v3(0, 0.025, 0)));
    await this.levarPonta(r, 1, PONTA.espatula, centro, 0.3, 0.04);
    await r.durante(0.8 * voltas, (k, dt) => {
      const a = k * voltas * Math.PI * 2;
      const c = centro().add(v3(Math.cos(a) * 0.06, 0, Math.sin(a) * 0.05));
      this.mao(1, this.pegaDe(1, c, PONTA.espatula));
      conteudo.rotation.y += dt * 1.6;
    });
  }

  /** O FORORO DE SEMPRE: a panelinha no fogo baixo, e a colher de pau dando voltas */
  private async mexerOFororo(r: Roteiro): Promise<void> {
    await this.ir(r, this.posto('panelinha'), 1.0, 0.14);
    await this.acender(r, 1, 0, true);
    await this.mexerAPanelinha(r, 3);
    await this.acender(r, 1, 0, false);
    this.liz.olharPara(null);
  }

  private async mexerAPanelinha(r: Roteiro, voltas: number): Promise<void> {
    const colher = this.ferramentas.colherDePau;
    const creme = this.panelinha.getObjectByName('creme')!;
    const centro = (): THREE.Vector3 => this.panelinha.localToWorld(PANELINHA.centro.clone().add(v3(0, 0.08, 0)));
    this.liz.olharPara(centro());
    await this.pegar(r, 1, colher, true, INCLINADA(-0.6));
    await this.levarPonta(r, 1, PONTA.colherDePau, centro, 0.3, 0.06);
    this.som('vapor');
    await r.durante(0.9 * voltas, (k, dt) => {
      const a = k * voltas * Math.PI * 2;
      const c = centro().add(v3(Math.cos(a) * 0.045, 0, Math.sin(a) * 0.04));
      this.mao(1, this.pegaDe(1, c, PONTA.colherDePau));
      creme.rotation.y += dt * 2.2;
    });
    await this.largar(r, 1, colher);
  }

  /** A TÁBUA: segura o legume, pica até o fim, varre para a tigela e pega outro */
  private async picar(r: Roteiro): Promise<void> {
    const t = this.tabua;
    await this.ir(r, this.posto('tabua'), 1.0, 0.1);
    this.liz.olharPara(t.meioDoLegume());
    await this.pegar(r, 1, this.ferramentas.faca, true, DE_PE);
    await this.levar(r, 0, t.meioDoLegume().add(v3(0, 0.03, 0)), 0.35, 0.03);
    const N = TabuaDeCorte.N;
    for (let i = 0; i < N; i++) {
      const ponta = t.pontaDoLegume();
      // sobe e desce rápido: o corte é o tuc na tábua
      await this.levarPonta(r, 1, PONTA.faca, ponta.clone().add(v3(0, 0.07, 0)), 0.14);
      await this.levarPonta(r, 1, PONTA.faca, ponta.clone().add(v3(0, -0.012, 0)), 0.09);
      t.cortar((i + 1) / N);
      this.som('virar');
      // a pata de trás vai recuando junto com o legume que encolhe
      this.mao(0, t.meioDoLegume().add(v3(-0.03 * (i / N), 0.03, 0)));
    }
    this.mao(0, null);
    // VARRE: a faca deitada empurra as rodelas para a tigela
    this.girar(1, new THREE.Euler(0, Math.PI / 2, Math.PI / 2 - 0.2));
    const de = t.pontaDoLegume().add(v3(0.0, 0.0, 0));
    const ate = t.tigelaNoMundo();
    await this.levarPonta(r, 1, PONTA.faca, de, 0.25, 0.04);
    await r.durante(0.55, (k) => {
      const p = de.clone().lerp(ate, suave(k));
      this.mao(1, this.pegaDe(1, p, PONTA.faca));
      t.varrer(k);
    });
    t.varrer(1);
    this.som('pingo');
    this.girar(1, DE_PE);
    await this.largar(r, 1, this.ferramentas.faca);
    t.proximo();
    this.liz.olharPara(null);
  }

  /** O CALDEIRÃO: mexe a sopita com a concha, cantarolando */
  private async mexerASopa(r: Roteiro): Promise<void> {
    await this.ir(r, this.posto('sopa'), 1.0);
    this.liz.mexerAPanela(true);
    if (this.planta.perto()) this.g.som('cantarolar');
    await r.durante(5.5);
    this.liz.mexerAPanela(false);
    await r.durante(0.4);
  }

  /** O PASSEIO: espiar o refeitório pela janela, conferir o cardápio, a geladeira */
  private async passear(r: Roteiro, vez: number): Promise<void> {
    const { cx, bz } = this.planta;
    const lugares: Array<{ p: Ponto; olha: THREE.Vector3 }> = [
      // espiar o refeitório pela janela, quase encostada no balcão
      { p: { x: cx + 0.5, z: this.ZP + 0.02 }, olha: v3(cx + 1.5, 0.9, bz + 5) },
      // o cardápio de giz no fundo (ela se vira e confere)
      { p: { x: cx - 0.3, z: this.ZP - 0.25 }, olha: v3(cx, 3.6, bz - 3) },
      // a geladeira, na ponta da direita
      { p: { x: cx + 2.45, z: this.ZP - 0.05 }, olha: v3(cx + 3.6, 1.2, this.ZP - 0.2) },
      // as panelas da prateleira do fundo
      { p: { x: cx - 2.4, z: this.ZP - 0.2 }, olha: v3(cx - 2.2, 2.1, bz - 3) },
    ];
    for (let k = 0; k < 2; k++) {
      const l = lugares[(vez + k * 2) % lugares.length];
      this.liz.inclinar(0);
      this.liz.olharPara(null);
      this.liz.pararDeEncarar();
      await r.ate(this.liz.irPara(l.p.x, l.p.z, 0.9));
      this.liz.encarar(l.olha.x, l.olha.z);
      await r.durante(0.4);
      this.liz.olharPara(l.olha);
      if (k === 0 && this.planta.perto()) this.g.som('cantarolar');
      await r.durante(1.8);
      this.liz.olharPara(null);
    }
  }

  // ========================================================== atender

  /**
   * ATENDER: a rotina para onde estiver (o que está na pata volta para o
   * lugar), e ela vem LIGEIRA até a janela do caldeirão e se vira para a
   * dupla. O aceno é da cena, na primeira fala.
   */
  async atender(olhar: Ponto): Promise<void> {
    this.pararRotina();
    const r = new Roteiro();
    this.roteiro = r;
    const p = this.posto('atender');
    this.liz.pararDeEncarar();
    if (Math.hypot(p.x - this.liz.x, p.z - this.liz.z) > 0.06) await r.ate(this.liz.irPara(p.x, p.z, 2.1));
    this.liz.encarar(olhar.x, olhar.z);
    await r.durante(0.3);
    this.roteiro = null;
  }

  // ======================================================== os pratos

  /**
   * PREPARA o prato pedido, dois de uma vez (um para cada um da dupla): o
   * primeiro com todo o carinho, o segundo no mesmo jeito e mais ligeiro.
   * Cada prato pronto vai pela janela para a bandeja que espera no
   * parapeito (`bandejas`), e a promessa resolve com os dois lá.
   */
  async preparar(id: PratoDaLiz, bandejas: THREE.Object3D[]): Promise<void> {
    this.pararRotina();
    const r = new Roteiro();
    this.roteiro = r;
    this.forcarSom = true;
    try {
      for (const [i, bandeja] of bandejas.entries()) {
        r.pressa = i === 0 ? 1 : 1.7;
        const prato = pratoDaTiaLiz(id);
        esvaziar(prato);
        this.pratoNaMontagem = prato;
        await this.montar(id, r, prato);
        this.passo = 'entregar';
        await this.entregar(r, prato, bandeja);
      }
    } finally {
      this.forcarSom = false;
      this.pratoNaMontagem = null;
      this.passo = '';
      this.roteiro = null;
      this.pararRotina();
      this.repor();
    }
  }

  private montar(id: PratoDaLiz, r: Roteiro, prato: THREE.Object3D): Promise<void> {
    switch (id) {
      case 'sopita': return this.montarSopita(r, prato);
      case 'pasta': return this.montarPasta(r, prato);
      case 'pabellon': return this.montarPabellon(r, prato);
      case 'fororo': return this.montarFororo(r, prato);
      default: return this.montarTresLeches(r, prato);
    }
  }

  /** a cozinha volta ao de sempre (a torta inteira, as tajadas cruas, as almôndegas na frigideira) */
  private repor(): void {
    this.refratario.repor();
    naFrigideira(this.frigideira, 'refogado');
    const taj = this.frigideira.getObjectByName('tajadas');
    taj?.children.forEach((t) => {
      t.visible = true;
      t.rotation.x = 0;
      t.getObjectByName('crua')!.visible = true;
      t.getObjectByName('dourada')!.visible = false;
    });
    const molho = this.frigideira.getObjectByName('molho');
    molho?.children.forEach((c) => { c.visible = true; });
    const creme = this.panelinha.getObjectByName('creme');
    if (creme) creme.visible = true;
  }

  // ----------------------------------------------------- os passos comuns

  /** a louça sai da pilha do passe para a pata esquerda (ou para o passe) */
  private async loucaDaPilha(r: Roteiro, prato: THREE.Object3D, paraOPasse: boolean): Promise<void> {
    this.passo = 'louca';
    const LB = LUGARES_DO_BALCAO;
    await this.ir(r, this.posto('passe'), 1.25, 0.28);
    const topo = v3(this.TX + LB.passe.x, LB.pilha.topo, this.BZ + LB.pilha.z);
    this.liz.olharPara(topo);
    // a pata vai à beira de perto do prato de cima, e o prato novo é ele
    const lado: Lado = paraOPasse ? 1 : 0;
    const beira = topo.clone().add(v3(lado === 1 ? 0.06 : -0.06, 0.01, -0.13));
    await this.levar(r, lado, beira, 0.45, 0.06);
    prato.position.copy(topo);
    prato.rotation.set(0, 0, 0);
    this.w.root.add(prato);
    this.som('louca');
    this.liz.maos[lado].attach(prato);
    if (paraOPasse) {
      await this.pousar(r, 1, prato, v3(this.TX + LB.passe.x, 0.93, this.BZ + LB.passe.z));
    } else {
      // assenta na palma e vem para a frente dela
      const p0 = prato.position.clone();
      const q0 = prato.quaternion.clone();
      this.girar(0, null);
      this.maoDoPrato();
      await r.durante(0.35, (k) => {
        prato.position.lerpVectors(p0, PRATO_NA_PATA, suave(k));
        prato.quaternion.slerpQuaternions(q0, new THREE.Quaternion(), suave(k));
      });
    }
    this.liz.olharPara(null);
  }

  /** pega o prato do passe na pata esquerda, para levar */
  private async pratoDoPasse(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    await this.ir(r, this.posto('passe'), 1.1, 0.2);
    const p = prato.getWorldPosition(v3());
    this.liz.olharPara(p);
    await this.levar(r, 0, p.clone().add(v3(-0.08, 0.01, -0.09)), 0.38, 0.04);
    this.liz.maos[0].attach(prato);
    this.girar(0, null);
    this.maoDoPrato();
    const p0 = prato.position.clone();
    const q0 = prato.quaternion.clone();
    await r.durante(0.35, (k) => {
      prato.position.lerpVectors(p0, PRATO_NA_PATA, suave(k));
      prato.quaternion.slerpQuaternions(q0, new THREE.Quaternion(), suave(k));
    });
    this.som('louca');
    this.liz.olharPara(null);
  }

  /** um ponto do prato (no quadro dele) no mundo */
  private noPrato(prato: THREE.Object3D, x = 0, y = 0.05, z = 0): THREE.Vector3 {
    return prato.localToWorld(v3(x, y, z));
  }

  /** a parte aparece no prato com um pulinho (cresce, passa um tico e assenta) */
  private async aparecer(r: Roteiro, parte: THREE.Object3D | undefined, seg = 0.32, de = 0.25): Promise<void> {
    if (!parte) return;
    parte.visible = true;
    const s1 = parte.userData.escala as THREE.Vector3 | undefined ?? parte.scale.clone();
    parte.userData.escala = s1;
    await r.durante(seg, (k) => {
      const e = 1 - Math.pow(1 - k, 3);
      const sobra = Math.sin(k * Math.PI) * 0.12;
      const s = de + (1 - de) * e + sobra;
      parte.scale.set(s1.x * s, s1.y * (s - sobra * 1.5), s1.z * s);
    });
    parte.scale.copy(s1);
  }

  /** a PITADA: a pata pega no potinho, leva por cima do prato e esfarela */
  private async pitada(r: Roteiro, lado: Lado, pote: THREE.Vector3, prato: THREE.Object3D, cor: number, folha = false): Promise<void> {
    this.liz.olharPara(pote);
    await this.levar(r, lado, pote.clone().add(v3(0, 0.07, -0.02)), 0.32, 0.05);
    await r.durante(0.18, (k) => this.mao(lado, pote.clone().add(v3(0, 0.07 - sino(k) * 0.035, -0.02))));
    const sobre = (): THREE.Vector3 => this.noPrato(prato, 0, 0.17, 0);
    this.liz.olharPara(sobre());
    await this.levar(r, lado, sobre, 0.38, 0.05);
    const chao = this.noPrato(prato, 0, 0.04, 0).y;
    await r.durante(0.55, (k, dt) => {
      // os dedos esfregam: a pata tremelica e a pitada cai
      const p = sobre().add(v3(Math.sin(k * 40) * 0.006, 0, Math.cos(k * 33) * 0.004));
      this.mao(lado, p);
      if (Math.random() < dt * 30) this.farelos.soltar(this.liz.pataNoMundo(lado).add(v3(0, -0.05, 0)), cor, 1, chao, 0.03, 0, folha ? 0.01 : 0.005);
    });
  }

  /** o talher deitado no prato: a pata põe, e ele aparece */
  private async talher(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    const t = prato.getObjectByName('talher');
    if (!t) return;
    await this.levar(r, 1, () => this.noPrato(prato, t.position.x, 0.12, t.position.z), 0.3, 0.04);
    await this.aparecer(r, t, 0.2, 0.6);
    this.som('colherNaCaneca');
    this.mao(1, null);
  }

  /**
   * ENTREGAR: ela vem para a janela do caldeirão (onde a dupla está), estica
   * as patas por cima do balcão e o prato DESLIZA pela janela num arco até a
   * bandeja do parapeito — a pata dela não alcança o parapeito, e o prato
   * escorregando é o gesto de quem empurra a bandeja para fora.
   */
  private async entregar(r: Roteiro, prato: THREE.Object3D, bandeja: THREE.Object3D): Promise<void> {
    await this.ir(r, this.posto('atender'), 1.3, 0.3);
    this.liz.olharPara(bandeja.getWorldPosition(v3()));
    // as duas patas para a frente, o prato por cima
    const frente = this.liz.group.localToWorld(v3(-0.02, 1.12, 0.42));
    await this.levar(r, 0, frente, 0.4, 0.04);
    this.mao(1, frente.clone().add(v3(0.16, -0.02, -0.02)));
    await r.durante(0.15);
    this.w.root.attach(prato);
    this.liz.largarTudo();
    const p0 = prato.position.clone();
    const q0 = prato.quaternion.clone();
    const lugar = bandeja.localToWorld(v3(-0.04, 0.022, 0));
    const q1 = bandeja.getWorldQuaternion(new THREE.Quaternion());
    this.som('virar');
    await r.durante(0.7, (k) => {
      const e = suave(k);
      prato.position.lerpVectors(p0, lugar, e);
      prato.position.y += sino(k) * 0.16;
      prato.quaternion.slerpQuaternions(q0, q1, e);
    });
    // a bandeja esperava com um prato vazio de mentira: sai ele, entra o de verdade
    const velho = bandeja.userData.prato as THREE.Object3D | undefined;
    if (velho && velho !== prato) velho.removeFromParent();
    bandeja.attach(prato);
    prato.position.set(-0.04, 0.022, 0);
    prato.quaternion.identity();
    bandeja.userData.prato = prato;
    this.som('louca');
    this.mao(0, null);
    this.mao(1, null);
    this.liz.inclinar(0);
    this.liz.olharPara(null);
    await r.durante(0.3);
  }

  // ============================================================ SOPITA

  /**
   * A SOPITA: a tigela da pilha na pata esquerda; no caldeirão, a concha
   * mergulha, dá uma volta e sobe pingando; por cima da tigela ela inclina e
   * o caldo cai num fio — duas conchadas, e a tigela enche. Depois a pitada
   * de coentro do potinho do lado, e a colher.
   */
  private async montarSopita(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    await this.loucaDaPilha(r, prato, false);
    this.passo = 'concha';
    await this.ir(r, this.posto('sopa'), 1.2, 0.12);
    await this.pratoPara(r, true);
    const caldo = prato.getObjectByName('caldo')!;
    const sopa = v3(this.TX + SOPA_NO_BALCAO.x, SOPA_NO_BALCAO.boca, this.BZ + SOPA_NO_BALCAO.z);
    const concha = this.liz.group.getObjectByName('concha-da-liz')!;
    /** a boca da cuia, no mundo (a concha pendura 17 cm embaixo da pata) */
    const cuia = (): THREE.Vector3 => concha.localToWorld(v3(0, -0.15, 0.03));
    this.liz.segurarConcha(true);
    const acima = sopa.clone().add(v3(0.02, 0.21, -0.02));
    for (let vez = 0; vez < 2; vez++) {
      this.liz.olharPara(sopa);
      this.liz.inclinarConcha(0);
      await this.levar(r, 1, acima, 0.4, 0.05);
      // mergulha, dá uma volta no fundo e sobe pingando
      await r.durante(0.75, (k) => {
        const a = k * Math.PI * 2;
        this.mao(1, acima.clone().add(v3(Math.cos(a) * 0.04, -0.06 * sino(Math.min(1, k * 1.4)), Math.sin(a) * 0.03)));
      });
      this.som('pingo');
      /*
       * POR CIMA DA TIGELA: a concha já sai meio inclinada (a cuia vai à
       * frente da pata, e a pata não precisa subir tanto), e a cada quadro a
       * pata corrige para a CUIA ficar em cima da tigela.
       */
      const alvoDaCuia = (): THREE.Vector3 => this.noPrato(prato, 0, 0.17, 0);
      const pataPara = (): THREE.Vector3 => {
        const pata = this.liz.pataNoMundo(1);
        return alvoDaCuia().add(pata.sub(cuia()));
      };
      this.liz.olharPara(this.noPrato(prato));
      await r.durante(0.5, (k) => {
        this.liz.inclinarConcha(suave(k) * 0.7);
        const de = acima.clone().add(v3(0, 0.03, 0));
        this.mao(1, de.lerp(pataPara(), suave(k)));
      });
      this.som('despejar');
      const k0 = vez === 0 ? 0 : 0.55;
      await r.durante(1.0, (k) => {
        this.mao(1, pataPara());
        this.liz.inclinarConcha(0.7 + sino(Math.min(1, k * 1.1)) * 1.0);
        if (k > 0.12 && k < 0.85) {
          this.fio.mesh.visible = true;
          this.fio.pintar(P.sopaCaldo);
          this.fio.entre(cuia(), this.noPrato(prato, 0, 0.055, 0), 0.008);
        } else this.fio.mesh.visible = false;
        // o caldo sobe na tigela
        const nivel = k0 + (vez === 0 ? 0.55 : 0.45) * suave(Math.min(1, Math.max(0, (k - 0.12) / 0.7)));
        if (nivel > 0.02) {
          caldo.visible = true;
          caldo.position.y = -0.04 * (1 - nivel);
          const s = 0.72 + 0.28 * nivel;
          caldo.scale.set(s, 1, s);
        }
      });
      this.fio.mesh.visible = false;
    }
    this.liz.inclinarConcha(0);
    caldo.position.y = 0;
    caldo.scale.set(1, 1, 1);
    this.liz.segurarConcha(false);
    this.passo = 'coentro';
    const LB = LUGARES_DO_BALCAO;
    await this.pitada(r, 1, v3(this.TX + LB.coentro, 0.96, this.BZ + LB.tras), prato, P.sopaCoentro, true);
    await this.aparecer(r, prato.getObjectByName('coentro'), 0.25, 0.5);
    await this.talher(r, prato);
    await this.pratoPara(r, false);
  }

  // ============================================================== PASTA

  /**
   * A PASTA CON ALBÓNDIGAS: o prato no passe; o pegador torce o espaguete
   * da cuba e deita um ninho no prato; no fogão, a frigideira do molho com
   * as três almôndegas — ela sacode (as almôndegas pulam) e mexe; leva a
   * frigideira até o passe e põe, com a colher, almôndega por almôndega e o
   * molho por cima; e a pitada de queijo e a folha de manjericão.
   */
  private async montarPasta(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    const LB = LUGARES_DO_BALCAO;
    await this.loucaDaPilha(r, prato, true);
    // o ESPAGUETE: o pegador torce na cuba e deita o ninho
    this.passo = 'espaguete';
    const cuba = this.noBalcao(LB.cubas.pasta, -0.13);
    await this.ir(r, { x: cuba.x - 0.17, z: this.ZP + 0.02 }, 1.2, 0.2);
    const pegador = this.ferramentas.pegadorDaPasta;
    await this.pegar(r, 1, pegador, true, DE_PE);
    this.liz.olharPara(cuba);
    await this.levarPonta(r, 1, PONTA.pegador, cuba.clone().add(v3(0, 0.03, 0)), 0.35, 0.05);
    const novelo = this.porcao(pegador, P.massaEspaguete, PONTA.pegador, 'novelo');
    await r.durante(0.5, (k) => {
      this.girar(1, new THREE.Euler(0, k * Math.PI * 2, 0));
      this.mao(1, this.pegaDe(1, cuba.clone().add(v3(0, 0.01 + k * 0.05, 0)), PONTA.pegador));
      novelo.visible = k > 0.3;
    });
    this.girar(1, DE_PE);
    await this.ir(r, { x: this.TX + LB.passe.x - 0.1, z: this.ZP + 0.02 }, 1.0, 0.25);
    const macarrao = prato.getObjectByName('macarrao')!;
    this.liz.olharPara(this.noPrato(prato));
    await this.levarPonta(r, 1, PONTA.pegador, () => this.noPrato(prato, 0, 0.07, 0), 0.4, 0.06);
    novelo.visible = false;
    // o ninho gira deitando no prato
    macarrao.visible = true;
    await r.durante(0.45, (k) => {
      macarrao.rotation.y = (1 - suave(k)) * -2.4;
      this.girar(1, new THREE.Euler(0, -k * Math.PI, 0));
      this.mao(1, this.pegaDe(1, this.noPrato(prato, 0, 0.07 - k * 0.02, 0), PONTA.pegador));
    });
    macarrao.rotation.y = 0;
    await this.aparecer(r, macarrao, 0.2, 0.8);
    this.girar(1, DE_PE);
    await this.largar(r, 1, pegador);

    // a FRIGIDEIRA: o molho e as almôndegas, sacudidos e mexidos
    this.passo = 'almondegas';
    naFrigideira(this.frigideira, 'molho');
    const molhoNaPanela = this.frigideira.getObjectByName('molho')!;
    await this.ir(r, this.posto('frigideira'), 1.1, 0.12);
    await this.acender(r, 1, 1, true);
    const colher = this.ferramentas.colherDeServirDaFrigideira;
    await this.pegar(r, 1, colher, true, DE_PE);
    await this.pegar(r, 0, this.frigideira, false);
    const pega = this.frigideira.getWorldPosition(v3());
    this.liz.olharPara(this.boca(1));
    await this.sacudir(r, pega, molhoNaPanela, 3);
    this.som('fritar');
    // leva a frigideira até o passe (a pata do cabo anda junto com ela)
    const local = this.liz.group.worldToLocal(this.liz.pataNoMundo(0));
    this.alvo[0] = null;
    this.liz.maoPara(0, local.add(v3(0, 0.03, 0)), true);
    await r.durante(0.2);
    await this.ir(r, { x: this.TX + LB.passe.x - 0.27, z: this.ZP + 0.02 }, 0.9, 0.18);
    await this.acender(r, 1, 1, false).catch(() => undefined);
    // as almôndegas, uma por uma, da frigideira para o prato
    const centro = (): THREE.Vector3 => this.frigideira.localToWorld(FRIGIDEIRA.centro.clone().add(v3(0, 0.03, 0)));
    for (let i = 0; i < 3; i++) {
      const naPanela = this.frigideira.getObjectByName(`almondega-${i}`)!;
      const pegaNaPanela = (): THREE.Vector3 => naPanela.getWorldPosition(v3()).add(v3(0, 0.01, 0));
      this.liz.olharPara(centro());
      await this.levarPonta(r, 1, PONTA.colherDeServir, pegaNaPanela, 0.35, 0.05);
      naPanela.visible = false;
      const bolinha = this.porcao(colher, P.almondega, PONTA.colherDeServir, 'almondega', 0.022);
      const noPrato = prato.getObjectByName(`almondega-${i}`)!;
      const destino = (): THREE.Vector3 => this.noPrato(prato, noPrato.position.x, noPrato.position.y + 0.05, noPrato.position.z);
      this.liz.olharPara(destino());
      await this.levarPonta(r, 1, PONTA.colherDeServir, destino, 0.4, 0.07);
      bolinha.visible = false;
      this.som('pingo');
      await this.aparecer(r, noPrato, 0.22, 0.4);
    }
    // e o molho que sobrou, por cima
    this.passo = 'molho';
    await this.levarPonta(r, 1, PONTA.colherDeServir, centro, 0.35, 0.04);
    const molho = this.porcao(colher, P.molhoDeTomate, PONTA.colherDeServir, 'molho', 0.02);
    const sobre = (): THREE.Vector3 => this.noPrato(prato, 0, 0.12, 0);
    await this.levarPonta(r, 1, PONTA.colherDeServir, sobre, 0.4, 0.06);
    this.girar(1, new THREE.Euler(0, 0, 1.2));
    molho.visible = false;
    this.som('despejar');
    await this.aparecer(r, prato.getObjectByName('molho'), 0.4, 0.3);
    molhoNaPanela.visible = false;
    this.girar(1, DE_PE);
    // devolve a frigideira para o fogo, e a colher
    await this.ir(r, this.posto('frigideira'), 0.9, 0.12);
    const casa = this.casas.get(this.frigideira)!;
    await this.levar(r, 0, casa.pos.clone().add(v3(0, 0.02, 0)), 0.3);
    await this.largar(r, 0, this.frigideira);
    await this.largar(r, 1, colher);
    // o QUEIJO e o MANJERICÃO, de volta no passe
    this.passo = 'queijo';
    await this.ir(r, { x: this.TX + LB.passe.x, z: this.ZP + 0.02 }, 1.0, 0.25);
    await this.pitada(r, 1, v3(this.TX + LB.queijo, 0.96, this.BZ + LB.tras), prato, P.queijoRalado);
    await this.aparecer(r, prato.getObjectByName('queijo'), 0.2, 0.5);
    await this.pitada(r, 1, v3(this.TX + LB.manjericao, 0.96, this.BZ + LB.tras), prato, P.manjericao, true);
    await this.aparecer(r, prato.getObjectByName('manjericao'), 0.25, 0.3);
    await this.talher(r, prato);
    await this.pratoDoPasse(r, prato);
  }

  // =========================================================== PABELLÓN

  /**
   * O PABELLÓN CRIOLLO: o prato no passe; as tajadas fritando na frigideira
   * — ela vira uma por uma com a espátula (a fatia sobe, dá meia volta no ar
   * e cai dourada) — e leva a frigideira até o prato; depois o prato na
   * pata e a LINHA: a forminha enche de arroz na cuba e vira no prato (o
   * domo), a colher do feijão, o pegador da carne desfiada.
   */
  private async montarPabellon(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    const LB = LUGARES_DO_BALCAO;
    await this.loucaDaPilha(r, prato, true);
    // as TAJADAS
    this.passo = 'tajadas';
    naFrigideira(this.frigideira, 'tajadas');
    await this.ir(r, this.posto('frigideira'), 1.1, 0.12);
    await this.acender(r, 1, 1, true);
    this.som('fritar');
    const esp = this.ferramentas.espatula;
    await this.pegar(r, 1, esp, true, INCLINADA(0.25));
    const tajadas = this.frigideira.getObjectByName('tajadas')!;
    for (let i = 0; i < 3; i++) {
      const t = tajadas.getObjectByName(`tajada-${i}`)!;
      const embaixo = (): THREE.Vector3 => t.getWorldPosition(v3()).add(v3(0, 0.004, -0.02));
      this.liz.olharPara(embaixo());
      await this.levarPonta(r, 1, PONTA.espatula, embaixo, 0.32, 0.04);
      // levanta, vira no ar e cai dourada
      const y0 = t.position.y;
      await r.durante(0.5, (k) => {
        t.position.y = y0 + sino(k) * 0.08;
        t.rotation.x = suave(k) * Math.PI;
        if (k > 0.5) {
          t.getObjectByName('crua')!.visible = false;
          t.getObjectByName('dourada')!.visible = true;
        }
        this.mao(1, this.pegaDe(1, embaixo().add(v3(0, sino(Math.min(1, k * 1.6)) * 0.05, 0)), PONTA.espatula));
      });
      t.position.y = y0;
      t.rotation.x = 0;
      this.som('virar');
      this.farelos.soltar(this.frigideira.localToWorld(FRIGIDEIRA.centro.clone().add(v3(0, 0.03, 0))), P.oleoQuente, 4, 0.95, 0.05, 0.8, 0.005);
    }
    this.som('fritar');
    await r.durante(0.3);
    // leva a frigideira ao passe, e as tajadas vão uma a uma para o prato
    await this.pegar(r, 0, this.frigideira, false);
    const local = this.liz.group.worldToLocal(this.liz.pataNoMundo(0));
    this.alvo[0] = null;
    this.liz.maoPara(0, local.add(v3(0, 0.03, 0)), true);
    await this.ir(r, { x: this.TX + LB.passe.x - 0.27, z: this.ZP + 0.02 }, 0.9, 0.18);
    this.chamas[1] = false;
    for (let i = 0; i < 3; i++) {
      const t = tajadas.getObjectByName(`tajada-${i}`)!;
      const embaixo = (): THREE.Vector3 => t.getWorldPosition(v3()).add(v3(0, 0.004, -0.02));
      await this.levarPonta(r, 1, PONTA.espatula, embaixo, 0.3, 0.04);
      t.visible = false;
      const fatia = this.porcao(esp, P.tajada, PONTA.espatula, 'tajada', 0.02);
      const noPrato = prato.getObjectByName(`tajada-${i}`)!;
      const destino = (): THREE.Vector3 => this.noPrato(prato, noPrato.position.x, 0.06 + i * 0.006, noPrato.position.z - 0.02);
      this.liz.olharPara(destino());
      await this.levarPonta(r, 1, PONTA.espatula, destino, 0.36, 0.06);
      fatia.visible = false;
      this.som('pingo');
      await this.aparecer(r, noPrato, 0.2, 0.5);
    }
    await this.ir(r, this.posto('frigideira'), 0.9, 0.12);
    await this.largar(r, 0, this.frigideira);
    await this.largar(r, 1, esp);
    // a LINHA: o prato na pata
    await this.pratoDoPasse(r, prato);
    // o ARROZ de forminha
    this.passo = 'arroz';
    await this.ir(r, this.posto('arroz'), 1.1, 0.14);
    await this.pratoPara(r, true);
    const f = this.ferramentas.forminha;
    const arrozDentro = f.getObjectByName('arroz-na-forminha')!;
    await this.pegar(r, 1, f, true, DE_PE);
    const cubaArroz = this.noBalcao(LB.cubas.arroz, -0.1);
    this.liz.olharPara(cubaArroz);
    await this.levarPonta(r, 1, PONTA.forminha, cubaArroz.clone().add(v3(0, 0.02, 0)), 0.35, 0.05);
    // a forminha raspa a cuba e enche
    await r.durante(0.4, (k) => {
      this.mao(1, this.pegaDe(1, cubaArroz.clone().add(v3(Math.sin(k * Math.PI) * 0.05, -0.01, 0)), PONTA.forminha));
      arrozDentro.visible = k > 0.4;
    });
    const arroz = prato.getObjectByName('arroz')!;
    const sobreArroz = (): THREE.Vector3 => this.noPrato(prato, arroz.position.x, 0.12, arroz.position.z);
    this.liz.olharPara(sobreArroz());
    await this.levarPonta(r, 1, PONTA.forminha, sobreArroz, 0.4, 0.06);
    // VIRA de boca para baixo, bate e levanta: o domo fica
    await r.durante(0.35, (k) => {
      this.girar(1, new THREE.Euler(0, 0, suave(k) * Math.PI));
      this.mao(1, this.pegaDe(1, sobreArroz().add(v3(0, -0.04 * k, 0)), PONTA.forminha));
    });
    this.som('virar');
    arrozDentro.visible = false;
    await this.aparecer(r, arroz, 0.25, 0.8);
    await this.levarPonta(r, 1, PONTA.forminha, () => sobreArroz().add(v3(0, 0.06, 0)), 0.2);
    this.girar(1, DE_PE);
    await this.largar(r, 1, f);
    // o FEIJÃO
    this.passo = 'feijao';
    await this.ir(r, this.posto('feijao'), 1.1, 0.14);
    await this.daCuba(r, this.ferramentas.colherDeServir, PONTA.colherDeServir, LB.cubas.feijao, prato, 'feijao', P.feijaoPreto, true);
    // a CARNE desfiada
    this.passo = 'carne';
    await this.ir(r, this.posto('carne'), 1.1, 0.14);
    await this.daCuba(r, this.ferramentas.pegador, PONTA.pegador, LB.cubas.carne, prato, 'carne', P.carneMechada, false);
    await this.talher(r, prato);
  }

  /** uma porção da cuba para o prato: a ferramenta pega, leva e solta (a colher vira) */
  private async daCuba(
    r: Roteiro, ferr: THREE.Object3D, ponta: THREE.Vector3, cubaX: number, prato: THREE.Object3D,
    parte: string, cor: number, vira: boolean,
  ): Promise<void> {
    await this.pegar(r, 1, ferr, true, DE_PE);
    const cuba = this.noBalcao(cubaX, -0.1);
    this.liz.olharPara(cuba);
    await this.levarPonta(r, 1, ponta, cuba.clone().add(v3(0, 0.04, 0)), 0.32, 0.05);
    await r.durante(0.3, (k) => this.mao(1, this.pegaDe(1, cuba.clone().add(v3(0, 0.04 - sino(k) * 0.04, 0)), ponta)));
    const bolo = this.porcao(ferr, cor, ponta, parte, 0.024);
    const alvo = prato.getObjectByName(parte)!;
    const destino = (): THREE.Vector3 => this.noPrato(prato, alvo.position.x, 0.09, alvo.position.z);
    this.liz.olharPara(destino());
    await this.levarPonta(r, 1, ponta, destino, 0.4, 0.07);
    if (vira) await r.durante(0.2, (k) => this.girar(1, new THREE.Euler(0, 0, k * 1.3)));
    bolo.visible = false;
    this.som('pingo');
    await this.aparecer(r, alvo, 0.28, 0.35);
    this.girar(1, DE_PE);
    await this.largar(r, 1, ferr);
  }

  // ============================================================= FORORO

  /**
   * O FORORO: a caneca no passe; no fogo, a colher de pau dá voltas no
   * creme e o vapor sobe; ela pega a panelinha pelo cabo, leva por cima da
   * caneca e inclina — o creme cai num fio grosso e a caneca enche; a
   * pitada de tostadinho, o polvilhador sacudindo a canela, e a colher.
   */
  private async montarFororo(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    const LB = LUGARES_DO_BALCAO;
    await this.loucaDaPilha(r, prato, true);
    this.passo = 'mexer';
    await this.ir(r, this.posto('panelinha'), 1.1, 0.14);
    await this.acender(r, 1, 0, true);
    await this.mexerAPanelinha(r, 2);
    // DESPEJA: a panelinha pelo cabo, por cima da caneca, inclinada
    this.passo = 'despejar';
    await this.pegar(r, 1, this.panelinha, false);
    this.chamas[0] = false;
    this.som('chamaApaga');
    const creme = prato.getObjectByName('creme')!;
    const liso = creme.getObjectByName('creme-liso')!;
    const comCanela = creme.getObjectByName('creme-com-canela')!;
    liso.visible = true;
    comCanela.visible = false;
    const local = this.liz.group.worldToLocal(this.liz.pataNoMundo(1));
    this.alvo[1] = null;
    this.liz.maoPara(1, local.add(v3(0, 0.08, 0)), true);
    await r.durante(0.25);
    await this.ir(r, { x: this.TX + LB.passe.x - 0.32, z: this.ZP + 0.02 }, 0.8, 0.2);
    const boca = (): THREE.Vector3 => this.panelinha.localToWorld(PANELINHA.centro.clone().add(v3(0.1, 0.11, 0)));
    const caneca = (): THREE.Vector3 => this.noPrato(prato, 0, 0.09, 0);
    // a pata leva a boca da panelinha para cima da caneca
    const desloc = this.liz.pataNoMundo(1).sub(boca());
    this.liz.olharPara(caneca());
    await this.levar(r, 1, () => caneca().add(v3(-0.01, 0.11, 0)).add(desloc), 0.5, 0.05);
    this.som('despejar');
    const q0 = this.giro[1].clone();
    await r.durante(1.3, (k) => {
      const incl = sino(Math.min(1, k * 1.05)) * 1.0;
      this.liz.orientarMao(1, new THREE.Euler(0, 0, -incl));
      this.giro[1].copy(q0).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -incl)));
      if (k > 0.2 && k < 0.85) {
        this.fio.mesh.visible = true;
        this.fio.pintar(P.fororoCreme);
        this.fio.entre(boca(), caneca().add(v3(0, -0.02, 0)), 0.012);
      } else this.fio.mesh.visible = false;
      const nivel = suave(Math.min(1, Math.max(0, (k - 0.2) / 0.6)));
      creme.visible = nivel > 0.02;
      creme.position.y = -0.05 * (1 - nivel);
      const s = 0.8 + 0.2 * nivel;
      creme.scale.set(s, 1, s);
    });
    this.fio.mesh.visible = false;
    creme.position.y = 0;
    creme.scale.set(1, 1, 1);
    this.girar(1, null);
    await this.ir(r, this.posto('panelinha'), 0.8, 0.14);
    await this.largar(r, 1, this.panelinha);
    // os TOSTADINHOS e a CANELA, no passe
    this.passo = 'canela';
    await this.ir(r, { x: this.TX + LB.passe.x, z: this.ZP + 0.02 }, 1.0, 0.25);
    await this.pitada(r, 1, v3(this.TX + LB.tostadinho, 0.96, this.BZ + LB.tras), prato, P.fororoTostado);
    await this.aparecer(r, prato.getObjectByName('tostadinhos'), 0.22, 0.5);
    await this.polvilhar(r, this.ferramentas.polvilhador, prato, () => {
      liso.visible = false;
      comCanela.visible = true;
    });
    await this.talher(r, prato);
    await this.pratoDoPasse(r, prato);
  }

  /** o polvilhador de cabeça para baixo, sacudindo por cima do prato */
  private async polvilhar(r: Roteiro, pol: THREE.Object3D, prato: THREE.Object3D, quandoCai: () => void): Promise<void> {
    await this.pegar(r, 1, pol, true, DE_PE);
    const sobre = (): THREE.Vector3 => this.noPrato(prato, 0, 0.2, 0);
    this.liz.olharPara(sobre());
    await this.levar(r, 1, sobre, 0.35, 0.06);
    await r.durante(0.25, (k) => this.girar(1, new THREE.Euler(0, 0, suave(k) * Math.PI)));
    const chao = this.noPrato(prato, 0, 0.06, 0).y;
    let caiu = false;
    await r.durante(1.0, (k, dt) => {
      // quatro sacudidas: a pata desce e sobe rápido
      const s = Math.abs(Math.sin(k * Math.PI * 4));
      this.mao(1, sobre().add(v3(0, -s * 0.03, 0)));
      if (Math.random() < dt * 40) this.farelos.soltar(pol.localToWorld(PONTA.polvilhador.clone()), P.canela, 1, chao, 0.015, 0, 0.004);
      if (!caiu && k > 0.35) {
        caiu = true;
        quandoCai();
      }
    });
    this.som('sacudida');
    await r.durante(0.2, (k) => this.girar(1, new THREE.Euler(0, 0, (1 - suave(k)) * Math.PI)));
    this.girar(1, DE_PE);
    await this.largar(r, 1, pol);
  }

  // ======================================================== TRES LECHES

  /**
   * A TORTA TRES LECHES: o prato na pata; no refratário, a espátula risca
   * os dois cortes do quadrado, entra por baixo e levanta o pedaço (o leite
   * fica brilhando no buraco); o pedaço pousa no prato; a jarrinha derrama
   * os três leites em volta; três morangos do potinho, e a canela.
   */
  private async montarTresLeches(r: Roteiro, prato: THREE.Object3D): Promise<void> {
    await this.loucaDaPilha(r, prato, false);
    this.passo = 'cortar';
    await this.ir(r, this.posto('refratario'), 1.25, 0.12);
    await this.pratoPara(r, true);
    const esp = this.ferramentas.espatulaDoBolo;
    const ref = this.refratario;
    await this.pegar(r, 1, esp, true, INCLINADA(0.5));
    const pedaco = ref.pedacoNoMundo();
    this.liz.olharPara(pedaco);
    // os dois riscos: um em pé (o lado de dentro) e um deitado (o de trás)
    const lado = 0.104 / 2;
    const fundo = 0.107 / 2;
    const riscar = async (de: THREE.Vector3, ate: THREE.Vector3): Promise<void> => {
      await this.levarPonta(r, 1, PONTA.espatula, de, 0.25, 0.04);
      await r.durante(0.35, (k) => this.mao(1, this.pegaDe(1, de.clone().lerp(ate, k), PONTA.espatula)));
    };
    await riscar(pedaco.clone().add(v3(-lado, 0, fundo)), pedaco.clone().add(v3(-lado, -0.02, -fundo)));
    ref.riscar(1);
    this.som('virar');
    await riscar(pedaco.clone().add(v3(-lado, 0, fundo)), pedaco.clone().add(v3(lado, -0.02, fundo)));
    ref.riscar(2);
    // entra por baixo e levanta
    this.girar(1, INCLINADA(0.15));
    await this.levarPonta(r, 1, PONTA.espatula, pedaco.clone().add(v3(0, -0.06, -0.04)), 0.3, 0.03);
    await this.levarPonta(r, 1, PONTA.espatula, pedaco.clone().add(v3(0, -0.06, 0)), 0.25);
    const mao = this.liz.maos[1];
    mao.attach(ref.pedaco);
    await this.levarPonta(r, 1, PONTA.espatula, pedaco.clone().add(v3(0, 0.03, -0.02)), 0.3);
    const bolo = prato.getObjectByName('bolo')!;
    const sobre = (): THREE.Vector3 => this.noPrato(prato, 0, 0.075, 0);
    this.liz.olharPara(sobre());
    await this.levarPonta(r, 1, PONTA.espatula, sobre, 0.5, 0.07);
    ref.pedaco.visible = false;
    this.som('pingo');
    await this.aparecer(r, bolo, 0.25, 0.85);
    this.girar(1, INCLINADA(0.5));
    await this.largar(r, 1, esp);
    // os TRÊS LEITES da jarrinha, em volta do bolo
    this.passo = 'leite';
    await this.ir(r, this.posto('jarrinha'), 1.0, 0.12);
    const jar = this.ferramentas.jarrinha;
    await this.pegar(r, 1, jar, true, DE_PE);
    const leite = prato.getObjectByName('leite')!;
    const bico = (): THREE.Vector3 => jar.localToWorld(v3(0, 0.04, 0.115));
    const ladoDoBolo = (): THREE.Vector3 => this.noPrato(prato, 0.03, 0.18, 0.02);
    this.liz.olharPara(this.noPrato(prato));
    await this.levar(r, 1, ladoDoBolo, 0.4, 0.06);
    this.som('despejar');
    await r.durante(1.1, (k) => {
      const incl = sino(Math.min(1, k * 1.05)) * 1.05;
      this.girar(1, INCLINADA(incl));
      // o bico dá a volta no bolo
      const a = k * Math.PI * 1.2;
      this.mao(1, ladoDoBolo().add(v3(Math.cos(a) * 0.03, 0, Math.sin(a) * 0.03)));
      if (k > 0.15 && k < 0.85) {
        this.fio.mesh.visible = true;
        this.fio.pintar(P.tresLechesLeite);
        const b = bico();
        this.fio.entre(b, v3(b.x, this.noPrato(prato, 0, 0.018, 0).y, b.z), 0.005);
      } else this.fio.mesh.visible = false;
      if (k > 0.2) {
        leite.visible = true;
        const s = 0.3 + 0.7 * suave(Math.min(1, (k - 0.2) / 0.65));
        leite.scale.set(s, 1, s);
      }
    });
    this.fio.mesh.visible = false;
    leite.scale.set(1, 1, 1);
    this.girar(1, DE_PE);
    await this.largar(r, 1, jar);
    // os MORANGOS, um de cada vez
    this.passo = 'morangos';
    const LD = LUGARES_DA_BANCADA;
    const pote = v3(this.BX + LD.morangos.x, BANCADA.topo + 0.05, this.BZ + LD.morangos.z);
    for (let i = 0; i < 3; i++) {
      const alvo = prato.getObjectByName(`morango-${i}`)!;
      this.liz.olharPara(pote);
      await this.levar(r, 1, pote.clone().add(v3(0, 0.06, -0.02)), 0.3, 0.05);
      const m = morangoInteiro();
      m.position.set(0, -0.055, 0.02);
      this.liz.maos[1].add(m);
      const destino = (): THREE.Vector3 => this.noPrato(prato, alvo.position.x, 0.16, alvo.position.z - 0.02);
      this.liz.olharPara(destino());
      await this.levar(r, 1, destino, 0.35, 0.05);
      m.removeFromParent();
      this.som('pingo');
      await this.aparecer(r, alvo, 0.2, 0.4);
    }
    // a CANELA por cima
    this.passo = 'canela';
    await this.polvilhar(r, this.ferramentas.polvilhadorDoBolo, prato, () => {
      void this.aparecer(r, prato.getObjectByName('canela'), 0.4, 1).catch(() => undefined);
    });
    await this.talher(r, prato);
  }

  /**
   * UMA PORÇÃO na ponta da ferramenta (o novelo de espaguete no pegador, a
   * colherada de feijão, a almôndega, a tajada na espátula): uma bolota da
   * cor da comida, filha da ferramenta. A cena some com ela quando a comida
   * aparece no prato.
   */
  private porcao(ferr: THREE.Object3D, cor: number, ponta: THREE.Vector3, nome: string, raio = 0.025): THREE.Object3D {
    const velha = ferr.getObjectByName(`porcao-${nome}`);
    if (velha) {
      velha.visible = true;
      return velha;
    }
    const m = nome === 'tajada'
      ? new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.08, 4, 8).rotateZ(Math.PI / 2), toon(cor))
      : new THREE.Mesh(new THREE.IcosahedronGeometry(raio, 1), toon(cor));
    m.name = `porcao-${nome}`;
    m.position.copy(ponta).add(v3(0, nome === 'novelo' ? -0.01 : 0.012, 0));
    if (nome !== 'tajada' && nome !== 'almondega') m.scale.set(1, 0.6, 1);
    ferr.add(m);
    return m;
  }
}

