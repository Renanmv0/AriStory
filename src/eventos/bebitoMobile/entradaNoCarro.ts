import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { BEBITO_MOBILE, type BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';
import { ritmoDoPresente, relogioDaCena } from './presente';
import { CameraDeDentro, type TomadaDeFora } from './cameraDeDentro';

/**
 * ============================================ ENTRAR NO BEBITO MOBILE (a garagem)
 *
 * A primeira parte do "carro por dentro" (`docs/BEBITO-MOBILE-DENTRO.md`, D1 e
 * D2). Na garagem, a porta do motorista deixa de ser "Sair de carro" e vira
 * **Entrar no Bebito Mobile**:
 *
 *  1. a câmera sai da isométrica e VAI até a porta (o mesmo enquadramento da
 *     isométrica, para não haver corte seco);
 *  2. a porta abre (a de verdade: `carro.abrirPorta`);
 *  3. quem o jogador controla DESLIZA para dentro do banco do motorista,
 *     sentando no caminho, e a câmera entra junto até os olhos dele — a
 *     cabeça dele some, para a câmera não nascer dentro dela;
 *  4. a porta fecha, o outro aparece sentado do lado (deu a volta pelo outro
 *     lado enquanto a câmera olhava a porta);
 *  5. dentro, parados, dá para girar o olhar (o pescoço da roda gigante), e o
 *     menu pergunta "O que a gente faz?": viajar, descansar ou descer.
 *
 * É da cena `frente-da-casa`, mas a cena só chama `prepararOCarroPorDentro` e
 * liga o `entrar` na porta. O relógio é o do JOGO (`relogioDaCena`, que o
 * teste acelera por `ritmoDoPresente.vezes`), nunca `g.wait` nem `setTimeout`.
 *
 * O que ficou desfeito no fim de TUDO (a lição do bug da pose de carro):
 * a câmera, a porta, a pose de carro dos dois, a cabeça de quem olhou, e os
 * dois soltos FORA do colisor do carro, com o jogador destravado.
 */

export interface PalcoDoCarro {
  carro: BebitoMobile;
  /** onde o carro está (o meio dele, no chão) */
  vaga: { x: number; z: number };
  /** o que "Viajar" faz: vai para a estrada (devolve `false` se desistirem) */
  aoViajar: () => Promise<boolean>;
}

export interface CarroPorDentro {
  /** entra no carro (e fica nele até "Descer" ou "Viajar") */
  entrar: () => Promise<void>;
  /** está dentro agora? */
  readonly dentro: boolean;
  /** a câmera de dentro (o teste e as cenas de dentro olham para ela) */
  readonly camera: CameraDeDentro;
}

/** o que o teste enxerga do carro por dentro (a cena o põe aqui ao montar) */
export const depuracaoDoCarroPorDentro: { atual: CarroPorDentro | null } = { atual: null };

const V = THREE.Vector3;
const suave = (t: number): number => t * t * (3 - 2 * t);

/** o banco: o quanto se afunda quando se senta (o mesmo de `viagemDeCarro`) */
const ACIMA = new V(0, -0.47, 0);
/** de onde se entra no banco do motorista, no quadro do banco: pela porta, por fora do carro e no chão */
const DA_PORTA = new V(1.2, -BEBITO_MOBILE.assento, 0.05);

export function prepararOCarroPorDentro(w: WorldBuilder, palco: PalcoDoCarro): CarroPorDentro {
  const g: GameAPI = w.game;
  const { carro, vaga } = palco;
  const { esperar, aCadaQuadro } = relogioDaCena(w);
  let dentro = false;
  /** o que está sendo feito agora: dentro do carro, a câmera só olha em volta quando ninguém dirige a cena */
  let olhandoEmVolta = false;
  const camera = new CameraDeDentro(g, carro, 'jogador');
  let saida: { eu: { x: number; z: number; olhando: number }; ele: { x: number; z: number; olhando: number } } | null = null;

  // o quadro: o olhar em volta e a câmera (no tempo do jogo, como as cenas da quest)
  w.onUpdate((quadro) => {
    const dt = quadro * ritmoDoPresente.vezes;
    if (camera.ativa) {
      if (olhandoEmVolta && camera.dentro >= 0.99) camera.olhar(dt);
      camera.update(dt);
    }
  });

  /** uma tomada de fora, no quadro do mundo, a partir de um ponto do carro (em metros do carro) */
  const tomada = (de: [number, number, number], para: [number, number, number]): TomadaDeFora => ({
    de: new V(vaga.x + de[0], de[1], vaga.z + de[2]),
    para: new V(vaga.x + para[0], para[1], vaga.z + para[2]),
  });
  /** a porta vista de fora (de trás e de cima um pouco, para ver o vão aberto sem a folha na frente) */
  const VISTA_DA_PORTA = tomada([3.5, 1.5, -1.0], [0.9, 0.85, 0.45]);

  /** a isométrica de agora como tomada de perspectiva (a mesma conta da conversa com zoom) */
  const daIsometrica = (): TomadaDeFora => {
    const p = g.playerPosition();
    const giro = g.anguloDaCamera();
    const inclina = THREE.MathUtils.degToRad(34);
    const d = 11.7;
    return {
      para: new V(p.x, 1.0, p.z),
      de: new V(p.x + Math.sin(giro) * Math.cos(inclina) * d, 1.0 + Math.sin(inclina) * d, p.z + Math.cos(giro) * Math.cos(inclina) * d),
    };
  };

  /** anda `seg` segundos do relógio do jogo, chamando `f(k)` com `k` de 0 a 1 */
  const durante = (seg: number, f: (k: number) => void): Promise<void> => new Promise((fim) => {
    let t = 0;
    aCadaQuadro((dt) => {
      t += dt;
      const k = Math.min(1, t / seg);
      f(k);
      if (k >= 1) fim();
      return k >= 1;
    });
  });

  /** a câmera desliza de uma tomada a outra */
  const deslizar = (de: TomadaDeFora, ate: TomadaDeFora, seg: number): Promise<void> => {
    const a = new V();
    const b = new V();
    return durante(seg, (k) => {
      const s = suave(k);
      g.setCameraOmbro(a.copy(de.de).lerp(ate.de, s), b.copy(de.para).lerp(ate.para, s));
    });
  };

  /** o jogador entra (`sentido` 1) ou sai (`sentido` -1) pelo banco do motorista, sentando ou levantando no caminho */
  const passar = async (sentido: 1 | -1, seg: number): Promise<void> => {
    const local = new V();
    await durante(seg, (k) => {
      const t = sentido > 0 ? suave(k) : 1 - suave(k);
      // (um pulinho no meio: ninguém entra em carro arrastando o pé)
      local.lerpVectors(DA_PORTA, ACIMA, t);
      local.y += 0.12 * Math.sin(Math.PI * t);
      // de frente para o banco (virado para o `−X`) e, sentado, para a frente do carro
      g.ridePlayer(carro.assentos.motorista, local, 1, -Math.PI / 2 * (1 - t));
      // sentado no fim do caminho: a perna vai para a frente quando passa do meio
      g.poseNoCarro('jogador', t > 0.55 ? 'dirigindo' : null, 0);
    });
  };

  const entrar = async (): Promise<void> => {
    if (dentro) return;
    const nome = g.playerName();
    const outro = g.companionName();
    saida = {
      eu: { x: vaga.x + BEBITO_MOBILE.largura / 2 + 1.25, z: vaga.z + 0.9, olhando: -Math.PI / 2 },
      ele: { x: vaga.x + BEBITO_MOBILE.largura / 2 + 1.25, z: vaga.z - 0.4, olhando: -Math.PI / 2 },
    };
    g.lockPlayer(true);
    // 1. a câmera sai da isométrica e vai até a porta
    const inicio = daIsometrica();
    g.setCameraOmbro(inicio.de, inicio.para);
    await deslizar(inicio, VISTA_DA_PORTA, 1.3);
    // (o outro "dá a volta" enquanto a câmera olha a porta)
    g.setCompanionVisible(false);
    // 2. a porta abre
    g.som('portaDoBebito');
    carro.abrirPorta(true);
    await esperar(1.0);
    // 3. quem joga entra: a câmera vai junto, dos olhos dele
    g.ridePlayer(carro.assentos.motorista, DA_PORTA, 1, -Math.PI / 2);
    const chegou = camera.ligar(VISTA_DA_PORTA, 1.7);
    await passar(1, 1.0);
    await chegou;
    // 4. a porta fecha, e o outro está sentado do lado
    carro.abrirPorta(false);
    g.som('portaDoBebito');
    g.rideCompanion(carro.assentos.passageiro, ACIMA, 1, 0);
    g.poseNoCarro('parceiro', 'passageiro');
    g.setCompanionVisible(true);
    dentro = true;
    olhandoEmVolta = true;
    await esperar(0.9);

    // 5. dentro: a primeira vez, a conversa de quem vê o carro por dentro
    if (!g.flag('bebito:entrou-no-carro')) {
      g.setFlag('bebito:entrou-no-carro');
      await g.say(['Olha só… por dentro é ainda mais bonito.'], nome);
      await g.say(['Tem até o Jean-Luc balançando a cabeça no painel.'], outro);
      await g.say(['Dá pra deitar os bancos e tudo, né?'], nome);
    }
    await menuDeDentro();
  };

  /** "O que a gente faz?": viajar, descansar ou descer */
  const menuDeDentro = async (): Promise<void> => {
    for (;;) {
      const i = await g.ask('O que a gente faz?', ['Escolher destino', 'Descansar no carro', 'Descer do carro']);
      if (i === 0) {
        olhandoEmVolta = false;
        const foi = await palco.aoViajar();
        if (foi) return;
        olhandoEmVolta = true;
        continue;
      }
      if (i === 1) {
        // o descanso: só volta aqui se ficou no carro (descer acaba tudo)
        const desceu = await descansar();
        if (desceu) return;
        continue;
      }
      await descer();
      return;
    }
  };

  // ============================================================== descansar
  /** os dois no banco (sentados), como antes de deitar */
  const sentarOsDois = (): void => {
    g.setLying(false);
    g.ridePlayer(carro.assentos.motorista, ACIMA, 1, 0);
    g.rideCompanion(carro.assentos.passageiro, ACIMA, 1, 0);
    g.poseNoCarro('jogador', 'dirigindo', 0);
    g.poseNoCarro('parceiro', 'passageiro');
  };

  /**
   * DESCANSAR (a D3): os encostos da frente deitam e viram a cama, os dois
   * deitam lado a lado de barriga para cima (a câmera mostra os dois de cima,
   * como na barraca), com o rádio baixinho; uma conversa curta sobre aonde levar o
   * Bebito Mobile; e depois o menu: cochilar, ou sair do carro. O teto tem um
   * corte VISUAL durante a tomada e volta ao levantar; não há abertura para olhar o céu.
   * Devolve `true` se saíram do carro, `false` se voltaram ao banco.
   */
  const descansar = async (): Promise<boolean> => {
    const nome = g.playerName();
    const outro = g.companionName();
    olhandoEmVolta = false;
    g.som('portaDoBebito');
    // 1. os encostos deitam, com eles ainda sentados (o encosto cai para trás, para longe deles)
    carro.deitarEncostos(1);
    await esperar(1.5);
    // 2. e deitam: lado a lado na cama (o jogador do lado do motorista, `+X`)
    g.poseNoCarro('jogador', null);
    g.poseNoCarro('parceiro', null);
    g.ridePlayer(carro.cama, new V(0.4, 0, 0), 1, 0);
    g.rideCompanion(carro.cama, new V(-0.4, 0, 0), 1, 0);
    g.setLying(true);
    camera.deitar(true);
    g.trocarMusica('danca-lenta');
    await esperar(1.3);
    // No descanso, a tomada mostra os dois de cima (como a barraca).
    olhandoEmVolta = false;

    // 3. a conversa curta: aonde viajar com o Bebito Mobile (as palavras são minhas, provisórias)
    const primeira = !g.flag('bebito:descansou-no-carro');
    await g.say(['Bebito… pra onde a gente leva o Bebito Mobile primeiro?'], nome);
    await g.say(['Pro Villa Lobos! Tem a roda gigante, o lago… e o Mano de sorvete.'], outro);
    await g.say(['E depois o clube. E a escola do Gatito!'], nome);
    await g.say(['A gente vai em todo lugar. Esse carro é a nossa casinha com rodas.'], outro);
    if (primeira) {
      g.setFlag('bebito:descansou-no-carro');
      g.unlock({
        id: 'descansamos-no-bebito-mobile',
        title: 'Descansamos no Bebito Mobile',
        place: 'Garagem de casa',
        note: 'Deitamos os bancos do Bebito Mobile ainda na garagem, com o rádio baixinho, e ficamos conversando de pra onde a gente ia levar ele primeiro. Esse carro já é a nossa casinha com rodas.',
        icon: '🚙',
      });
    }
    g.bump('bebito:descansos');

    // 4. cochilar quantas vezes quiser, ou sair do carro
    for (;;) {
      const i = await g.ask('E agora?', ['Cochilar um pouquinho', 'Sair do carro']);
      if (i === 0) {
        olhandoEmVolta = false;
        await cochilar();
        olhandoEmVolta = false;
        continue;
      }
      break;
    }
    // 5. levantar: os encostos voltam e eles sentam de novo, e daí é descer
    olhandoEmVolta = false;
    g.trocarMusica(null);
    g.setLying(false);
    carro.deitarEncostos(0);
    camera.deitar(false);
    sentarOsDois();
    await esperar(1.3);
    await descer();
    return true;
  };

  /** o cochilo: só um fade, o ronco baixinho e acordar no mesmo lugar */
  const cochilar = async (): Promise<void> => {
    await g.escurecerTela(true, 'sono');
    for (let i = 0; i < 3; i++) {
      g.som('roncoNoCarro');
      await esperar(2.4);
    }
    await g.escurecerTela(false, 'sono');
    await g.say(['Hmm… eu dormi?'], g.playerName());
    await g.say(['Um cochilinho. Você roncou baixinho.'], g.companionName());
  };

  const descer = async (): Promise<void> => {
    olhandoEmVolta = false;
    // a porta abre, a câmera vai para fora e quem joga sai pelo mesmo caminho
    carro.abrirPorta(true);
    g.som('portaDoBebito');
    const fora = camera.desligar(VISTA_DA_PORTA, 1.6);
    await esperar(0.5);
    await passar(-1, 1.0);
    await fora;
    const s = saida!;
    g.poseNoCarro('jogador', null);
    g.poseNoCarro('parceiro', null);
    // os dois saem pela porta e ficam ao lado dela, FORA do colisor do carro (e a porta fecha por último)
    g.releasePlayer(s.eu.x, s.eu.z, s.eu.olhando);
    g.releaseCompanion(s.ele.x, s.ele.z, s.ele.olhando);
    g.lockPlayer(true);
    g.freeCompanion();
    await esperar(0.4);
    carro.abrirPorta(false);
    g.som('portaDoBebito');
    g.mostrarCabeca('jogador', true);
    // (a porta termina de fechar com o jogo ainda travado: ninguém anda em cima dela)
    await new Promise<void>((pronto) => {
      aCadaQuadro(() => {
        if (carro.portaAberta > 0) return false;
        pronto();
        return true;
      });
    });
    dentro = false;
    g.lockPlayer(false);
  };

  const publico: CarroPorDentro = {
    entrar,
    get dentro() { return dentro; },
    camera,
  };
  depuracaoDoCarroPorDentro.atual = publico;
  return publico;
}
