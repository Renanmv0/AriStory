import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import { BEBITO_MOBILE, type BebitoMobile } from '../../world/bebitoMobile/BebitoMobile';
import { ARI, RENAN } from '../../characters/cast';
import { FASES_DO_PRESENTE, LICAO_QUE_LIBERA_O_PRESENTE, bebitoMobileNestaPagina } from '../BebitoMobile';

/**
 * ================================ A QUEST DO PRESENTE (o Bebito Mobile chega)
 *
 * O roteiro é do Renan (2026-11-11), e mora aqui, fora das cenas — o molde
 * da camada do Halloween: cada cena ganha UMA chamada e empresta o que é dela.
 *
 *  1. NO QUARTO (`sonoDaSurpresa`): depois da lição 10 da apostila do Gatito,
 *     deitar na cama do Ari vira DORMIR. Ao acordar, o Renan pergunta se o Ari
 *     quer ver uma surpresa, e os dois vão para a sala.
 *  2. NA SALA (`surpresaNaSala`): o Renan diz que já volta e sai pela porta da
 *     rua. O Ari fica, sem entender — e vai atrás.
 *  3. NA FRENTE DA CASA (`chegadaDoBebito`): o Renan não está mais lá.
 *     Passados uns segundos, a buzina: ele chega dirigindo o Bebito Mobile,
 *     de laço no teto, e estaciona de ré na garagem.
 *
 * NA QUEST O ARI É QUEM SE CONTROLA (o presente é para ele): se quem joga
 * estava com o Renan, os dois trocam antes de dormir. Por isso o Renan é
 * sempre o PARCEIRO aqui — é ele que anda até a porta, some e dirige.
 *
 * AS FALAS: o roteiro (quem diz o quê, e quando) é do Renan; as palavras
 * foram escritas por mim e o Renan deixou como estão (2026-11-12: "de resto
 * pode deixar como fez"). O grito do Ari ao ver o carro
 * (`FALA_DO_ARI_AO_VER_O_CARRO`) é dele, literal.
 */

const A = ARI.name;
const R = RENAN.name;

/**
 * O PRIMEIRO GRITO DO ARI ao ver o carro: do Renan, LITERAL (2026-11-12: "quero
 * falas bem surpresas, tipo 'BEBITOOOO UM CARRO???' e coisas do tipo"). As
 * outras reações em volta (`REACOES_DO_ARI`) são minhas, no mesmo tom.
 */
export const FALA_DO_ARI_AO_VER_O_CARRO = 'BEBITOOOO UM CARRO???';

type Falas = Array<readonly [string, string]>;
/**
 * Põe o Ari num ponto SEM soltar a trava: o `releasePlayer` do motor destrava
 * o jogador, e numa cutscene isso deixava o `E` abrir a porta no meio da cena.
 */
const porOAri = (g: GameAPI, x: number, z: number, olhando = 0): void => {
  g.releasePlayer(x, z, olhando);
  g.lockPlayer(true);
};

const conversa = async (g: GameAPI, falas: Falas): Promise<void> => {
  for (const [quem, texto] of falas) await g.say([texto], quem);
};

/** a quest pode começar? (a chave ligada, a lição 10 concluída, e ainda não começou) */
export function presenteDisponivel(g: GameAPI): boolean {
  if (!bebitoMobileNestaPagina() || g.flag(FASES_DO_PRESENTE.surpresa)) return false;
  return (g.progressoDaApostila().estrelas[LICAO_QUE_LIBERA_O_PRESENTE] ?? 0) > 0;
}

/** o carro já foi entregue? (e a chave está ligada) */
export function temBebitoMobile(g: GameAPI): boolean {
  return bebitoMobileNestaPagina() && g.flag(FASES_DO_PRESENTE.ganhou);
}

/** o Renan saiu para buscar o carro e ainda não voltou */
export function renanFoiBuscar(g: GameAPI): boolean {
  return bebitoMobileNestaPagina() && g.flag(FASES_DO_PRESENTE.saiu) && !g.flag(FASES_DO_PRESENTE.ganhou);
}

// =============================================================== o relógio
/** o ritmo das cutscenes da quest: o teste acelera por aqui (o Chromium sem placa anda a um quinto do relógio) */
export const ritmoDoPresente = { vezes: 1 };

