import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { bolaDeBasquete } from '../world/furniture';
import { ARI, RENAN } from '../characters/cast';
import { ARREMESSO, Flynn } from '../entities/bichos/Flynn';
import { Rocco } from '../entities/bichos/Rocco';
import { MEMORIA_DO_ROCCO } from '../eventos/bebitoMobile/rota';
import { posicionarParaConversar, soltarDaConversa } from './escolaComum';
import { RAIO_DA_BOLA, VELOCIDADE_DA_CORRIDA, flynnNoGinasio, type QuadraDoTreino } from './escolaAtletica';

/**
 * ============================================ O UM CONTRA UM NO GINÁSIO
 *
 * Pedido do Renan (2026-11-19): "depois de encontrar o Rocco pela primeira vez, ele aparece no ginásio dos Gatitos
 * jogando basquete com o Flynn". Com a memória da estrada ("O rival") e o Flynn já no ginásio (o Módulo 2), o treino
 * solitário do Flynn dá lugar a um UM CONTRA UM de quadra inteira, com UMA bola:
 *
 * - cada um ATACA uma cesta (o Flynn a da direita, o Rocco a da esquerda) e DEFENDE a outra;
 * - quem ataca DRIBLA de uma ponta à outra (a bola quicando embaixo da pata direita), para na beira do garrafão e
 *   arremessa; quem defende corre na frente, chega primeiro e MARCA (os braços abertos), e no arremesso pula com os
 *   braços para cima;
 * - entra (a bola cai pela rede e rola) ou bate no aro (o rebote); de um jeito ou de outro, quem defendia pega a bola
 *   e a posse troca — e o outro, se fez a cesta, comemora antes de voltar correndo para defender.
 *
 * Sem placar oficial nem vencedor (o jogo de verdade, Gatitos × Dogões, é decisão do Renan para depois): quem está
 * ganhando só aparece nas farpas da conversa. As FALAS são PROVISÓRIAS (minhas).
 *
 * O caminho de antes fica intacto: sem o Rocco, a cena chama o treino do Flynn de sempre (`montarOTreinoDoFlynn`).
 */

/** a primeira vez que a dupla acha os dois jogando no ginásio */
export const MEMORIA_DO_UM_CONTRA_UM = 'um-contra-um-no-ginasio';

/** o Rocco joga no ginásio: o Flynn já treina lá, e a dupla já conhece o Rocco da estrada */
export function roccoNoGinasio(g: GameAPI): boolean {
  return flynnNoGinasio(g) && g.temMemoria(MEMORIA_DO_ROCCO);
}

/** driblando, mais devagar que correndo solto (a dupla anda a 4,4) */
const VELOCIDADE_DO_DRIBLE = 3.5;
/** a chance de cada arremesso entrar (a de quem está atrás sobe um tico: o jogo fica sempre apertado) */
const CHANCE_DE_CESTA = 0.62;
/** da parada até a marcação, na direção do aro; e a bola descansa ainda mais adiante, na frente de quem marcava */
const MARCACAO = 0.95;
const BOLA_DEPOIS = 0.55;

type Quem = 'flynn' | 'rocco';
/** quem ataca qual cesta (o lado: -1 a da esquerda, 1 a da direita) */
const CESTA: Record<Quem, number> = { flynn: 1, rocco: -1 };
const outro = (q: Quem): Quem => (q === 'flynn' ? 'rocco' : 'flynn');

type EstadoDoAtleta =
  /** indo até a bola parada e pegando do chão */
  | 'pegando'
  /** com a bola, quicando até a parada da cesta dele */
  | 'driblando'
  | 'arremessando'
  /** acabou de arremessar: espera a bola (e comemora, se entrou) */
  | 'depois'
  /** correndo de volta para defender */
  | 'voltando'
  | 'marcando';

type FaseDaBola =
  | { fase: 'chao' }
  | { fase: 'subindo'; t: number; de: THREE.Vector3 }
  | { fase: 'drible' }
  | { fase: 'na-mao' }
  | { fase: 'arco'; t: number; de: THREE.Vector3; entra: boolean; lado: number }
  | { fase: 'caindo'; t: number; abaixoDaRede: number; vy: number; quiques: number; lado: number }
  | { fase: 'rebote'; t: number; de: THREE.Vector3; lado: number }
  | { fase: 'quicando'; vy: number; quiques: number };

