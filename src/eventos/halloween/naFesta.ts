import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { SomNome } from '../../audio/efeitos';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { fundir } from '../../world/fundir';
import type { Bicho } from '../../entities/bichos/Bicho';
import { Gina } from '../../entities/bichos/Gina';
import { Capy } from '../../entities/bichos/Capy';
import { Noel } from '../../entities/bichos/Noel';
import { Josefina } from '../../entities/bichos/Josefina';
import { Gatito } from '../../entities/bichos/Gatito';
import { Flynn } from '../../entities/bichos/Flynn';
import { Walter } from '../../entities/bichos/Walter';
import type { Mano } from '../../entities/bichos/Mano';
import type { Cookie } from '../../entities/bichos/Cookie';
import type { JeanLuc } from '../../entities/bichos/JeanLuc';
import type { CoelhaDaTorcida } from '../../entities/bichos/CoelhaDaTorcida';
import type { LoteDeAboboras } from '../../world/halloween/abobora';
import type { EnfeitesDePendurar } from '../../world/halloween/pendurados';
import { CarrinhoDePocoes, PocaoBorbulhando, cavaleteDePocoes } from '../../world/halloween/carrinhoDePocoes';
import { BaciaDeMacas, canteiroDeAboboras } from '../../world/halloween/pecasDaFesta';
import type { BarracaDoWalter } from '../../world/halloween/barracaDoWalter';
import { PALETTE as P } from '../../palette';
import { ARI, RENAN } from '../../characters/cast';
import { fantasiarQuemEstaAqui } from './fantasiados';
import { ausentarNaCena, type RecadoNoPosto } from './ausentes';
import { RECADOS_DO_PARQUE } from './recados';
import type { PecasDoParque } from './noParque';
import { FLAG_DO_ONIBUS } from './fase';

/*
 * OS POSTOS DA FESTA (`docs/HALLOWEEN.md`, §2.4.1, C): na noite da festa
 * todo mundo está no parque, fantasiado, cada um no seu canto — o Mano na
 * sorveteria, o Cookie na bilheteria e o Jean-Luc no lago, como sempre; e os
 * que vieram de longe: a Gina no ponto de ônibus, o Capy na beira do lago com
 * a bacia de maçãs, o Noel no carrinho de poções da praça da roda (o
 * caldeirão grande borbulhando verde ao lado), a Josefina no canteiro de
 * abóboras do gramado, o Gatito no piquenique das coelhinhas e o Flynn no
 * campinho de frisbee. A Estella fica na boutique (de aranha), e os desafios
 * da arena estão suspensos (estão todos na festa).
 *
 * A CONVERSA DE FESTA É UMA TOMADA DE CENA (pedido do Renan: "ao falar com
 * cada um, a câmera dá um zoom nos personagens, para ver melhor as
 * fantasias"). A isométrica dá lugar a uma câmera de perspectiva que nasce
 * onde a isométrica estava (o mesmo enquadramento, para não haver corte) e
 * desliza até um três-quartos de frente de quem fala, na altura do peito
 * dele e na distância que a altura dele pede (a Gina de longe, o Mano de
 * perto). Quem fala vira para a dupla, a dupla vira para ele, e no fim a
 * câmera desliza de volta e devolve a isométrica. O relógio do deslize é o
 * do jogo (`w.onUpdate`), e não o `g.wait` de parede.
 *
 * As falas são RASCUNHOS (o Renan troca): cada um no jeito dele, a primeira
 * vez com a apresentação da fantasia e depois uma fala curta sorteada.
 *
 * É CAMADA: os bichos novos são montados aqui, com as classes de sempre, e o
 * que já mora no parque (o Mano, o Cookie, o Jean-Luc, as coelhinhas) é
 * achado pela etiqueta. Sem o `?halloween` nada disto existe.
 */

/** a câmera de sempre vem de `+X/+Z`: virada para ela, a frente aparece */
const PARA_A_CAMERA = Math.PI / 4;

/** onde fica cada posto novo (o mundo do parque) */
const CARRINHO = { x: -4.6, z: -16.3, giro: 0.5 };
const CANTEIRO = { x: -18.3, z: -17.7, giro: 0.3 };
const GINA = { x: 34.5, z: 23.6 };
const GATITO = { x: -22.35, z: -26.35 };
const FLYNN = { x: 10.5, z: 2.0 };

/** um ponto de cena: de onde a câmera olha e para onde */
interface Tomada {
  de: THREE.Vector3;
  para: THREE.Vector3;
}

interface Deslize {
  de: Tomada;
  ate: Tomada;
  dura: number;
  t: number;
  fim: () => void;
}

type Fala = readonly [string, string];

/** quem fala na festa: o bicho, o nome na caixa de fala e o que ele diz */
interface Convidado {
  bicho: Bicho;
  nome: string;
  artigo: 'o' | 'a';
  icone: string;
  /** sentado no chão (as coelhinhas): não vira, e a câmera vem pela frente dele */
  sentado?: boolean;
  /**
   * quem a cena leva de um lado para o outro (o Cookie na bilheteria): não sai
   * do serviço — a conversa só o segura parado no lugar enquanto dura
   */
  patrulha?: boolean;
  /** de que lado da frente dele a dupla fica (-1 é o padrão; o Noel tem o carrinho do outro lado) */
  ladoDaDupla?: 1 | -1;
  /** a conversa: a primeira vez, e depois uma das curtas (`vez` conta as conversas) */
  falas: (api: GameAPI, primeira: boolean, vez: number) => readonly Fala[];
  /** o som e o gesto de quando a dupla chega, e o de quando a conversa acaba */
  som?: SomNome;
  gesto?: () => void;
  aoFim?: () => void;
  /** um ponto da cena que já existe e continua depois da conversa (o bilhete do Cookie) */
  emenda?: string;
  raio?: number;
  /**
   * a tomada de quem trabalha atrás de um balcão (o Walter na barraca): a
   * frente é a do balcão, e não a da câmera de sempre (girada pelo Q/R, ela
   * levaria a câmera para trás da barraca); a dupla fica onde a ficha manda
   * (na frente do balcão, e não colada nele) e a câmera vem desta distância
   */
  frente?: number;
  dupla?: () => readonly [{ x: number; z: number }, { x: number; z: number }];
  distancia?: number;
  /** o ponto "Falar com…" só vale enquanto isto disser que sim (o Walter fora da barraca) */
  presente?: () => boolean;
}