/** o relógio da cutscene, no tempo do JOGO (um `w.onUpdate`): esperas e coisas que andam a cada quadro */
export function relogioDaCena(w: WorldBuilder): { esperar: (s: number) => Promise<void>; aCadaQuadro: (f: (dt: number) => boolean) => void } {
  const esperas: Array<{ falta: number; pronto: () => void }> = [];
  const tiques: Array<(dt: number) => boolean> = [];
  w.onUpdate((quadro) => {
    const dt = quadro * ritmoDoPresente.vezes;
    for (let i = esperas.length - 1; i >= 0; i--) {
      esperas[i].falta -= dt;
      if (esperas[i].falta <= 0) esperas.splice(i, 1)[0].pronto();
    }
    for (let i = tiques.length - 1; i >= 0; i--) if (tiques[i](dt)) tiques.splice(i, 1);
  });
  return {
    esperar: (s) => new Promise((pronto) => { esperas.push({ falta: s, pronto }); }),
    aCadaQuadro: (f) => { tiques.push(f); },
  };
}

const suave = (t: number): number => t * t * (3 - 2 * t);

// ================================================================ 1. o quarto
/**
 * NO QUARTO: os dois deitam, o Ari pega no sono, e ao acordar o Renan
 * pergunta da surpresa. A cena empresta o deitar e o levantar dela.
 */
export async function sonoDaSurpresa(
  g: GameAPI,
  cama: { deitar: (g: GameAPI) => Promise<void>; levantar: (g: GameAPI) => void },
): Promise<void> {
  // o presente é para o Ari: é ele que se controla daqui até o carro chegar
  if (g.playerId() !== ARI.id) g.swapCharacters();
  await cama.deitar(g);
  await conversa(g, [
    [A, 'Me deu um sono…'],
    [R, 'Dorme um pouco. Eu fico aqui.'],
  ]);
  await g.escurecerTela(true, 'sono');
  await g.wait(1.4);
  await g.escurecerTela(false, 'sono');
  g.som('passarinho');
  await conversa(g, [
    [R, 'Bom dia, bebito.'],
    [A, 'Bom dia… Eu dormi muito?'],
  ]);
  const quer = await g.ask('Quer ver uma surpresa?', ['Quero!', 'Que surpresa?'], R);
  await conversa(g, quer === 0
    ? [[A, 'Quero! O que é?'], [R, 'Se eu contar, não é surpresa. Vem pra sala.']]
    : [[A, 'Que surpresa?'], [R, 'Se eu contar, não é surpresa. Vem pra sala.']]);
  cama.levantar(g);
  g.setFlag(FASES_DO_PRESENTE.surpresa);
  g.goTo('casa', 'do-quarto');
}

// ================================================================== 2. a sala
/**
 * NA SALA: se a surpresa foi anunciada e o Renan ainda não saiu, a cena
 * acontece no primeiro quadro — ele diz que já volta, anda até a porta da
 * rua e sai; o Ari fica sem entender e vai atrás. `porta` é onde fica a
 * porta da rua (o ponto em que ele some).
 */
export function surpresaNaSala(
  w: WorldBuilder,
  sala: { porta: { x: number; z: number }; /** onde o Ari espera na sala (o Renan, 1,4 ao lado); sem isso, a partir da porta */ ficam?: { x: number; z: number } },
): void {
  const g = w.game;
  if (!bebitoMobileNestaPagina() || !g.flag(FASES_DO_PRESENTE.surpresa) || g.flag(FASES_DO_PRESENTE.ganhou)) return;
  const { esperar, aCadaQuadro } = relogioDaCena(w);
  let comecou = false;
  w.onUpdate(() => {
    if (comecou) return;
    comecou = true;
    void cena();
  });

  const cena = async (): Promise<void> => {
    g.lockPlayer(true);
    if (g.playerId() !== ARI.id) g.swapCharacters();
    const { porta } = sala;
    const ari = sala.ficam ?? { x: porta.x - 2.6, z: porta.z - 2.9 };
    if (!g.flag(FASES_DO_PRESENTE.saiu)) {
      // os dois no meio da sala, de frente um para o outro
      porOAri(g, ari.x, ari.z, Math.PI / 2);
      g.releaseCompanion(ari.x + 1.4, ari.z, -Math.PI / 2);
      g.holdCompanion(ari.x, ari.z);
      await esperar(0.5);
      await conversa(g, [
        [A, 'Pronto, tô na sala. Cadê a surpresa?'],
        [R, 'Fica aqui. Eu já volto.'],
        [A, `Como assim, já volta? ${g.companionName()}!`],
      ]);
      // ele anda até a porta da rua, abre e sai
      g.commandCompanion(porta.x, porta.z - 0.5);
      await new Promise<void>((chegou) => {
        let t = 0;
        aCadaQuadro((dt) => {
          t += dt;
          const p = g.companionPosition();
          const perto = Math.hypot(p.x - porta.x, p.z - (porta.z - 0.5)) < 0.45;
          if (perto || t > 7) chegou();
          return perto || t > 7;
        });
      });
      g.som('porta');
      await esperar(0.25);
      g.setCompanionVisible(false);
      g.setFlag(FASES_DO_PRESENTE.saiu);
      await esperar(0.9);
    } else {
      // (a página recarregou com ele já do lado de fora: o Ari está sozinho na sala)
      porOAri(g, ari.x, ari.z, Math.PI / 2);
      g.setCompanionVisible(false);
      await esperar(0.4);
    }
    await conversa(g, [
      [A, '…Ele saiu mesmo.'],
      [A, 'Eu vou lá ver.'],
    ]);
    g.lockPlayer(false);
    g.goTo('frente-da-casa', 'da-casa');
  };
}

