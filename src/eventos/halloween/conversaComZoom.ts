import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { SomNome } from '../../audio/efeitos';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Bicho } from '../../entities/bichos/Bicho';

/*
 * A CONVERSA COM ZOOM DA FESTA (pedido do Renan: "ao falar com cada um, a
 * câmera dá um zoom nos personagens, para ver melhor as fantasias"). Nasceu
 * nos postos do parque (`naFesta.ts`) e mora aqui desde que o salão da
 * abóbora (`noSalao.ts`) passou a usar a mesma tomada.
 *
 * A isométrica dá lugar a uma câmera de perspectiva que nasce onde a
 * isométrica estava (o mesmo enquadramento, para não haver corte) e desliza
 * até um três-quartos de frente de quem fala, na altura do peito dele e na
 * distância que a altura dele pede (a Gina de longe, o Mano de perto). Quem
 * fala vira para a dupla, a dupla vira para ele, e no fim a câmera desliza de
 * volta e devolve a isométrica. O relógio do deslize é o do jogo
 * (`w.onUpdate`), e não o `g.wait` de parede.
 *
 * Quem usa dá o MIOLO da conversa (as falas, a caça, o bilhete do Cookie): a
 * arrumação, a câmera e a devolução no fim são daqui.
 */

/** um ponto de cena: de onde a câmera olha e para onde */
export interface Tomada {
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

/** quem fala e o que diz */
export type Fala = readonly [string, string];

/** quem fala na festa: o bicho, o nome na caixa de fala e o que ele diz */
export interface Convidado {
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
export const fixas = (primeira: readonly Fala[], depois: ReadonlyArray<readonly Fala[]>) =>
  (_api: GameAPI, eh: boolean, vez: number): readonly Fala[] => (eh ? primeira : depois[vez % depois.length]);

export interface ZoomDaConversa {
  /** quem está conversando agora (e onde ele parou, para o patrulheiro) */
  readonly falando: { c: Convidado; x: number; z: number } | null;
  /**
   * a conversa inteira: arruma, desliza, roda o miolo, desliza de volta e
   * devolve todo mundo. `daTomadaAtual` começa o deslize de onde a câmera de
   * cena já está (a surpresa do salão emenda a conversa da Estella na tomada
   * da porta), e não da isométrica
   */
  conversar(api: GameAPI, c: Convidado, miolo: (api: GameAPI) => Promise<void>, opcoes?: { daTomadaAtual?: boolean }): Promise<void>;
  /** leva a câmera de perspectiva de onde ela está até `ate`, no relógio do jogo */
  deslizar(ate: Tomada, dura: number): Promise<void>;
  /** onde a isométrica está agora (para a de perspectiva nascer no mesmo enquadramento) */
  tomadaDaIsometrica(api: GameAPI): Tomada;
  /** põe a câmera de perspectiva numa tomada, sem deslizar (o começo de uma cena) */
  cortarPara(api: GameAPI, t: Tomada): void;
}

/** gira um vetor do chão (x, z) como o `rotation.y` gira */
const girar = (v: THREE.Vector2, a: number): THREE.Vector2 =>
  new THREE.Vector2(v.x * Math.cos(a) + v.y * Math.sin(a), -v.x * Math.sin(a) + v.y * Math.cos(a));

const suave = (t: number): number => t * t * (3 - 2 * t);

/**
 * A máquina da conversa com zoom, uma por cena. `aoAbrir`/`aoFechar` rodam
 * quando a câmera de perspectiva entra e quando ela devolve a isométrica (o
 * salão da abóbora mostra o teto só de perto).
 */
export function zoomDaConversa(w: WorldBuilder, ganchos: { aoAbrir?: () => void; aoFechar?: () => void } = {}): ZoomDaConversa {
  const g0 = w.game;
  let deslize: Deslize | null = null;
  const camera: Tomada = { de: new THREE.Vector3(), para: new THREE.Vector3() };
  const deslizar = (ate: Tomada, dura: number): Promise<void> => new Promise((fim) => {
    deslize?.fim();
    deslize = { de: { de: camera.de.clone(), para: camera.para.clone() }, ate, dura, t: 0, fim };
  });

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

  let falando: { c: Convidado; x: number; z: number } | null = null;
  const conversar = async (api: GameAPI, c: Convidado, miolo: (api: GameAPI) => Promise<void>, opcoes: { daTomadaAtual?: boolean } = {}): Promise<void> => {
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
    if (!opcoes.daTomadaAtual) {
      camera.de.copy(iso.de);
      camera.para.copy(iso.para);
    }
    api.setCameraOmbro(camera.de, camera.para);
    ganchos.aoAbrir?.();
    try {
      await deslizar(perto, 1.1);
      await miolo(api);
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
      ganchos.aoFechar?.();
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

  return {
    get falando() {
      return falando;
    },
    conversar,
    deslizar,
    tomadaDaIsometrica,
    cortarPara: (api, t) => {
      deslize?.fim();
      deslize = null;
      camera.de.copy(t.de);
      camera.para.copy(t.para);
      api.setCameraOmbro(camera.de, camera.para);
    },
  };
}