/** a apresentação da fantasia na primeira vez, e depois uma fala curta de cada vez */
const fixas = (primeira: readonly Fala[], depois: ReadonlyArray<readonly Fala[]>) =>
  (_api: GameAPI, eh: boolean, vez: number): readonly Fala[] => (eh ? primeira : depois[vez % depois.length]);

export interface KitDaFesta {
  aboboras: LoteDeAboboras;
  pendurados: EnfeitesDePendurar;
  /** a barraquinha de cachorro-quente do Walter, onde ela está, e os dois recados pendurados nela */
  barraca: {
    peca: BarracaDoWalter;
    x: number;
    z: number;
    giro: number;
    recados: { onibus: THREE.Object3D; voltaJa: THREE.Object3D } | null;
  };
}

export function montarPostosDaFesta(w: WorldBuilder, pecas: PecasDoParque, kit: KitDaFesta): void {
  const g0 = w.game;
  const A = ARI.name;
  const R = RENAN.name;

  /** os bichos que o parque já monta, pela etiqueta */
  const bichoDa = <T extends Bicho>(peca: string): T | null => {
    let achado: T | null = null;
    w.root.traverse((o) => {
      if (!achado && o.userData?.peca === peca && o.userData.bicho) achado = o.userData.bicho as T;
    });
    return achado;
  };

  // ------------------------------------------------ a Estella e os desafios
  // a Estella está na boutique (de aranha), e a arena está de folga: os
  // desafiantes estão todos na festa
  const recados: RecadoNoPosto[] = [];
  w.root.traverse((q) => {
    if (q.userData?.peca !== 'quadro-de-inscricoes' || q.parent?.userData?.peca) return;
    const frente = { x: Math.sin(q.rotation.y), z: Math.cos(q.rotation.y) };
    recados.push({
      recados: [RECADOS_DO_PARQUE.desafios], autor: 'Recado', modo: 'parede', y: 1.02, giro: q.rotation.y,
      x: q.position.x + frente.x * 0.09, z: q.position.z + frente.z * 0.09,
      lerEm: { x: q.position.x + frente.x * 1.1, z: q.position.z + frente.z * 1.1 },
    });
  });
  ausentarNaCena(w, {
    bichos: pecas.ausentes.filter((a) => a.group.userData?.peca === 'estella'),
    interacoes: ['parque:estella', 'parque:xadrez', 'parque:inscricoes', 'parque:jean-luc', 'parque:luna', 'parque:sol', 'parque:estrella'],
    recados,
  });

  // ------------------------------------------------------- as peças novas
  const pos = (x: number, z: number, giro: number, lx: number, lz: number): { x: number; z: number } => ({
    x: x + Math.cos(giro) * lx + Math.sin(giro) * lz,
    z: z - Math.sin(giro) * lx + Math.cos(giro) * lz,
  });

  // o carrinho de poções do Noel, na praça da roda, e a lousa de cavalete
  const carrinho = new CarrinhoDePocoes();
  carrinho.group.position.set(CARRINHO.x, 0, CARRINHO.z);
  carrinho.group.rotation.y = CARRINHO.giro;
  w.add(fundir(carrinho.group));
  {
    const c = pos(CARRINHO.x, CARRINHO.z, CARRINHO.giro, 0, -0.12);
    w.blockBox(c.x, c.z, 0.95, 0.55, -CARRINHO.giro);
  }
  carrinho.ganchos.forEach((p, i) => {
    const m = pos(CARRINHO.x, CARRINHO.z, CARRINHO.giro, p.x, p.z);
    kit.pendurados.lanterna(m.x, p.y, m.z, i ? P.lanternaRoxa : P.lanternaLaranja, CARRINHO.giro);
  });
  {
    const c = pos(CARRINHO.x, CARRINHO.z, CARRINHO.giro, -1.25, 0.95);
    const lousa = fundir(cavaleteDePocoes());
    lousa.position.set(c.x, 0, c.z);
    lousa.rotation.y = CARRINHO.giro + 0.35;
    w.add(lousa);
    w.blockCircle(c.x, c.z, 0.32);
  }
  // o caldeirão grande da praça, borbulhando verde
  const pocao = new PocaoBorbulhando(0.31, P.pocaoVerde, 0.55);
  pocao.group.position.set(-3.6, 0.55, -13.9);
  w.add(pocao.group);

  // o canteiro de abóboras da Josefina, no gramado
  const canteiro = canteiroDeAboboras();
  canteiro.group.position.set(CANTEIRO.x, 0, CANTEIRO.z);
  canteiro.group.rotation.y = CANTEIRO.giro;
  w.add(fundir(canteiro.group));
  w.blockBox(CANTEIRO.x, CANTEIRO.z, canteiro.meio.x, canteiro.meio.z, -CANTEIRO.giro);
  for (const a of canteiro.aboboras) {
    const m = pos(CANTEIRO.x, CANTEIRO.z, CANTEIRO.giro, a.x, a.z);
    kit.aboboras.por({ ...a, x: m.x, z: m.z, giro: (a.giro ?? 0) + CANTEIRO.giro });
  }

  // a bacia de maçãs do Capy, na beira do lago, do lado do trapiche
  const bacia = new BaciaDeMacas();
  const BACIA = pecas.doTrapiche(2.75, -1.6);
  bacia.group.position.set(BACIA.x, 0, BACIA.z);
  bacia.group.rotation.y = PARA_A_CAMERA;
  w.add(fundir(bacia.group));
  w.blockCircle(BACIA.x, BACIA.z, 0.5);

  // ---------------------------------------------------- quem veio de longe
  /** uma área de posto: o bicho fica, respira e olha em volta (ver a skill de bicho) */
  const posto = (x: number, z: number, folga = 0.12) => ({ minX: x - folga, maxX: x + folga, minZ: z - folga, maxZ: z + folga });
  const somDe = (bicho: Bicho, som: SomNome): void => { bicho.aoSoar = () => g0.som(som); };

  const gina = new Gina(posto(GINA.x, GINA.z));
  gina.group.rotation.y = PARA_A_CAMERA - 0.4;
  somDe(gina, 'apito');

  const CAPY = pecas.doTrapiche(1.6, -0.75);
  const capy = new Capy(posto(CAPY.x, CAPY.z));
  capy.group.rotation.y = PARA_A_CAMERA;
  somDe(capy, 'apito');

  // o Noel não para quieto: anda numa faixa curta do lado do carrinho
  const noelEm = pos(CARRINHO.x, CARRINHO.z, CARRINHO.giro, carrinho.ladoDoNoel.x, carrinho.ladoDoNoel.z);
  const noel = new Noel({ minX: noelEm.x - 0.35, maxX: noelEm.x + 0.35, minZ: noelEm.z - 0.6, maxZ: noelEm.z + 0.6 });
  somDe(noel, 'gluglu');

  const josefinaEm = pos(CANTEIRO.x, CANTEIRO.z, CANTEIRO.giro, 1.55, 0.75);
  const josefina = new Josefina(posto(josefinaEm.x, josefinaEm.z, 0.2));
  josefina.group.rotation.y = PARA_A_CAMERA;
  somDe(josefina, 'cantarolar');

  const gatito = new Gatito(posto(GATITO.x, GATITO.z));
  gatito.group.rotation.y = PARA_A_CAMERA;
  somDe(gatito, 'miado');

  const flynn = new Flynn(posto(FLYNN.x, FLYNN.z, 0.15));
  flynn.group.rotation.y = PARA_A_CAMERA;

  const novos: Bicho[] = [gina, capy, noel, josefina, gatito, flynn];
  for (const b of novos) {
    w.add(b.group);
    // o colisor de quem fica no posto (o Noel anda: fica sem, como no clube)
    if (b !== noel) w.blockCircle(b.x, b.z, b === gina ? 0.45 : 0.32);
  }
  // ------------------------------------------------- o Walter na barraquinha
  /*
   * O WALTER NA BARRACA (pedido do Renan): ele chega com o ônibus e fica na
   * barraquinha de cachorro-quente, em cima do caixote atrás do balcão — ele
   * tem 61 cm, e o tampo, 1,02 m. E DE VEZ EM QUANDO ele larga a barraca:
   * pula do caixote, sai pela passagem do fundo da lateral, desce do estrado
   * e vai rente ao tapume da praça até atrás da roda gigante, onde some; um
   * tempo depois volta pelo mesmo caminho e sobe no caixote. É a primeira
   * dica do final (§7: atrás da roda, onde a cerca fecha o mato, fica o
   * portão da Casinha da Abóbora). Fora da barraca, o "volto já" fica
   * pendurado no toldo; e na primeira vez que a dupla o vê indo, comenta.
   *
   * O caminho é da cena (o `irPara` de bicho anda reto e não conhece a
   * praça): entre o tapume (`x = −11`) e o canteiro de flores redondo, e
   * por fora do disco da roda. Os pulos também — o corpo vai pelo ar num
   * arco, e o Walter só faz a pose (`walter.salto`).
   */
  const BW = kit.barraca;
  const daBarraca = (v: THREE.Vector3): THREE.Vector3 => {
    const m = pos(BW.x, BW.z, BW.giro, v.x, v.z);
    return new THREE.Vector3(m.x, v.y, m.z);
  };
  const postoDoWalter = daBarraca(BW.peca.posto);
  const walter = new Walter(posto(postoDoWalter.x, postoDoWalter.z, 0));
  w.add(walter.group);
  somDe(walter, 'latido');
  /** um ponto bem na frente do balcão: é para lá que ele olha da barraca */
  const frenteDoBalcao = daBarraca(new THREE.Vector3(0, 0, 4));

  interface Etapa { ate: THREE.Vector3; pulo: boolean }
  const anda = (ate: THREE.Vector3): Etapa => ({ ate, pulo: false });
  const pula = (ate: THREE.Vector3): Etapa => ({ ate, pulo: true });
  const [doCaixote, naPassagem, noChao] = BW.peca.saida.map(daBarraca);
  const ATE_A_RODA = [[-9.35, -12.0], [-10.2, -15.2], [-10.2, -24.0], [-9.2, -30.0], [-7.8, -33.5]]
    .map(([x, z]) => new THREE.Vector3(x, 0, z));
  const IDA: Etapa[] = [pula(doCaixote), anda(naPassagem), pula(noChao), ...ATE_A_RODA.map(anda)];
  const VOLTA: Etapa[] = [
    ...ATE_A_RODA.slice(0, -1).reverse().map(anda),
    anda(noChao), pula(naPassagem), anda(doCaixote), pula(postoDoWalter),
  ];

  type Rumo = 'fora' | 'posto' | 'indo' | 'sumido' | 'voltando';
  let rumo: Rumo = 'fora';
  let etapas: Etapa[] = [];
  let pulo: { de: THREE.Vector3; ate: THREE.Vector3; t: number; dura: number; arco: number } | null = null;
  // o relógio das idas: a primeira logo, as outras espaçadas (sorteio com semente própria: o do parque não anda)
  let semente = 20261031;
  const sortear = (): number => (semente = (semente * 16807) % 2147483647) / 2147483647;
  let ateSair = 22 + sortear() * 10;
  let ateVoltar = 0;

  /** ele no caixote, olhando para o balcão (onde o ônibus o deixa, e onde a volta termina) */
  const naBarraca = (): void => {
    walter.entrarEmServico();
    walter.group.position.copy(postoDoWalter);
    walter.group.rotation.y = BW.giro;
    walter.encarar(frenteDoBalcao.x, frenteDoBalcao.z);
    walter.group.visible = true;
    walter.salto = 0;
    rumo = 'posto';
  };
  const partir = (lista: Etapa[], novo: Rumo): void => {
    walter.entrarEmServico();
    etapas = [...lista];
    rumo = novo;
    pulo = null;
  };
  if (g0.flag(FLAG_DO_ONIBUS)) naBarraca();
  else walter.group.visible = false;

  /** o comentário da dupla, uma vez por save: a primeira vez que o vê indo */
  const VIU_O_WALTER = 'halloween:viu:walter-indo';
  let comentando = false;
  const antesDeQuemJoga = { x: NaN, z: NaN };

  /** o teste acelera o relógio dele (o navegador do teste roda o jogo a ~1/6 da velocidade) */
  let ritmo = 1;
  w.onUpdate((dtDoJogo) => {
    const dt = dtDoJogo * ritmo;
    walter.update(dt);
    // o recado do toldo: o do ônibus antes de ele chegar, o "volto já" com ele fora
    if (BW.recados) {
      BW.recados.onibus.visible = rumo === 'fora';
      BW.recados.voltaJa.visible = rumo === 'indo' || rumo === 'sumido' || rumo === 'voltando';
    }
    if (rumo === 'posto') {
      // não sai no meio de uma conversa (nem a dele nem a de ninguém)
      if (!falando) ateSair -= dt;
      if (ateSair <= 0) partir(IDA, 'indo');
      return;
    }
    if (rumo === 'sumido') {
      ateVoltar -= dt;
      if (ateVoltar <= 0) {
        walter.group.visible = true;
        partir(VOLTA, 'voltando');
      }
      return;
    }
    if (rumo !== 'indo' && rumo !== 'voltando') return;

    // a dupla repara (uma vez): quem joga andando perto enquanto ele vai
    const p = g0.playerPosition();
    const andou = Math.hypot(p.x - antesDeQuemJoga.x, p.z - antesDeQuemJoga.z) > 0.004;
    antesDeQuemJoga.x = p.x;
    antesDeQuemJoga.z = p.z;
    if (rumo === 'indo' && andou && !falando && !comentando && !g0.flag(VIU_O_WALTER) && Math.hypot(p.x - walter.x, p.z - walter.z) < 12) {
      comentando = true;
      g0.setFlag(VIU_O_WALTER);
      void (async () => {
        await g0.say(['Pra onde o Walter tá indo?'], g0.companionName());
        await g0.say(['Lá pra trás da roda… e largou a barraca sozinha.'], g0.playerName());
        await g0.say(['Ele deixou um bilhete. Deve voltar logo.'], g0.companionName());
        comentando = false;
      })();
    }

    // o pulo: o corpo num arco, e a pose dele
    if (pulo) {
      pulo.t = Math.min(1, pulo.t + dt / pulo.dura);
      const k = pulo.t;
      walter.group.position.lerpVectors(pulo.de, pulo.ate, k);
      walter.group.position.y += pulo.arco * 4 * k * (1 - k);
      walter.salto = Math.max(0.001, k);
      if (k >= 1) {
        walter.group.position.copy(pulo.ate);
        walter.salto = 0;
        pulo = null;
      }
      return;
    }
    const etapa = etapas[0];
    if (!etapa) {
      if (rumo === 'indo') {
        // atrás da roda: some (ele volta daqui a pouco, pelo mesmo caminho)
        walter.group.visible = false;
        rumo = 'sumido';
        ateVoltar = 12 + sortear() * 8;
      } else {
        naBarraca();
        ateSair = 45 + sortear() * 25;
      }
      return;
    }
    if (etapa.pulo) {
      etapas.shift();
      const de = walter.group.position.clone();
      const sobe = Math.abs(etapa.ate.y - de.y);
      const longe = Math.hypot(etapa.ate.x - de.x, etapa.ate.z - de.z);
      pulo = { de, ate: etapa.ate.clone(), t: 0, dura: 0.38 + sobe * 0.25 + longe * 0.2, arco: 0.15 + sobe * 0.3 };
      walter.group.rotation.y = Math.atan2(etapa.ate.x - de.x, etapa.ate.z - de.z);
      return;
    }
    walter.group.position.y = etapa.ate.y;
    walter.seguir(etapa.ate.x, etapa.ate.z);
    if (Math.hypot(etapa.ate.x - walter.x, etapa.ate.z - walter.z) < 0.1) etapas.shift();
  });
  // para o teste: em que pé ele está, e mandar sair (ou chegar) sem esperar o relógio
  walter.group.userData.naFesta = {
    rumo: () => rumo,
    sairAgora: () => { if (rumo === 'posto') ateSair = 0; },
    voltarAgora: () => { if (rumo === 'sumido') ateVoltar = 0; },
    chegar: naBarraca,
    ritmo: (vezes: number) => { ritmo = vezes; },
  };

  // todo mundo fantasiado (a mesma chamada que veste o Mano, o Cookie e os patos)
  fantasiarQuemEstaAqui(w);

  // ---------------------------------------------- a tomada de cena da conversa
  let deslize: Deslize | null = null;
  const camera: Tomada = { de: new THREE.Vector3(), para: new THREE.Vector3() };
  const suave = (t: number): number => t * t * (3 - 2 * t);
  const deslizar = (ate: Tomada, dura: number): Promise<void> => new Promise((fim) => {
    deslize?.fim();
    deslize = { de: { de: camera.de.clone(), para: camera.para.clone() }, ate, dura, t: 0, fim };
  });

  /** onde a isométrica está agora (para a de perspectiva nascer no mesmo enquadramento) */
  const tomadaDaIsometrica = (api: GameAPI): Tomada => {
    const p = api.playerPosition();
    const giro = api.anguloDaCamera();
    const inclina = THREE.MathUtils.degToRad(34);
    // a perspectiva de 58° enquadra a mesma altura da isométrica de 13 a ~11,7 m
    const d = 11.7;
    const para = new THREE.Vector3(p.x, 1.0, p.z);
    return {
      para,
      de: new THREE.Vector3(p.x + Math.sin(giro) * Math.cos(inclina) * d, 1.0 + Math.sin(inclina) * d, p.z + Math.cos(giro) * Math.cos(inclina) * d),
    };
  };

  /** gira um vetor do chão (x, z) como o `rotation.y` gira */
  const girar = (v: THREE.Vector2, a: number): THREE.Vector2 =>
    new THREE.Vector2(v.x * Math.cos(a) + v.y * Math.sin(a), -v.x * Math.sin(a) + v.y * Math.cos(a));

  /**
   * A ARRUMAÇÃO DA TOMADA: quem fala olha para o lado da câmera de sempre (a
   * `frente`), a dupla fica de lado para ele — um passo para a esquerda ou
   * para a direita da frente, nunca entre ele e a câmera — e a câmera vem por
   * um três-quartos do outro lado, na altura do peito dele e na distância que
   * a altura dele pede (a Gina de longe, a Josefina de perto). Assim a
   * fantasia aparece inteira, e a dupla entra na beira do quadro, conversando.
   * A primeira versão deixava a dupla onde estava: o parceiro parava entre a
   * câmera e o Noel, e a foto era as costas dele.
   */
  const arrumar = (api: GameAPI, c: Convidado): Tomada => {
    const b = c.bicho;
    const caixa = new THREE.Box3().setFromObject(b.group);
    const alto = Math.max(0.6, caixa.max.y - Math.max(0, caixa.min.y));
    const largo = Math.max(caixa.max.x - caixa.min.x, caixa.max.z - caixa.min.z) / 2;
    const giro = api.anguloDaCamera();
    const giroDaFrente = c.frente ?? (c.sentado ? b.group.rotation.y : giro);
    const frente = new THREE.Vector2(Math.sin(giroDaFrente), Math.cos(giroDaFrente));
    const eu = api.playerPosition();
    // de que lado a dupla fica: o da ficha, ou (sentado) o lado em que ela já está
    let lado = c.ladoDaDupla ?? -1;
    if (c.sentado) {
      const ate = new THREE.Vector2(eu.x - b.x, eu.z - b.z);
      lado = girar(frente, 0.9).dot(ate) > girar(frente, -0.9).dot(ate) ? 1 : -1;
    }
    // a dupla de lado para ele, cada um olhando para ele (sentado no piquenique,
    // um passo mais longe: fora da toalha)
    const perto = Math.min(largo, 0.9) + (c.sentado ? 0.95 : 0.55);
    const pEu = girar(frente, lado * 0.95).multiplyScalar(perto);
    const pEle = girar(frente, lado * 1.45).multiplyScalar(perto + 0.25);
    const [eu1, ele1] = c.dupla?.() ?? [{ x: b.x + pEu.x, z: b.z + pEu.y }, { x: b.x + pEle.x, z: b.z + pEle.y }];
    api.releasePlayer(eu1.x, eu1.z, Math.atan2(b.x - eu1.x, b.z - eu1.z));
    api.releaseCompanion(ele1.x, ele1.z, Math.atan2(b.x - ele1.x, b.z - ele1.z));
    if (!c.sentado) {
      // e ele vira para a frente, um tico na direção da câmera
      const olha = girar(frente, -lado * 0.25).multiplyScalar(3);
      b.encarar(b.x + olha.x, b.z + olha.y);
    }
    const d = c.distancia ?? THREE.MathUtils.clamp(alto * 1.1 + 0.9, 1.9, 5.2);
    const para = new THREE.Vector3(b.x, Math.max(0, caixa.min.y) + alto * 0.58, b.z);
    const deOnde = girar(frente, -lado * 0.42).multiplyScalar(d);
    /*
     * DE CIMA, O ALTO SE ACHATA: com a câmera a 2,6 m olhando para baixo, o
     * Cookie (2,2 m de lençol) saiu da altura da dupla (1,7) na foto, e o
     * Renan reparou. Quem é mais alto que a dupla é filmado quase na altura do
     * olho, levemente de baixo — a diferença de tamanho aparece como é. Os
     * pequenos continuam vistos um pouco de cima (senão as flores do
     * gramado tapam).
     */
    const altura = alto > 1.9 ? Math.min(1.55, para.y + d * 0.1) : para.y + d * 0.36 + 0.12;
    return { para, de: new THREE.Vector3(b.x + deOnde.x, altura, b.z + deOnde.y) };
  };

  /** quem está conversando agora (e onde ele parou, para o patrulheiro) */
  let falando: { c: Convidado; x: number; z: number } | null = null;
  const conversar = async (api: GameAPI, c: Convidado): Promise<void> => {
    if (falando) return;
    const b = c.bicho;
    falando = { c, x: b.x, z: b.z };
    const iso = tomadaDaIsometrica(api);
    if (!c.sentado && !c.patrulha) b.entrarEmServico();
    const perto = arrumar(api, c);
    api.lockPlayer(true);
    api.holdCompanion(b.x, b.z);
    if (c.som) api.som(c.som);
    c.gesto?.();
    camera.de.copy(iso.de);
    camera.para.copy(iso.para);
    api.setCameraOmbro(camera.de, camera.para);
    try {
      await deslizar(perto, 1.1);
      const flag = `halloween:festa-falou:${b.group.userData.peca}`;
      const primeira = !api.flag(flag);
      const falas = c.falas(api, primeira, primeira ? 0 : api.bump(`halloween:festa-conversas:${b.group.userData.peca}`));
      api.setFlag(flag);
      for (const [quem, texto] of falas) await api.say([texto], quem);
      c.aoFim?.();
      // o ponto de sempre continua daqui (o Cookie vende o bilhete), ainda de perto
      const emenda = c.emenda ? w.interactables.find((it) => it.id === c.emenda) : null;
      if (emenda) {
        await emenda.trigger(api);
        api.lockPlayer(true);
      }
      await deslizar(tomadaDaIsometrica(api), 0.85);
    } finally {
      deslize = null;
      api.setCameraOmbro(null);
      api.freeCompanion();
      api.lockPlayer(false);
      if (!c.sentado) b.pararDeEncarar();
      if (!c.sentado && !c.patrulha) b.voltarAPassear();
      falando = null;
    }
  };

  w.onUpdate((dt) => {
    // o patrulheiro fica parado onde a conversa o pegou (a cena o leva de novo a cada quadro)
    if (falando?.c.patrulha) falando.c.bicho.seguir(falando.x, falando.z);
    const d = deslize;
    if (!d) return;
    d.t = Math.min(1, d.t + dt / d.dura);
    const k = suave(d.t);
    camera.de.lerpVectors(d.de.de, d.ate.de, k);
    camera.para.lerpVectors(d.de.para, d.ate.para, k);
    g0.setCameraOmbro(camera.de, camera.para);
    if (d.t >= 1) {
      deslize = null;
      d.fim();
    }
  });

  // ------------------------------------------------------------ as conversas
  const mano = bichoDa<Mano>('mano');
  const cookie = bichoDa<Cookie>('cookie');
  const jeanLuc = bichoDa<JeanLuc>('jean-luc');
  const luna = bichoDa<CoelhaDaTorcida>('luna');
  const sol = bichoDa<CoelhaDaTorcida>('sol');
  const estrella = bichoDa<CoelhaDaTorcida>('estrella');
  /** quem está de capa de vampiro agora (o Mano repara) */
  const deCapa = (api: GameAPI): string | undefined =>
    [ARI, RENAN].find((c) => api.wearables(c.id).some((p) => p?.id === 'capa-de-vampiro'))?.name;

  const convidados: Convidado[] = [];
  if (mano) {
    /*
     * A FALA DO MANO (pedido do Renan): ele repara que não é o único vampiro
     * da festa. Quem ele cita é quem estiver de capa de vampiro na hora — de
     * costume o Ari, mas o guarda-roupa troca. A conversa é montada na hora.
     */
    const M = 'Mano';
    let manoDanca = false;
    const sempre: ReadonlyArray<readonly Fala[]> = [
      [[M, 'Muahaha… boa noite, meus queridos. Hoje o sorvete é de sangue… de morango! Brincadeira.']],
      [[M, 'Gostaram da capa? Eu ensaiei a risada a semana inteira. Muahaha. Ficou boa, né?']],
    ];
    convidados.push({
      bicho: mano, nome: M, artigo: 'o', icone: '🧛', som: 'pinguim', raio: 0.8,
      gesto: () => mano.receberCarinho(),
      falas: (api, _primeira, vez) => {
        const capa = deCapa(api);
        if (capa && !api.flag('halloween:mano-viu-a-capa')) {
          api.setFlag('halloween:mano-viu-a-capa');
          manoDanca = true;
          return [[M, `Ei, ei! ${capa}! Outro vampiro na minha festa?!`], [M, '… A gente nem combinou. Ficou lindo.'], [M, 'Agora somos o clube da capa.']];
        }
        const lista = capa ? [[[M, `O clube da capa está reunido, ${capa}. Muahaha.`]] as readonly Fala[], ...sempre] : sempre;
        return lista[vez % lista.length];
      },
      // ele comemora o clube da capa com a dancinha dele
      aoFim: () => {
        if (manoDanca) mano.dancar(1.8);
        manoDanca = false;
      },
    });
  }
  if (cookie) {
    const C = 'Cookie';
    convidados.push({
      bicho: cookie, nome: C, artigo: 'o', icone: '👻', raio: 2.6, emenda: 'parque:cookie', patrulha: true,
      falas: fixas([
        [C, 'Buu.'],
        [C, '… Desculpa. Foi um buu baixinho, pra ninguém se assustar.'],
        [R, 'Cookie! Você veio de fantasma!'],
        [C, 'O lençol é da minha cama. Fiz os furinhos dos olhos bem devagar, pra não rasgar.'],
        [C, 'E o laço na tromba foi a Estella. Ela disse que fantasma também pode ser chique.'],
      ], [
        [[C, 'Buu. … Ficou assustador? Pode falar a verdade.']],
        [[C, 'A roda gira de noite hoje. Lá de cima dá pra ver as abóboras todas acesas.']],
      ]),
    });
  }
  if (jeanLuc) {
    const J = 'Jean-Luc';
    convidados.push({
      bicho: jeanLuc, nome: J, artigo: 'o', icone: '🎭', som: 'pato', raio: 1.5,
      gesto: () => jeanLuc.comemorar(1.6),
      falas: fixas([
        [J, 'Bonsoir, mes amis. Ce soir, je suis… le Fantôme de l\'Opéra.'],
        [J, 'O Fantasma da Ópera. Mas a ópera fica longe, então hoje eu sou o Fantasma do Lago.'],
        [A, 'A máscara ficou linda.'],
        [J, 'Prata e ouro. Et la rose é para quem cantar mais bonito na festa. Ninguém cantou ainda.'],
      ], [
        [[J, 'Hoje não tem partida. Ce soir, só música… e mistério.']],
        [[J, 'A cartola é do meu grand-père. Ele era um pato muito misterioso. Ninguém sabia onde ele estava.'], [J, 'Principalmente ele.']],
      ]),
    });
  }
  const G = 'Gina';
  convidados.push({
    bicho: gina, nome: G, artigo: 'a', icone: '🦒', som: 'apito', raio: 1.6,
    gesto: () => gina.receberCarinho(),
    falas: fixas([
      [G, 'Boa noiteee! … Viu? Eu disse que a minha fantasia ia ser a mais alta da festa.'],
      [G, 'Noiva do Frankenstein. O cabelo levou duas latas de laquê. O pescoço levou três.'],
      [R, 'E esses parafusos?'],
      [G, 'Decorativos. Os do pescoço apertam um pouquinho, mas a beleza exige.'],
      [G, 'Ordem da casa: ninguém vai embora sem dançar, viu?'],
    ], [
      [[G, 'O ônibus volta mais tarde. Até lá, festa. Ordem da casa.']],
      [[G, 'Cuidado com o véu, viu? Ele engancha em tudo. Já enganchou no ônibus duas vezes.']],
    ]),
  });
  const CP = 'Capy';
  convidados.push({
    bicho: capy, nome: CP, artigo: 'o', icone: '🦈', som: 'apito', raio: 1.4,
    gesto: () => capy.receberCarinho(),
    falas: fixas([
      [CP, 'Tum-tum… tum-tum… tum-tum-tum-tum…'],
      [A, 'É a música do tubarão!'],
      [CP, 'Salva-vidas de dia, tubarão de noite. Mas um tubarão do bem: esse aqui não morde, só apita.'],
      [CP, 'E a bacia de maçãs é minha. Depois eu explico a brincadeira. Ninguém entra na água do lago sem mim!'],
    ], [
      [[CP, 'A barbatana é de feltro. Na água ela boia, eu testei.']],
      [[CP, 'Tum-tum… tum-tum… Ah, é só vocês. Oi!']],
    ]),
  });
  const N = 'Noel';
  convidados.push({
    bicho: noel, nome: N, artigo: 'o', icone: '🧪', som: 'gluglu', raio: 1.5, ladoDaDupla: 1,
    gesto: () => noel.receberCarinho(),
    falas: fixas([
      [N, 'BOA NOITE! Vocês vieram pras poções, né? Claro que vieram.'],
      [N, 'Professor Noel, cientista! Laboratório próprio, com rodinha!'],
      [N, 'Essa verde borbulha sozinha. A roxa pinga sozinha. E a laranja… a laranja eu ainda não sei o que faz.'],
      [A, 'Dá pra beber?'],
      [N, 'Dá pra OLHAR. Beber é depois que eu terminar o experimento!'],
    ], [
      [[N, 'Os óculos são de proteção. Proteção contra o quê? Contra tudo! É ciência!']],
      [[N, 'O caldeirão grande ali é meu também. Eu mexo ele a cada cinco minutos. CORRENDO!']],
    ]),
  });
  /*
   * O WALTER SÓ LATE, como no Mania: quem traduz é a dupla. A tomada vem
   * pela frente do balcão (`frente`), com a dupla do lado esquerdo do
   * tampo e a câmera do direito, de longe o bastante para a barraca entrar.
   */
  const W = 'Walter';
  convidados.push({
    bicho: walter, nome: W, artigo: 'o', icone: '🌭', som: 'latido', raio: 2.1, patrulha: true,
    frente: BW.giro, distancia: 2.6,
    dupla: () => {
      const eu = daBarraca(new THREE.Vector3(-0.45, 0, 1.25));
      const ele = daBarraca(new THREE.Vector3(-1.0, 0, 1.55));
      return [eu, ele];
    },
    presente: () => rumo === 'posto',
    gesto: () => walter.receberCarinho(),
    falas: fixas([
      [W, 'Au! Au!'],
      [A, 'Walter! Você veio de múmia!'],
      [W, 'Auuuu…'],
      [R, 'Ele levantou as patinhas da frente. Acho que é o susto de múmia.'],
      [A, 'Socorro. Que medo.'],
      [W, 'Au!'],
      [R, 'E a gravatinha por fora das ataduras. Garçom é garçom, até de múmia.'],
      [A, 'Ele tá empurrando uma salsicha-múmia pra gente com o focinho.'],
      [R, 'Obrigado, Walter. Enrolou igualzinho a você.'],
    ], [
      [[W, 'Au!'], [A, 'Ele perguntou se é com mostarda. Eu acho.']],
      [[W, 'Auuuu…'], [R, 'Ele tá treinando o susto de múmia. Tá melhorando.']],
      [[W, 'Au, au.'], [A, 'Ele virou as salsichas com a pata. Profissional.']],
    ]),
    // e volta a olhar para o balcão, esperando o próximo freguês
    // (o carinho o senta, e de serviço ninguém o levanta sozinho)
    aoFim: () => {
      walter.levantar();
      walter.encarar(frenteDoBalcao.x, frenteDoBalcao.z);
    },
  });
  const JS = 'Josefina';
  convidados.push({
    bicho: josefina, nome: JS, artigo: 'a', icone: '🐉', som: 'cantarolar', raio: 1.6,
    gesto: () => josefina.receberCarinho(),
    falas: fixas([
      [JS, 'Ah, oi. Gostaram? Um dragão bem tranquilo, que só solta fumacinha de chá.'],
      [JS, 'Plantei essas abóboras lá em março, pensando nesta noite. Abóbora boa leva tempo.'],
      [R, 'E as que estão acesas?'],
      [JS, 'Essas eu esculpi hoje à tarde, com calma. Podem olhar à vontade, só não pisem nas ramas.'],
    ], [
      [[JS, 'Dragão de verdade guarda ouro. Eu guardo abóbora. É mais útil.']],
      [[JS, 'Calma, calma. A festa vai até tarde, dá tempo de ver tudo.']],
    ]),
  });
  const GT = 'Gatito';
  convidados.push({
    bicho: gatito, nome: GT, artigo: 'o', icone: '🐶', som: 'miado', raio: 1.2,
    gesto: () => gatito.receberCarinho(),
    // pedido do Renan: ele conta que veio de Walter, porque gosta muito do restaurante
    falas: fixas([[GT, 'Au. …'], [GT, 'Eu vim de Walter! O Mania de Churrasco é o meu restaurante favorito.'], [GT, 'A gravatinha é de verdade, viu?']], [
      [[GT, 'Au. … Eu vim de Walter! O Mania de Churrasco é o meu restaurante favorito.']],
      [[GT, 'Hoje não tem lição de casa. Só se divertir. É lição também.']],
    ]),
  });
  const F = 'Flynn';
  convidados.push({
    bicho: flynn, nome: F, artigo: 'o', icone: '🐺', raio: 1.5,
    gesto: () => flynn.comemorar(1.6),
    falas: fixas([
      [F, 'AUUUUUUU! Lobisomem!'],
      [F, 'Presidente da Atlética de dia, lobisomem de noite. Vão, Gatitos!'],
      [A, 'As garras ficaram ótimas.'],
      [F, 'São de pelúcia. Não arranham nem a bola.'],
      [F, 'E bebam água, hein! Uivar dá uma sede.'],
    ], [
      [[F, 'AUUUU! … Desculpa, é que eu não consigo parar.']],
      [[F, 'Amanhã tem treino. Hoje é festa. Os dois são importantes.']],
    ]),
  });
  if (luna) {
    const L = 'Luna';
    convidados.push({
      bicho: luna, nome: L, artigo: 'a', icone: '🦉', sentado: true, raio: 1.9,
      gesto: () => luna.torcer(1.6),
      falas: fixas([
        [L, 'Uh-uh! ¡ÉPALE! Eu sou uma coruja!'],
        [L, 'A Estella fez as penas uma por uma. ¡Burda de penas! Tem pena até no braço!'],
        [L, 'E coruja fica acordada a noite inteira… eu vou tentar.'],
      ], [
        [[L, '¡Uh-uh! A Sol me fez treinar o "uh-uh" a semana toda.']],
        [[L, 'Vocês estão chévere demais! Vampiro e morceguinho… ¡qué fino!']],
      ]),
    });
  }
  if (sol) {
    const S = 'Sol';
    convidados.push({
      bicho: sol, nome: S, artigo: 'a', icone: '💀', sentado: true, raio: 1.1,
      gesto: () => sol.torcer(1.6),
      falas: fixas([
        [S, '¡Feliz Halloween, panas! Eu sou uma catrina!'],
        [S, 'As florzinhas da coroa são de papel. Fiz uma por uma. ¡Qué fino!'],
        [S, 'E o sorriso costurado é pintado. Não precisa ter medo, é um sorriso feliz.'],
      ], [
        [[S, '¡Vamos na roda depois! Lá de cima tudo brilha!']],
        [[S, 'A saia gira! Olha! … Ya va, sentada não gira.']],
      ]),
    });
  }
  if (estrella) {
    const E = 'Estrella';
    convidados.push({
      bicho: estrella, nome: E, artigo: 'a', icone: '🧚', sentado: true, raio: 1.1,
      falas: fixas([
        [E, 'Oi. Sou uma fadinha. Das estrelas, combinando com o nome.'],
        [E, 'Se alguém se perder no escuro, eu acendo a varinha.'],
        [E, '… Brincadeira. Ela não acende. Mas a asa brilha um pouquinho.'],
      ], [
        [[E, 'Comam alguma coisa antes de ir pra roda, tá?']],
        [[E, 'Tá tudo bem com vocês? Não tá frio? Tá de noite.']],
      ]),
    });
  }

  // cada um com o seu ponto "Falar com…", andando com ele e acima do de sempre
  for (const c of convidados) {
    const ponto = w.interact({
      id: `halloween:festa-${c.bicho.group.userData.peca}`,
      x: c.bicho.x, z: c.bicho.z, radius: c.raio ?? 1.4,
      label: `Falar com ${c.artigo} ${c.nome}`,
      icon: c.icone,
      highlight: c.bicho.group,
      priority: 3,
      onInteract: (api) => conversar(api, c),
    });
    w.onUpdate(() => {
      ponto.moveTo(c.bicho.x, c.bicho.z);
      if (c.presente) ponto.enabled = c.presente();
    });
  }

  // ---------------------------------------------------------------- o relógio
  w.onUpdate((dt) => {
    for (const b of novos) b.update(dt);
    carrinho.update(dt);
    pocao.update(dt);
    bacia.update(dt);
  });
}