// ====================================================== 3. a frente da casa
export interface PalcoDaChegada {
  /** o carro (já montado, de laço no teto), fora de vista */
  carro: BebitoMobile;
  /** onde ele fica estacionado, de nariz para a rua (`+Z`) */
  vaga: { x: number; z: number };
  /** a faixa da rua por onde ele chega, e de onde ele vem */
  rua: { z: number; deLonge: number };
  /** onde o Ari espera (na frente da porta) e onde os dois se encontram, ao lado do carro */
  porta: { x: number; z: number };
  /** chamada quando o carro parou de vez (a cena liga o colisor e o que mais for dela) */
  aoEstacionar: () => void;
  /** manda o portão da garagem abrir (e, com `false`, devolve o comando ao portão: ele fecha sozinho quando todos se afastam) */
  portao: (aberto: boolean) => void;
}

/** o raio da curva de ré para dentro da garagem */
const RAIO_DA_RE = 3.4;

/**
 * NA FRENTE DA CASA: o Ari sai, o Renan não está. Uns segundos, a buzina, e
 * o Bebito Mobile vem pela rua, passa da garagem, engata a ré e entra de
 * costas — para ficar de cara para a rua (e para o Ari). Tudo no relógio do
 * jogo; a câmera de cena acompanha o carro e depois chega perto dos dois.
 */