interface Atleta {
  quem: Quem;
  bicho: Flynn;
  estado: EstadoDoAtleta;
  /** um relógio para o que espera (a comemoração, a pegada) */
  espera: number;
  colisor: { kind: 'circle'; x: number; z: number; r: number };
}

const A = ARI.name;
const R = RENAN.name;
const F = 'Flynn';
const RC = 'Rocco';

/** uma fala, e o gesto de quem fala nela */
type Fala = readonly [string, string, ('comemora' | 'acena')?];

/** a primeira vez (rascunho meu) */
const PRIMEIRA: readonly Fala[] = [
  [F, 'Ari! Renan! Olha quem atravessou a cidade pra jogar no nosso ginásio!', 'acena'],
  [RC, 'Os motorizados! Vieram ver a raposinha perder em casa?'],
  [R, 'Vocês não eram rivais?'],
  [RC, 'Somos. Por isso mesmo. Treinar contra o melhor é o único jeito de ganhar dele.'],
  [F, 'Ele disse "o melhor"! Vocês ouviram!', 'comemora'],
  [RC, 'Falei "o melhor dos Gatitos". É diferente.'],
  [A, 'E quem tá ganhando?'],
];

/** as outras vezes, uma por vez, em roda (rascunho meu) */
const DEPOIS: ReadonlyArray<readonly Fala[]> = [
  [
    [RC, 'Os motorizados de novo. Chegaram bem na hora de me ver virar o jogo.'],
    [F, 'Virar? Você ainda nem começou a desvirar!', 'comemora'],
  ],
  [
    [F, 'O Rocco vem treinar aqui toda semana agora. Diz que é "pra estudar o adversário".'],
    [RC, 'E pra usar o bebedouro de vocês. O nosso é quente.'],
  ],
  [
    [R, 'Vocês não cansam?'],
    [RC, 'Cansar é pra quem perde. ...E eu também canso. Mas não conta pra ele.'],
  ],
  [
    [F, 'Sabiam que o Rocco me mandou um bilhete depois do último jogo? Escrito "jogou bem, raposinha".', 'comemora'],
    [RC, 'Era pra ser irônico.'],
    [F, 'Eu guardei mesmo assim!'],
  ],
];

/**
 * Monta o um contra um na quadra do treino (a mesma raia do treino do Flynn: 1,6 à frente da linha das cestas, as
 * paradas na beira do garrafão). Devolve os dois, ou `null` se o Rocco ainda não joga aqui.
 */
export function montarOUmContraUm(w: WorldBuilder, q: QuadraDoTreino): { flynn: Flynn; rocco: Rocco } | null {
  const g0 = w.game;
  if (!roccoNoGinasio(g0)) return null;

  const flynn = new Flynn({ minX: -0.2, maxX: 0.2, minZ: q.raiaZ - 0.2, maxZ: q.raiaZ + 0.2 });
  const rocco = new Rocco({ minX: -0.2, maxX: 0.2, minZ: q.raiaZ - 0.2, maxZ: q.raiaZ + 0.2 });
  const atletas: Record<Quem, Atleta> = {
    flynn: { quem: 'flynn', bicho: flynn, estado: 'driblando', espera: 0, colisor: { kind: 'circle', x: 0, z: 0, r: 0.38 } },
    rocco: { quem: 'rocco', bicho: rocco, estado: 'marcando', espera: 0, colisor: { kind: 'circle', x: 0, z: 0, r: 0.42 } },
  };
  for (const a of Object.values(atletas)) {
    a.bicho.entrarEmServico();
    a.bicho.correr(true);
    w.add(a.bicho.group);
    // eles são sólidos para a dupla, como o Flynn do treino
    w.colliders.push(a.colisor);
  }

  // ------------------------------------------------------------ os lugares
  const aroDo = (lado: number): { x: number; z: number; lado: number } => q.aros.find((a) => a.lado === lado) ?? q.aros[0];
  /**
   * ONDE QUEM ATACA PARA E ARREMESSA. Na cesta da direita, na raia do treino (1,6 à frente da linha das cestas); na
   * da ESQUERDA, espelhado para o outro lado da linha: a câmera olha de `+X/+Z`, e lá, na raia, quem marca (entre a
   * parada e o aro) ficava exatamente atrás de quem arremessa e sumia. Espelhado, os dois aparecem lado a lado na
   * tela nas duas cestas.
   */
  const parada = (lado: number): THREE.Vector3 => {
    const aro = aroDo(lado);
    return new THREE.Vector3(lado * q.pontaX, 0, lado > 0 ? q.raiaZ : 2 * aro.z - q.raiaZ);
  };
  /** da parada para o aro, no chão */
  const rumoAoAro = (lado: number): THREE.Vector3 => {
    const aro = aroDo(lado);
    const p = parada(lado);
    return new THREE.Vector3(aro.x - p.x, 0, aro.z - p.z).normalize();
  };
  /** onde quem defende marca: entre a parada e o aro, de frente para quem vem */
  const marcacao = (lado: number): THREE.Vector3 => parada(lado).addScaledVector(rumoAoAro(lado), MARCACAO);
  /** onde a bola para depois do arremesso: na frente de quem marcava */
  const repouso = (lado: number): THREE.Vector3 => marcacao(lado).addScaledVector(rumoAoAro(lado), BOLA_DEPOIS).setY(RAIO_DA_BOLA);

  // O COMEÇO: o Flynn com a bola no meio da quadra, indo para a cesta dele; o Rocco já marcando lá
  flynn.group.position.set(-1.5, 0, q.raiaZ + 0.25);
  flynn.group.rotation.y = Math.PI / 2;
  const m0 = marcacao(CESTA.flynn);
  rocco.group.position.set(m0.x, 0, m0.z);
  rocco.group.rotation.y = -Math.PI / 2;
  flynn.driblando = true;

  // ------------------------------------------------------------ a bola
  const bola = bolaDeBasquete(RAIO_DA_BOLA);
  w.add(bola);
  const raiz = bola.parent!;
  let estadoDaBola: FaseDaBola = { fase: 'drible' };
  let atacante: Quem = 'flynn';
  const tmp = new THREE.Vector3();
  /** o placar de brincadeira (só para as farpas da conversa): de dois em dois */
  const pontos: Record<Quem, number> = { flynn: 0, rocco: 0 };
  /** o sorteio do arremesso: com semente, a mesma partida em toda visita (o teste repete) */
  let semente = 20261119;
  const sorte = (): number => {
    semente = (semente * 1664525 + 1013904223) >>> 0;
    return semente / 2 ** 32;
  };
  /** o que o teste mede */
  const medidas = { cestas: { flynn: 0, rocco: 0 }, erros: 0, posses: 0, quiques: 0, menorDistancia: 99 };

  /** a dupla está perto (o som e as farpas só tocam com ela por perto) */
  const perto = (raio: number): boolean => {
    const p = g0.playerPosition();
    return Object.values(atletas).some((a) => Math.hypot(p.x - a.bicho.x, p.z - a.bicho.z) < raio);
  };
  for (const a of Object.values(atletas)) {
    a.bicho.aoQuicarODrible = () => {
      medidas.quiques++;
      if (perto(6)) g0.som('quicar');
    };
  }

  /** uma farpa no canto da tela, de vez em quando, depois de uma cesta (rascunho meu) */
  let ultimaFarpa = -99;
  let relogio = 0;
  const FARPAS: Record<Quem, readonly string[]> = {
    rocco: ['Rocco: Anota aí, raposinha!', 'Rocco: Essa foi pra você aprender.', 'Rocco: Dogão não erra duas seguidas.'],
    flynn: ['Flynn: Vão, Gatitos!', 'Flynn: Essa foi de presidente!', 'Flynn: Desculpa, Rocco! ...Mentira, não desculpa.'],
  };
  const farpa = (quem: Quem): void => {
    if (relogio - ultimaFarpa < 14 || !perto(10) || g0.emDialogo() || sorte() > 0.55) return;
    ultimaFarpa = relogio;
    const lista = FARPAS[quem];
    g0.toast(lista[Math.floor(sorte() * lista.length)], quem === 'flynn' ? '🦊' : '🐺');
  };

  // ------------------------------------------------------------ a dupla no caminho
  /** alguém da dupla está na frente dele, perto, no caminho até o alvo? (ele espera: os dois são educados) */
  const barrado = (b: Flynn, alvo: THREE.Vector3): boolean => {
    const dx = alvo.x - b.x;
    const dz = alvo.z - b.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.01) return false;
    const ux = dx / dist;
    const uz = dz / dist;
    for (const p of [g0.playerPosition(), g0.companionPosition()]) {
      const px = p.x - b.x;
      const pz = p.z - b.z;
      const frente = px * ux + pz * uz;
      const lado = Math.abs(px * uz - pz * ux);
      if (frente > 0 && frente < Math.min(1.5, dist + 0.6) && lado < 0.8) return true;
    }
    return false;
  };
  /** o quadro de agora (o `ir` conta quanto tempo cada um esperou a dupla) */
  let dtAgora = 0;
  /** o desvio de quem cansou de esperar a dupla sair da frente, e quanto tempo já esperou */
  const desvios = new Map<Flynn, THREE.Vector3>();
  const esperando = new Map<Flynn, number>();
  /**
   * Anda até o alvo; devolve se chegou. Com a dupla na frente ele ESPERA (os dois são educados) — e se ela não sai em
   * um segundo, CONTORNA: um ponto 1,3 para o lado contrário de quem está no caminho, e dali segue. Sem isso, a dupla
   * parada onde a conversa a deixou travava o jogo inteiro.
   */
  const ir = (b: Flynn, alvo: THREE.Vector3, velocidade: number, chegou = 0.12): boolean => {
    if (Math.hypot(alvo.x - b.x, alvo.z - b.z) < chegou) {
      b.entrarEmServico();
      desvios.delete(b);
      esperando.delete(b);
      return true;
    }
    const desvio = desvios.get(b);
    if (desvio) {
      if (Math.hypot(desvio.x - b.x, desvio.z - b.z) < 0.2) desvios.delete(b);
      else {
        b.seguir(desvio.x, desvio.z, velocidade);
        return false;
      }
    }
    if (barrado(b, alvo)) {
      b.entrarEmServico();
      const ja = (esperando.get(b) ?? 0) + dtAgora;
      esperando.set(b, ja);
      if (ja > 1) {
        esperando.delete(b);
        const dist = Math.hypot(alvo.x - b.x, alvo.z - b.z);
        const ux = (alvo.x - b.x) / dist;
        const uz = (alvo.z - b.z) / dist;
        // de que lado do caminho está quem barra? o desvio vai pelo outro
        const p = [g0.playerPosition(), g0.companionPosition()]
          .sort((a, c) => Math.hypot(a.x - b.x, a.z - b.z) - Math.hypot(c.x - b.x, c.z - b.z))[0];
        const lado = Math.sign((p.x - b.x) * uz - (p.z - b.z) * ux) || 1;
        const d = new THREE.Vector3(b.x + ux * 1.1 + uz * lado * 1.3, 0, b.z + uz * 1.1 - ux * lado * 1.3);
        // (dentro da quadra)
        d.x = THREE.MathUtils.clamp(d.x, -10.3, 10.3);
        d.z = THREE.MathUtils.clamp(d.z, -6, 5);
        desvios.set(b, d);
      }
      return false;
    }
    esperando.delete(b);
    b.seguir(alvo.x, alvo.z, velocidade);
    return false;
  };

  // ------------------------------------------------------------ a conversa: pausa num ponto seguro
  let pausado = false;
  let pedidoDePausa: (() => void) | null = null;
  /** gancho de teste: segura o jogo (para fotografar parado) */
  let ligado = true;
  /** quem dribla está parado esperando a dupla sair da frente */
  let driblandoParado = false;
  /**
   * É um bom momento para parar? Ninguém no meio de um arremesso, e os dois PERTO um do outro (a conversa é com os
   * dois): a bola no chão depois da cesta, ou quem dribla já chegando na marcação (ou parado esperando a dupla).
   */
  const pontoSeguro = (): boolean => estadoDaBola.fase === 'chao'
    || (estadoDaBola.fase === 'drible' && (driblandoParado || Math.hypot(flynn.x - rocco.x, flynn.z - rocco.z) < 3.2));

  // ------------------------------------------------------------ o jogo, quadro a quadro
  const passoDoAtacante = (a: Atleta, lado: number): void => {
    const b = a.bicho;
    if (a.estado === 'pegando') {
      // até a bola: ela espera BOLA_A_FRENTE dos pés, como no treino
      const r = repouso(-lado);
      const pegada = r.clone().addScaledVector(rumoAoAro(-lado), -0.4).setY(0);
      if (a.espera <= 0) {
        if (!ir(b, pegada, 2.4, 0.1)) return;
        b.encarar(r.x, r.z);
        b.pegarDoChao();
        a.espera = 1;
        return;
      }
      const t = b.tempoNoArremesso;
      if (estadoDaBola.fase === 'chao' && t >= ARREMESSO.PEGA - 0.14) {
        estadoDaBola = { fase: 'subindo', t: 0, de: bola.position.clone() };
      }
      if (!b.estaArremessando && estadoDaBola.fase !== 'chao' && estadoDaBola.fase !== 'subindo') {
        // a bola no peito: vira para a cesta dele e sai quicando
        b.pararDeEncarar();
        b.driblando = true;
        // (sai da mão: no drible, quem põe a bola a cada quadro é a pata)
        raiz.attach(bola);
        estadoDaBola = { fase: 'drible' };
        a.estado = 'driblando';
        a.espera = 0;
      }
      return;
    }
    if (a.estado === 'driblando') {
      const p = parada(lado);
      // reto até a parada, gingando de um lado para o outro (um ponto 1,5 adiante, puxado para o lado)
      const dx = p.x - b.x;
      const dz = p.z - b.z;
      const falta = Math.hypot(dx, dz);
      const ginga = Math.sin(relogio * 2.3) * 0.32;
      const alvo = falta > 1.2
        ? new THREE.Vector3(b.x + (dx / falta) * 1.5 - (dz / falta) * ginga, 0, b.z + (dz / falta) * 1.5 + (dx / falta) * ginga)
        : p;
      const chegou = ir(b, alvo, VELOCIDADE_DO_DRIBLE, falta > 1.2 ? 0 : 0.12);
      driblandoParado = !chegou && barrado(b, alvo);
      if (!chegou) return;
      // chegou: junta a bola e arremessa
      const aro = aroDo(lado);
      b.encarar(aro.x, aro.z);
      b.driblando = false;
      b.arremessarDaMao();
      b.maoDaBola.attach(bola);
      bola.position.set(0, 0, 0);
      estadoDaBola = { fase: 'na-mao' };
      a.estado = 'arremessando';
      return;
    }
    if (a.estado === 'arremessando') {
      if (estadoDaBola.fase === 'na-mao' && b.tempoNoArremesso >= ARREMESSO.SOLTA) {
        raiz.attach(bola);
        // quem está atrás acerta um tico mais (o jogo fica apertado)
        const diferenca = pontos[a.quem] - pontos[outro(a.quem)];
        const chance = CHANCE_DE_CESTA + (diferenca <= -4 ? 0.15 : diferenca >= 4 ? -0.15 : 0);
        estadoDaBola = { fase: 'arco', t: 0, de: bola.position.clone(), entra: sorte() < chance, lado };
        g0.som('lancar');
        // quem marca pula com os braços para cima
        atletas[outro(a.quem)].bicho.comemorar(0.55);
      }
      if (!b.estaArremessando) {
        a.estado = 'depois';
        a.espera = 0;
      }
    }
  };

  const passoDoDefensor = (a: Atleta, lado: number, dt: number): void => {
    const b = a.bicho;
    const m = marcacao(lado);
    if (a.estado === 'voltando') {
      // corre de volta por trás da raia do drible, e chega bem antes
      b.marcando = 0;
      if (!ir(b, m, VELOCIDADE_DA_CORRIDA, 0.15)) return;
      a.estado = 'marcando';
    }
    if (a.estado === 'marcando') {
      // de frente para quem vem, braços abertos, gingando junto com ele
      const atac = atletas[outro(a.quem)].bicho;
      b.encarar(atac.x, atac.z);
      b.marcando = Math.min(1, b.marcando + dt * 3);
      // (a ginga é um deslize curtinho, sem andar: andando, o bicho vira para onde anda e marcaria de lado)
      const espelho = Math.sin(relogio * 2.3) * 0.1;
      const k = Math.min(1, dt * 4);
      b.group.position.x += (m.x - b.group.position.x) * k;
      b.group.position.z += (m.z + espelho - b.group.position.z) * k;
    }
  };

  /** a posse troca: quem marcava pega a bola; quem arremessou volta para defender a cesta do outro */
  const trocarAPosse = (): void => {
    const velho = atletas[atacante];
    const novo = atletas[outro(atacante)];
    atacante = novo.quem;
    medidas.posses++;
    novo.bicho.marcando = 0;
    novo.bicho.entrarEmServico();
    novo.estado = 'pegando';
    novo.espera = 0;
    velho.estado = 'voltando';
    velho.bicho.pararDeEncarar();
  };

  const moverBola = (dt: number): void => {
    const e = estadoDaBola;
    if (e.fase === 'drible') {
      atletas[atacante].bicho.bolaDoDrible(RAIO_DA_BOLA, bola.position);
      bola.rotation.x += dt * 5;
      return;
    }
    if (e.fase === 'subindo') {
      e.t = Math.min(1, e.t + dt / 0.14);
      const b = atletas[atacante].bicho;
      b.maoDaBola.getWorldPosition(tmp);
      bola.position.lerpVectors(e.de, tmp, e.t);
      if (e.t >= 1) {
        b.maoDaBola.attach(bola);
        bola.position.set(0, 0, 0);
        estadoDaBola = { fase: 'na-mao' };
      }
      return;
    }
    if (e.fase === 'na-mao' || e.fase === 'chao') return;
    if (e.fase === 'arco') {
      // da mão ao aro, num arco alto; a que não entra mira a frente do aro e bate nele
      e.t = Math.min(1, e.t + dt / 0.8);
      const aro = aroDo(e.lado);
      const volta = rumoAoAro(e.lado).multiplyScalar(e.entra ? 0 : -0.2);
      const alvo = tmp.set(aro.x + volta.x, q.aroY + (e.entra ? 0.14 : 0.06), aro.z + volta.z);
      bola.position.lerpVectors(e.de, alvo, e.t);
      bola.position.y += 1.1 * 4 * e.t * (1 - e.t);
      bola.rotation.z -= dt * 9 * e.lado;
      if (e.t >= 1) {
        const quem = atacante;
        if (e.entra) {
          pontos[quem] += 2;
          medidas.cestas[quem]++;
          if (perto(12)) g0.som('pegar');
          atletas[quem].bicho.comemorar(1.3);
          farpa(quem);
          estadoDaBola = { fase: 'caindo', t: 0, abaixoDaRede: -1, vy: -1.2, quiques: 0, lado: e.lado };
        } else {
          medidas.erros++;
          if (perto(12)) g0.som('quicar');
          estadoDaBola = { fase: 'rebote', t: 0, de: bola.position.clone(), lado: e.lado };
        }
      }
      return;
    }
    if (e.fase === 'rebote') {
      // bate no aro e espirra de volta para a quadra, até a frente de quem marcava
      e.t = Math.min(1, e.t + dt / 0.75);
      const ate = repouso(e.lado);
      bola.position.lerpVectors(e.de, ate, e.t);
      bola.position.y += 0.9 * 4 * e.t * (1 - e.t);
      bola.rotation.x += dt * 7;
      if (e.t >= 1) {
        bola.position.copy(ate);
        if (perto(10)) g0.som('quicar');
        estadoDaBola = { fase: 'quicando', vy: 2.2, quiques: 1 };
      }
      return;
    }
    if (e.fase === 'quicando') {
      e.vy -= 9.8 * dt;
      bola.position.y += e.vy * dt;
      if (bola.position.y < RAIO_DA_BOLA) {
        bola.position.y = RAIO_DA_BOLA;
        if (e.vy < -0.9 && e.quiques < 4) {
          e.vy = -e.vy * 0.5;
          e.quiques++;
          if (e.quiques <= 2 && perto(10)) g0.som('quicar');
        } else {
          estadoDaBola = { fase: 'chao' };
        }
      }
      return;
    }
    // caindo pela rede: reto; abaixo dela, rola até a frente de quem marcava enquanto quica
    e.t += dt;
    e.vy -= 9.8 * dt;
    bola.position.y += e.vy * dt;
    const aro = aroDo(e.lado);
    const ate = repouso(e.lado);
    if (e.abaixoDaRede < 0 && bola.position.y < q.aroY - 0.5) e.abaixoDaRede = e.t;
    if (e.abaixoDaRede >= 0) {
      const ida = 1 - Math.exp(-2.2 * (e.t - e.abaixoDaRede));
      const antes = tmp.set(bola.position.x, 0, bola.position.z);
      bola.position.x = aro.x + (ate.x - aro.x) * ida;
      bola.position.z = aro.z + (ate.z - aro.z) * ida;
      bola.rotation.z -= (bola.position.x - antes.x) / RAIO_DA_BOLA;
      bola.rotation.x += (bola.position.z - antes.z) / RAIO_DA_BOLA;
    }
    if (bola.position.y < RAIO_DA_BOLA) {
      bola.position.y = RAIO_DA_BOLA;
      if (Math.abs(e.vy) > 0.9 && e.quiques < 4) {
        e.vy = -e.vy * 0.55;
        e.quiques++;
        if (e.quiques <= 2 && perto(10)) g0.som('quicar');
      } else {
        e.vy = 0;
      }
    }
    if (e.vy === 0 && e.abaixoDaRede >= 0 && e.t - e.abaixoDaRede > 1.3) {
      bola.position.copy(ate);
      estadoDaBola = { fase: 'chao' };
    }
  };

  const passo = (dt: number): void => {
    if (pedidoDePausa && pontoSeguro()) {
      pausado = true;
      for (const a of Object.values(atletas)) {
        a.bicho.entrarEmServico();
        a.bicho.marcando = 0;
      }
      const pronto = pedidoDePausa;
      pedidoDePausa = null;
      pronto();
    }
    if (pausado || !ligado) return;
    const atac = atletas[atacante];
    const def = atletas[outro(atacante)];
    const lado = CESTA[atacante];
    passoDoAtacante(atac, lado);
    if (atac.estado === 'depois') {
      // a bola parou no chão: a posse troca
      if (estadoDaBola.fase === 'chao') trocarAPosse();
    } else {
      passoDoDefensor(def, lado, dt);
    }
    // quem arremessou e ficou esperando a bola: comemora (se entrou) parado; quem volta, corre
    for (const a of Object.values(atletas)) {
      if (a.estado === 'voltando' && a.quem !== atacante) passoDoDefensor(a, CESTA[atacante], dt);
    }
  };

  // ------------------------------------------------------------ conversar com os dois
  const meioDosDois = (): { x: number; z: number } => ({ x: (flynn.x + rocco.x) / 2, z: (flynn.z + rocco.z) / 2 });
  /** quem está mais perto de quem joga (é nele que mora o balão da conversa) */
  const maisPerto = (): { x: number; z: number } => {
    const p = g0.playerPosition();
    return Math.hypot(p.x - flynn.x, p.z - flynn.z) < Math.hypot(p.x - rocco.x, p.z - rocco.z)
      ? { x: flynn.x, z: flynn.z } : { x: rocco.x, z: rocco.z };
  };
  const foco = new THREE.Object3D();
  w.root.add(foco);
  const ponto = w.interact({
    id: 'ginasio:um-contra-um',
    x: 0, z: q.raiaZ, radius: 1.5,
    label: 'Falar com o Flynn e o Rocco', icon: '🏀',
    highlight: rocco.group,
    // (abaixo do "Arremessar a bola" da dupla: os dois passam correndo pelas marcas do lance livre)
    priority: -1,
    onInteract: async (g) => {
      g.lockPlayer(true);
      await new Promise<void>((pronto) => {
        if (pausado) return pronto();
        pedidoDePausa = pronto;
      });
      // quem está com a bola segue quicando no lugar: a bola não fica parada no ar
      const comABola = atletas[atacante];
      if (estadoDaBola.fase === 'drible') comABola.bicho.driblando = true;
      // (perto um do outro, a conversa é no meio dos dois; se a dupla barrou quem dribla longe, é com quem está perto)
      const juntos = Math.hypot(flynn.x - rocco.x, flynn.z - rocco.z) < 4;
      const m = juntos ? meioDosDois() : maisPerto();
      // (a dupla DE LADO na tela — na frente dos dois, o cabelo do Ari tapava o Flynn —, do lado do meio da quadra: na
      // cesta da direita, à direita deles ela ia parar embaixo da tabela)
      const meio = posicionarParaConversar(g, m, m.x > 0 ? -2.2 : 1.5, 1.0);
      foco.position.set(m.x, 1.0, m.z);
      for (const a of Object.values(atletas)) a.bicho.encarar(meio.x, meio.z);
      g.focusCamera(foco);
      g.setZoom(8);
      const falar = async (falas: readonly Fala[]): Promise<void> => {
        for (const [quem, texto, gesto] of falas) {
          const bicho = quem === F ? flynn : quem === RC ? rocco : null;
          if (bicho && gesto === 'comemora') bicho.comemorar(1.6);
          if (bicho && gesto === 'acena') bicho.acenar(1.8);
          await g.say([texto], quem);
        }
      };
      try {
        if (!g.temMemoria(MEMORIA_DO_UM_CONTRA_UM)) {
          await falar(PRIMEIRA);
          // quem está ganhando: cada um conta do seu jeito
          const [f, r] = [pontos.flynn, pontos.rocco];
          if (f === r) await falar([[RC, `Tá ${r} a ${f}. Empatado. Por enquanto.`], [F, 'Por enquanto mesmo! Vão, Gatitos!', 'comemora']]);
          else if (r > f) await falar([[RC, `${r} a ${f} pra mim. Mas pode contar pra todo mundo, eu não ligo.`], [F, 'O jogo só acaba quando acaba!']]);
          else await falar([[F, `${f} a ${r} pra mim!`, 'comemora'], [RC, 'Eu tô deixando. É estratégia.']]);
          rocco.acenar(1.6);
          await falar([[RC, 'Agora, se me dão licença, essa raposa me deve uma revanche.']]);
          g.som('apito');
          g.unlock({
            id: MEMORIA_DO_UM_CONTRA_UM,
            title: 'Um contra um',
            place: 'Ginásio da Escola do Gatito',
            note: 'O Rocco atravessou a cidade e foi parar no ginásio dos Gatitos, jogando um contra um com o Flynn: cada um atacando uma cesta, os dois se provocando a cada ponto. Rivais, sim — mas foi o Rocco quem veio treinar com ele.',
            icon: '🏀',
          });
          // (a primeira conversa do Flynn no ginásio fica contada: ele não repete a de quando treinava sozinho)
          g.setFlag('flynn-treinando');
          return;
        }
        const vez = g.bump('um-contra-um.conversas');
        await falar(DEPOIS[(vez - 1) % DEPOIS.length]);
      } finally {
        g.focusCamera(null);
        g.setZoom(13);
        soltarDaConversa(g);
        for (const a of Object.values(atletas)) a.bicho.pararDeEncarar();
        pausado = false;
        // de volta ao jogo de onde parou (quem marcava volta à marcação)
        for (const a of Object.values(atletas)) {
          if (a.quem !== atacante && a.estado === 'marcando') a.bicho.marcando = 0.5;
        }
      }
    },
  });

  // gancho de teste (o `scripts/rocco.mjs`, parte do ginásio): a chave é `rocco`, e não `flynn` — os testes do Flynn
  // acham o Flynn do treino pela primeira peça com `teste.flynn`
  rocco.group.userData.teste = {
    rocco,
    umContraUm: {
      flynn,
      rocco,
      get atacante(): Quem {
        return atacante;
      },
      get bola(): string {
        return estadoDaBola.fase;
      },
      get pausado(): boolean {
        return pausado;
      },
      get pontos(): Record<Quem, number> {
        return { ...pontos };
      },
      estados: () => ({ flynn: atletas.flynn.estado, rocco: atletas.rocco.estado }),
      medidas,
      posicaoDaBola: () => bola.getWorldPosition(new THREE.Vector3()),
      ligar: (sim: boolean) => {
        ligado = sim;
        if (!sim) for (const a of Object.values(atletas)) a.bicho.entrarEmServico();
      },
    },
  };

  w.onUpdate((dt) => {
    relogio += dt;
    dtAgora = dt;
    passo(dt);
    flynn.update(dt);
    rocco.update(dt);
    moverBola(dt);
    medidas.menorDistancia = Math.min(medidas.menorDistancia, Math.hypot(flynn.x - rocco.x, flynn.z - rocco.z));
    for (const a of Object.values(atletas)) {
      a.colisor.x = a.bicho.x;
      a.colisor.z = a.bicho.z;
    }
    const m = maisPerto();
    ponto.moveTo(m.x, m.z);
  });
  return { flynn, rocco };
}