export function chegadaDoBebito(w: WorldBuilder, palco: PalcoDaChegada): void {
  const g = w.game;
  const { esperar, aCadaQuadro } = relogioDaCena(w);
  const { carro, vaga, rua, porta } = palco;
  const V = THREE.Vector3;
  let comecou = false;
  w.onUpdate(() => {
    if (comecou) return;
    comecou = true;
    void cena();
  });

  // a câmera de cena: um ponto fixo e um olhar que persegue devagar o alvo
  const olho = new V();
  const olhar = new V();
  const alvo = new V();
  let camera = false;
  w.onUpdate((dt) => {
    if (!camera) return;
    olhar.lerp(alvo, Math.min(1, dt * 3));
    g.setCameraOmbro(olho, olhar);
  });

  /** o motor roncando enquanto `anda()` for verdade */
  const roncar = (anda: () => boolean): void => {
    let falta = 0;
    aCadaQuadro((dt) => {
      if (!anda()) return true;
      falta -= dt;
      if (falta <= 0) {
        g.som('motorDoBebito');
        falta = 0.34;
      }
      return false;
    });
  };

  /** leva o carro por um trecho: `pose(k)` dá onde ele está e para onde aponta o nariz, de 0 a 1 */
  const andar = (dura: number, curva: (t: number) => number, pose: (k: number) => { x: number; z: number; nariz: number }, deRe: boolean): Promise<void> =>
    new Promise((fim) => {
      let t = 0;
      const antes = new V().copy(carro.group.position);
      aCadaQuadro((dt) => {
        t = Math.min(1, t + dt / dura);
        const p = pose(curva(t));
        carro.group.position.set(p.x, 0, p.z);
        carro.group.rotation.y = p.nariz;
        const passo = Math.hypot(p.x - antes.x, p.z - antes.z);
        carro.rodar(deRe ? -passo : passo);
        antes.set(p.x, 0, p.z);
        if (t >= 1) fim();
        return t >= 1;
      });
    });

  /** o Ari, parado na porta, vira a cabeça (o corpo) de um lado para o outro */
  const virar = (de: number, ate: number, dura: number): Promise<void> =>
    new Promise((fim) => {
      let t = 0;
      aCadaQuadro((dt) => {
        t = Math.min(1, t + dt / dura);
        porOAri(g, porta.x, porta.z, de + (ate - de) * suave(t));
        if (t >= 1) fim();
        return t >= 1;
      });
    });

  const cena = async (): Promise<void> => {
    g.lockPlayer(true);
    if (g.playerId() !== ARI.id) g.swapCharacters();
    // o Ari na frente da porta; o Renan já dentro do carro, lá longe
    porOAri(g, porta.x, porta.z, 0);
    carro.group.position.set(rua.deLonge, 0, rua.z);
    carro.group.rotation.y = -Math.PI / 2;
    g.rideCompanion(carro.assentos.motorista, new V(0, -0.47, 0), 1, 0);
    g.poseNoCarro('parceiro', 'dirigindo');
    g.setCompanionVisible(true);
    carro.andando(0);

    /*
     * AS QUATRO TOMADAS (a câmera de cena é de perto e tem horizonte; cada
     * troca é um CORTE, e é no corte que o Ari muda de lugar — o motor não
     * tem "andar até" para o jogador):
     *  A. do portão, o Ari na porta, procurando;
     *  B. por cima do ombro dele: o jardim, a cerca e a rua, onde o carro passa;
     *  C. da rua, a boca da garagem: o carro entrando de ré, o Ari na passagem
     *     da mureta, vendo;
     *  D. de perto: os dois na frente do carro.
     */
    const corte = (ox: number, oy: number, oz: number, ax: number, ay: number, az: number): void => {
      olho.set(ox, oy, oz);
      alvo.set(ax, ay, az);
      olhar.copy(alvo);
      camera = true;
    };
    // A. o Ari na porta
    corte(porta.x + 1.9, 2.1, porta.z + 5.0, porta.x, 1.2, porta.z);
    await esperar(0.8);
    await conversa(g, [[A, `${g.companionName()}?`]]);
    // ele olha para um lado, para o outro…
    await virar(0, 1.1, 0.5);
    await esperar(0.6);
    await virar(1.1, -1.0, 0.7);
    await esperar(0.6);
    await virar(-1.0, 0, 0.45);
    await conversa(g, [[A, 'Ué. Cadê ele?']]);
    await esperar(1.4);

    // …e a buzina, da rua
    g.som('buzinaDoBebito');
    await esperar(0.7);
    await conversa(g, [[A, 'Isso foi uma buzina?']]);

    // B. por cima do ombro: o Ari desce o caminho, e ele vem pela rua (o nariz para o −X) e passa da boca da garagem
    const xPassa = vaga.x - RAIO_DA_RE;
    porOAri(g, porta.x, porta.z + 2.3, 0);
    corte(porta.x - 1.5, 2.8, porta.z - 0.75, porta.x + 4, 0.7, rua.z);
    let seguindo = true;
    aCadaQuadro(() => {
      if (seguindo) alvo.set(Math.max(vaga.x + 2.5, Math.min(porta.x + 4, carro.group.position.x * 0.75)), 0.7, rua.z - 0.6);
      return !seguindo;
    });
    let andando = true;
    roncar(() => andando);
    carro.andando(1);
    await andar(4.8, (t) => 1 - Math.pow(1 - t, 2.2), (k) => ({ x: rua.deLonge + (xPassa - rua.deLonge) * k, z: rua.z, nariz: -Math.PI / 2 }), false);
    seguindo = false;
    carro.frear(true);
    carro.empurrar(0.35);
    carro.andando(0.2);
    await esperar(0.5);

    // C. da rua: a ré — um quarto de volta para dentro da garagem, o volante todo virado
    porOAri(g, vaga.x + 3.5, vaga.z + 2.2, -Math.PI / 2);
    // (em tela estreita — o celular em pé — a câmera de cena vê pouco para os lados, e o carro
    // saía cortado: a tomada recua pela mesma linha, e ele cabe inteiro)
    const emPe = typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.8;
    const recuo = emPe ? 1.55 : 1;
    const miraDaRe = new V(vaga.x - 1.4, 0.9, vaga.z + 6.4);
    const olhoDaRe = new V(vaga.x + 7.6, 3.4, rua.z + 2.0).sub(miraDaRe).multiplyScalar(recuo).add(miraDaRe);
    corte(olhoDaRe.x, olhoDaRe.y, olhoDaRe.z, miraDaRe.x, miraDaRe.y, miraDaRe.z);
    const cz = rua.z - RAIO_DA_RE;
    // o portão da garagem abre (é automático), e só então ele engata a ré
    palco.portao(true);
    await esperar(2.0);
    carro.frear(false);
    carro.estercar(0.5);
    g.poseNoCarro('parceiro', 'dirigindo', -1.3);
    await esperar(0.4);
    await andar(3.4, suave, (k) => {
      const a = k * (Math.PI / 2);
      return { x: xPassa + RAIO_DA_RE * Math.sin(a), z: cz + RAIO_DA_RE * Math.cos(a), nariz: Math.atan2(-Math.cos(a), Math.sin(a)) };
    }, true);
    carro.estercar(0);
    g.poseNoCarro('parceiro', 'dirigindo', 0);
    // e reto para trás, até a vaga
    alvo.set(vaga.x + 0.6, 1.0, vaga.z + 2.6);
    await andar(2.8, (t) => 1 - Math.pow(1 - t, 2), (k) => ({ x: vaga.x, z: cz + (vaga.z - cz) * k, nariz: 0 }), true);
    andando = false;
    carro.andando(0);
    carro.frear(true);
    carro.empurrar(-0.3);
    palco.aoEstacionar();
    await esperar(0.5);
    carro.frear(false);
    g.som('buzinaDoBebito');
    await esperar(0.9);

    // D. o Renan desce (a porta bate), e os dois se encontram na frente do carro
    g.som('portaDoBebito');
    await esperar(0.35);
    g.poseNoCarro('parceiro', null);
    const frente = vaga.z + BEBITO_MOBILE.comprimento / 2;
    // (um de frente para o outro, mas ABERTOS para a câmera, como em palco: de perfil puro o
    // cabelo do Renan tapava o rosto dele; o carro fica atrás dos dois)
    const ele = { x: vaga.x + 1.0, z: frente + 0.35 };
    const ari = { x: vaga.x - 0.2, z: frente + 1.2 };
    const ABRE = 0.6;
    const rumoDele = Math.atan2(ari.x - ele.x, ari.z - ele.z) + ABRE;
    const rumoDoAri = Math.atan2(ele.x - ari.x, ele.z - ari.z) - ABRE;
    g.releaseCompanion(ele.x, ele.z, rumoDele);
    porOAri(g, ari.x, ari.z, rumoDoAri);
    g.holdCompanion(ele.x + Math.sin(rumoDele) * 3, ele.z + Math.cos(rumoDele) * 3);
    g.som('portaDoBebito');
    // (a câmera fica na rua, de frente para a boca da garagem: de lado, o pilar e o muro tapavam os dois)
    corte(vaga.x + 3.3, 2.2, frente + 5.8, vaga.x + 0.4, 1.2, frente + 0.5);
    await esperar(1.0);

    await conversa(g, [
      [R, 'Surpresa!'],
      [A, FALA_DO_ARI_AO_VER_O_CARRO],
      [A, 'ESPERA! Isso é pra gente?! Para! PARA TUDO!'],
      [R, 'É nosso. O Bebito Mobile.'],
      [A, 'NOSSO?! UM CARRO NOSSO?! Eu vou chorar, bebito!'],
      [A, 'Bebito Mobile… TÁ ESCRITO NA PLACA!'],
      [R, 'E tem a sua estrela no retrovisor, o Pelusa no chaveiro e o Jean-Luc no painel.'],
      [A, 'Então a gente não precisa mais correr atrás de ônibus?'],
      [R, 'Só se você quiser. E cada viagem a gente decide quem dirige.'],
    ]);
    g.soltarCoracoes(5);
    g.setFlag(FASES_DO_PRESENTE.ganhou);
    g.unlock({
      id: 'bebito-mobile',
      title: 'O Bebito Mobile',
      place: 'Casa do Ari',
      note: 'Eu disse que já voltava e saí pela porta. Você veio atrás, sem entender nada, e eu cheguei buzinando: um carrinho azul de teto creme, com um laço no teto e o nosso nome na placa, estacionado de ré na garagem.',
      icon: '🚙',
    });
    await esperar(0.6);
    camera = false;
    palco.portao(false);
    g.setCameraOmbro(null);
    g.freeCompanion();
    g.lockPlayer(false);
  };
}
