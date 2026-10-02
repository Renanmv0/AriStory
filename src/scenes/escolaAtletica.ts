import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { bolaDeBasquete } from '../world/furniture';
import { ARI, RENAN } from '../characters/cast';
import { ARREMESSO, Flynn } from '../entities/bichos/Flynn';
import { conversa, posicionarParaConversar, soltarDaConversa } from './escolaComum';
import { moduloDoisComecou } from './escolaAula';

/**
 * =============================================== A ATLÉTICA DOS GATITOS
 *
 * O FLYNN, a raposa presidente da atlética (pedido do Renan): o primeiro
 * atleta da escola. Até o Módulo 1 terminar ele mora no REFEITÓRIO, para a
 * dupla conhecer — anda pelo corredor do meio, entre as duas colunas de mesas
 * (é elétrico: para pouco em cada canto), e quem chega perto pode conversar.
 *
 * QUANDO O MÓDULO 2 COMEÇA ele muda para o GINÁSIO (pedido do Renan): fica no
 * meio da quadra TREINANDO — corre de uma ponta à outra, pega a bola, arremessa
 * na cesta, vira de costas e atravessa a quadra inteira de novo, bem rápido,
 * "para mostrar que ele é o presidente por um bom motivo". As coelhinhas
 * cedem o meio da quadra para ele e ensaiam na lateral (`escolaGinasio.ts`).
 *
 * O JEITO DELE: o mais animado da escola quando o assunto é esporte — fala
 * do jogo, do time, do recorde da Sol, do treino de madrugada —, e ao mesmo
 * tempo o mais RESPEITOSO. Convida sem forçar ("sem pressão nenhuma"), acha
 * lugar para todo mundo no time, comemora a vitória dos outros, dá os
 * parabéns ao time que ganhou dele, e trata perder como aprender. Lembra o
 * nome de todo mundo. É o capitão que puxa o time para cima sorrindo.
 *
 * AS FALAS SÃO RASCUNHO MEU, no jeito que o Renan descreveu; quando ele
 * mandar falas de verdade, elas entram aqui literais.
 *
 * Na conversa ele ACENA ao ver a dupla chegar e COMEMORA nas falas de
 * "vão, Gatitos!" (`Flynn.acenar`, `Flynn.comemorar`). O barulho dele é o
 * APITO, uma vez, no fim da apresentação.
 */

/**
 * ONDE ELE MORA: no ginásio depois que o Módulo 2 começou (a lição 7 chamada,
 * aberta ou feita) — e a festa da torcida já passou, que é a primeira coisa
 * que o ginásio faz com o Módulo 1 terminado, e ela é das coelhinhas no meio
 * da quadra. Antes disso, no refeitório.
 */
export function flynnNoGinasio(g: GameAPI): boolean {
  return g.flag('festa-da-torcida') && moduloDoisComecou(g);
}

/** o retângulo do refeitório (o mesmo de `escola.ts`) */
export interface Refeitorio {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

const F = 'Flynn';
const A = ARI.name;
const R = RENAN.name;

/** uma fala, e se ele comemora nela */
type Fala = readonly [string, string, 'comemora'?];

/** A APRESENTAÇÃO, na primeira conversa */
const APRESENTACAO: readonly Fala[] = [
  [F, 'Ei! Oi, oi! Vocês são os alunos novos do professor Gatito, né? O Ari e o Renan!'],
  [A, 'Como você sabe o nosso nome?'],
  [F, 'A Luna fala de vocês o tempo todo! Ah, desculpa, eu nem me apresentei.'],
  [F, 'Eu sou o Flynn, presidente da Atlética dos Gatitos! Prazer. Prazer mesmo.'],
  [F, 'Basquete, vôlei, futebol, corrida... Se tem bola ou linha de chegada, a gente tem time. E se não tem, a gente inventa um!', 'comemora'],
  [R, 'E você joga tudo isso?'],
  [F, 'Jogo, treino, organizo, carrego os cones... Presidente faz um pouco de tudo. E eu adoro cada pedacinho.'],
  [F, 'Ó, sem pressão nenhuma, tá? Mas se um dia vocês quiserem jogar com a gente, a porta do ginásio tá sempre aberta.'],
  [A, 'Eu não sou muito bom em esporte...'],
  [F, 'Ninguém nasce bom! O que conta é aparecer, se divertir e voltar na semana seguinte. O resto, o treino resolve.'],
  [F, 'E o Renan também, claro. Dois é sempre melhor que um: é matemática de time.'],
  [R, 'Gostei dele.'],
  [F, 'Bem-vindos à família dos Gatitos! Vão, Gatitos!', 'comemora'],
];

/** AS CONVERSAS DE DEPOIS, uma por vez, em roda */
const CONVERSAS: ReadonlyArray<readonly Fala[]> = [
  [[F, 'Oi de novo! Já beberam água hoje? A Estrella me ensinou: antes, durante e depois do treino.']],
  [[F, 'Sabiam que a Sol bateu o recorde de salto da escola? Duas vezes! Na mesma tarde! Eu quase chorei de orgulho.', 'comemora']],
  [
    [F, 'A gente perdeu o último jogo de vôlei por dois pontinhos. Foi o melhor jogo do ano!'],
    [F, 'O outro time jogou demais. No fim eu fui lá dar os parabéns pra cada um deles.'],
    [R, 'Perdeu e ficou feliz?'],
    [F, 'Perder pra um time desses é aprender de graça. Na próxima a gente volta mais forte!'],
  ],
  [[F, 'Eu acordo cedinho pra correr no Villa Lobos. O nascer do sol lá é campeão. Se um dia quiserem ir junto, eu levo água pros três!']],
  [[F, 'Essa bandana? Foi a primeira coisa que eu ganhei nos Gatitos. Enquanto eu tô com ela, eu dou o meu melhor. Hoje, amanhã e no jogo de sexta.']],
  [
    [F, 'Esporte não é só sobre ganhar. Quer dizer... ganhar é ÓTIMO.'],
    [F, 'Mas é sobre o time. Sobre isso aqui, ó: a gente junto.', 'comemora'],
  ],
  [[F, 'Se o basquete não for a de vocês, tudo bem! Tem corrida, tem vôlei, tem xadrez, tem torcida. Todo mundo tem lugar nos Gatitos.']],
  [
    [F, 'Ari, como tá indo a aula do professor Gatito? ...Não precisa responder: você tem cara de quem tira três estrelinhas.'],
    [A, 'Às vezes duas.'],
    [F, 'Duas estrelinhas e vontade de voltar? Isso é atitude de campeão!', 'comemora'],
  ],
];

/** a primeira conversa no ginásio, já treinando */
const NO_GINASIO: readonly Fala[] = [
  [F, 'Ari! Renan! Vieram me ver treinar? Começou o Módulo 2 de vocês, começou a temporada pra mim!', 'comemora'],
  [F, 'As meninas me emprestaram o meio da quadra. Elas ensaiam ali na lateral, e eu corro de uma cesta até a outra.'],
  [R, 'E você não cansa?'],
  [F, 'Canso! Mas aí eu lembro que presidente tem que dar o exemplo... e corro mais uma.'],
  [F, 'Se quiserem arremessar também, fiquem à vontade. Eu desvio de vocês, prometo!'],
];

/** depois da festa da torcida, ele também viu a coreografia */
const DEPOIS_DA_FESTA: readonly Fala[] = [
  [F, 'Vocês viram a coreografia das meninas? Eu assisti da arquibancada e aplaudi tanto que a pata ficou dormente!', 'comemora'],
];

/** como a conversa para e devolve ele, em cada lugar */
interface LugarDaConversa {
  /** o lugar, na memória da apresentação */
  nome: string;
  /** tira ele do que está fazendo; resolve quando ele está parado, pronto para conversar */
  parar: () => Promise<void>;
  /** devolve ele para o passeio, ou para o treino */
  soltar: () => void;
  /** no ginásio, a primeira conversa depois de conhecer é sobre o treino */
  noGinasio: boolean;
  /**
   * onde a dupla para na conversa (`posicionarParaConversar`: para a direita
   * da tela e para a câmera). No ginásio, do lado da câmera: no lugar de
   * sempre, à direita, ela ficava na raia dele, e ele (respeitoso) esperava.
   */
  lado?: number;
  frente?: number;
}

/**
 * A CONVERSA, nos dois lugares: o ponto que anda com ele, o colisor que
 * anda com ele, o aceno, a apresentação e as conversas de depois.
 */
function ligarAConversa(w: WorldBuilder, flynn: Flynn, lugar: LugarDaConversa): void {
  // ele é sólido para a dupla, como as coelhinhas no ginásio
  const colisor = { kind: 'circle' as const, x: flynn.x, z: flynn.z, r: 0.38 };
  w.colliders.push(colisor);

  const falar = async (g: GameAPI, falas: readonly Fala[]): Promise<void> => {
    for (const [quem, texto, gesto] of falas) {
      if (gesto === 'comemora') flynn.comemorar(2);
      await conversa(g, [[quem, texto]]);
    }
  };

  const ponto = w.interact({
    id: 'escola:flynn',
    x: flynn.x, z: flynn.z, radius: 1.3,
    label: 'Falar com o Flynn', icon: '🦊',
    highlight: flynn.group,
    onInteract: async (g) => {
      g.lockPlayer(true);
      await lugar.parar();
      const meio = posicionarParaConversar(g, { x: flynn.x, z: flynn.z }, lugar.lado, lugar.frente);
      flynn.encarar(meio.x, meio.z);
      flynn.acenar(2.2);
      g.focusCamera(flynn.group);
      g.setZoom(8);
      try {
        if (!g.flag('flynn-conhecido')) {
          await falar(g, APRESENTACAO);
          g.som('apito');
          g.setFlag('flynn-conhecido');
          if (lugar.noGinasio) g.setFlag('flynn-treinando');
          g.unlock({
            id: 'o-presidente-da-atletica',
            title: 'O presidente da atlética',
            place: lugar.nome,
            note: 'Uma raposa de bandana dos Gatitos, presidente da atlética, que já sabia o nosso nome antes de a gente se apresentar. Convidou a gente pra jogar — "sem pressão nenhuma", ele fez questão de dizer.',
            icon: '🦊',
          });
          g.toast('Flynn, o presidente da atlética dos Gatitos', '🦊');
          return;
        }
        // a primeira vez no ginásio, ele conta do treino
        if (lugar.noGinasio && !g.flag('flynn-treinando')) {
          g.setFlag('flynn-treinando');
          await falar(g, NO_GINASIO);
          return;
        }
        const vez = g.bump('flynn.conversas');
        // depois da festa, a primeira conversa é sobre ela
        if (g.flag('festa-da-torcida') && !g.flag('flynn-viu-a-festa')) {
          g.setFlag('flynn-viu-a-festa');
          await falar(g, DEPOIS_DA_FESTA);
          return;
        }
        await falar(g, CONVERSAS[(vez - 1) % CONVERSAS.length]);
      } finally {
        g.focusCamera(null);
        g.setZoom(13);
        soltarDaConversa(g);
        flynn.pararDeEncarar();
        lugar.soltar();
      }
    },
  });

  w.onUpdate(() => {
    ponto.moveTo(flynn.x, flynn.z);
    colisor.x = flynn.x;
    colisor.z = flynn.z;
  });
}

/**
 * Põe o Flynn no refeitório: o passeio pelo corredor do meio, o colisor que
 * anda com ele, e a conversa. Com o Módulo 2 começado ele está no ginásio, e
 * aqui não põe nada (`null`).
 */
export function montarOFlynn(w: WorldBuilder, r: Refeitorio): Flynn | null {
  if (flynnNoGinasio(w.game)) return null;
  /*
   * A ÁREA é o corredor entre as duas colunas de mesas (as da esquerda vão
   * até x = -29,3; as da direita começam em -24,2), da frente do balcão até
   * perto da parede de baixo. Nenhuma mesa dentro dela: ele passeia sem
   * `proibido`. O Gatito cruza esse corredor na ronda dele (z = 0) — os dois
   * se cruzam, e ninguém trava ninguém.
   */
  const flynn = new Flynn({ minX: -28.6, maxX: -24.9, minZ: r.z0 + 3, maxZ: r.z1 - 1.5 });
  flynn.group.position.set(-26.7, 0, 1.6);
  flynn.group.rotation.y = Math.PI / 4;
  w.add(flynn.group);

  /** gancho de teste: o `scripts/flynn.mjs` mede ele e segura o passeio para fotografar */
  flynn.group.userData.teste = { flynn };

  ligarAConversa(w, flynn, {
    nome: 'Refeitório da Escola do Gatito',
    noGinasio: false,
    parar: async () => flynn.entrarEmServico(),
    soltar: () => flynn.voltarAPassear(),
  });
  w.onUpdate((dt) => flynn.update(dt));
  return flynn;
}

// ===================================================== O TREINO NO GINÁSIO

/** a quadra, como o ginásio a desenhou */
export interface QuadraDoTreino {
  /** as duas cestas: onde fica o aro, e o lado (-1 a da esquerda, 1 a da direita) */
  aros: ReadonlyArray<{ x: number; z: number; lado: number }>;
  /** a altura do aro */
  aroY: number;
  /** a raia por onde ele corre (o `z`) */
  raiaZ: number;
  /** onde ele para em cada ponta para pegar a bola (o `|x|`) */
  pontaX: number;
}

/** bem rápido: a dupla anda a 4,4 */
const VELOCIDADE_DA_CORRIDA = 6.2;
/** o raio da bola, e o quanto à frente dos pés dele ela espera no chão (o alcance da pata dobrado) */
const RAIO_DA_BOLA = 0.12;
const BOLA_A_FRENTE = 0.4;

type FaseDaBola =
  | { fase: 'parada' }
  | { fase: 'subindo'; t: number; de: THREE.Vector3 }
  | { fase: 'na-mao' }
  | { fase: 'arco'; t: number; de: THREE.Vector3 }
  | { fase: 'caindo'; t: number; abaixoDaRede: number; vy: number; quiques: number };

interface BolaDoTreino {
  malha: THREE.Group;
  aro: { x: number; z: number; lado: number };
  /** onde ela descansa, esperando ele voltar */
  repouso: THREE.Vector3;
  estado: FaseDaBola;
}

/**
 * O FLYNN TREINANDO NO MEIO DA QUADRA (pedido do Renan): corre até uma
 * ponta, pega a bola que está ali no chão e arremessa na cesta; vira de
 * costas, atravessa a quadra inteira correndo, faz o mesmo na outra cesta, e
 * volta. Bem rápido — mais rápido que a dupla.
 *
 * DUAS BOLAS, uma em cada ponta: a que ele arremessa cai pela rede, quica e
 * rola de volta para o lugar de onde ele a pegou — e espera lá até ele voltar.
 *
 * Ele corre por uma RAIA um pouco à frente do meio da quadra, e não pela
 * linha das cestas: lá ficam as marcas do lance livre, que são da dupla. E se a
 * dupla parar na frente dele, ele ESPERA (é o mais respeitoso da escola); se
 * ela não sai, ele vira e vai treinar na outra cesta.
 *
 * Na conversa ele termina o arremesso que estava fazendo, para onde está, e
 * depois volta ao treino de onde parou.
 */
export function montarOTreinoDoFlynn(w: WorldBuilder, q: QuadraDoTreino): Flynn | null {
  const g0 = w.game;
  if (!flynnNoGinasio(g0)) return null;

  const flynn = new Flynn({ minX: -0.2, maxX: 0.2, minZ: q.raiaZ - 0.2, maxZ: q.raiaZ + 0.2 });
  flynn.entrarEmServico();
  flynn.correr(true);
  flynn.group.position.set(0, 0, q.raiaZ);
  flynn.group.rotation.y = -Math.PI / 2;
  w.add(flynn.group);

  /** onde ele para em cada ponta, e para onde ele olha para arremessar */
  const parada = (lado: number): THREE.Vector3 => new THREE.Vector3(lado * q.pontaX, 0, q.raiaZ);
  const aroDo = (lado: number): { x: number; z: number; lado: number } => q.aros.find((a) => a.lado === lado) ?? q.aros[0];

  // ------------------------------------------------------------ as duas bolas
  const bolas = new Map<number, BolaDoTreino>();
  for (const lado of [-1, 1]) {
    const aro = aroDo(lado);
    const p = parada(lado);
    const d = new THREE.Vector3(aro.x - p.x, 0, aro.z - p.z).normalize();
    const repouso = new THREE.Vector3(p.x + d.x * BOLA_A_FRENTE, RAIO_DA_BOLA, p.z + d.z * BOLA_A_FRENTE);
    const malha = bolaDeBasquete(RAIO_DA_BOLA);
    malha.position.copy(repouso);
    w.add(malha);
    bolas.set(lado, { malha, aro, repouso, estado: { fase: 'parada' } });
  }
  const raiz = bolas.get(1)!.malha.parent!;
  const tmp = new THREE.Vector3();
  /** o que o teste mede: quantas cestas, e a maior velocidade da corrida */
  let cestas = 0;
  let maiorVelocidade = 0;

  const moverBola = (b: BolaDoTreino, dt: number): void => {
    const e = b.estado;
    const m = b.malha;
    if (e.fase === 'subindo') {
      // do chão até as patas, no fundo da dobra
      e.t = Math.min(1, e.t + dt / 0.14);
      flynn.maoDaBola.getWorldPosition(tmp);
      m.position.lerpVectors(e.de, tmp, e.t);
      if (e.t >= 1) {
        flynn.maoDaBola.attach(m);
        m.position.set(0, 0, 0);
        b.estado = { fase: 'na-mao' };
      }
      return;
    }
    if (e.fase === 'arco') {
      // da mão até o aro, num arco alto: sempre entra — é o presidente
      e.t = Math.min(1, e.t + dt / 0.78);
      const alvo = tmp.set(b.aro.x, q.aroY + 0.14, b.aro.z);
      m.position.lerpVectors(e.de, alvo, e.t);
      m.position.y += 1.1 * 4 * e.t * (1 - e.t);
      m.rotation.z -= dt * 9 * b.aro.lado;
      if (e.t >= 1) {
        b.estado = { fase: 'caindo', t: 0, abaixoDaRede: -1, vy: -1.2, quiques: 0 };
        cestas++;
        g0.som('pegar');
      }
      return;
    }
    if (e.fase !== 'caindo') return;
    // cai pela rede, reto; abaixo dela, rola de volta para o repouso enquanto quica
    e.t += dt;
    e.vy -= 9.8 * dt;
    m.position.y += e.vy * dt;
    if (e.abaixoDaRede < 0 && m.position.y < q.aroY - 0.5) e.abaixoDaRede = e.t;
    if (e.abaixoDaRede >= 0) {
      const k = 1.4;
      const s = e.t - e.abaixoDaRede;
      const ida = 1 - Math.exp(-k * s);
      const antes = tmp.set(m.position.x, 0, m.position.z);
      m.position.x = b.aro.x + (b.repouso.x - b.aro.x) * ida;
      m.position.z = b.aro.z + (b.repouso.z - b.aro.z) * ida;
      // rola: gira em volta do eixo deitado, na medida do que andou
      m.rotation.z -= (m.position.x - antes.x) / RAIO_DA_BOLA;
      m.rotation.x += (m.position.z - antes.z) / RAIO_DA_BOLA;
    }
    if (m.position.y < RAIO_DA_BOLA) {
      m.position.y = RAIO_DA_BOLA;
      if (Math.abs(e.vy) > 0.9 && e.quiques < 4) {
        e.vy = -e.vy * 0.55;
        e.quiques++;
        if (e.quiques <= 2) g0.som('quicar');
      } else {
        e.vy = 0;
      }
    }
    if (e.vy === 0 && e.abaixoDaRede >= 0 && e.t - e.abaixoDaRede > 2.6) {
      m.position.copy(b.repouso);
      b.estado = { fase: 'parada' };
    }
  };

  // ------------------------------------------------------------ o treino
  type Fase = 'correndo' | 'arremessando' | 'virando';
  let fase: Fase = 'correndo';
  /** a ponta para onde ele vai, ou onde ele está arremessando */
  let ponta = -1;
  let virando = 0;
  /** quanto tempo a dupla está parada na frente dele */
  let barrado = 0;
  let pausado = false;
  let pedidoDePausa: (() => void) | null = null;
  /** gancho de teste: segura o treino (para medir e fotografar parado) */
  let ligado = true;

  /** alguém da dupla está na frente dele, perto, na raia? */
  const naFrente = (alvo: THREE.Vector3): boolean => {
    const dx = alvo.x - flynn.x;
    const dz = alvo.z - flynn.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.01) return false;
    const ux = dx / dist;
    const uz = dz / dist;
    for (const p of [g0.playerPosition(), g0.companionPosition()]) {
      const px = p.x - flynn.x;
      const pz = p.z - flynn.z;
      const frente = px * ux + pz * uz;
      const lado = Math.abs(px * uz - pz * ux);
      if (frente > 0 && frente < Math.min(1.5, dist + 0.6) && lado < 0.8) return true;
    }
    return false;
  };

  const passo = (dt: number): void => {
    if (pausado || !ligado) return;
    if (fase === 'correndo') {
      if (pedidoDePausa) return pausar();
      const alvo = parada(ponta);
      if (Math.hypot(alvo.x - flynn.x, alvo.z - flynn.z) < 0.1) {
        // chegou: a bola dessa ponta tem que estar no chão esperando
        const b = bolas.get(ponta)!;
        if (b.estado.fase !== 'parada') return;
        fase = 'arremessando';
        flynn.entrarEmServico();
        flynn.encarar(b.aro.x, b.aro.z);
        flynn.arremessar();
        return;
      }
      if (naFrente(alvo)) {
        // espera a dupla sair da frente; se ela não sai, ele treina na outra cesta
        flynn.entrarEmServico();
        barrado += dt;
        if (barrado > 1.4) {
          barrado = 0;
          ponta = -ponta;
          fase = 'virando';
          virando = 0.35;
          flynn.encarar(parada(ponta).x, parada(ponta).z);
        }
        return;
      }
      barrado = 0;
      flynn.seguir(alvo.x, alvo.z, VELOCIDADE_DA_CORRIDA);
      return;
    }
    if (fase === 'arremessando') {
      const b = bolas.get(ponta)!;
      const t = flynn.tempoNoArremesso;
      if (b.estado.fase === 'parada' && t >= ARREMESSO.PEGA - 0.14) {
        b.estado = { fase: 'subindo', t: 0, de: b.malha.position.clone() };
      }
      if (b.estado.fase === 'na-mao' && t >= ARREMESSO.SOLTA) {
        raiz.attach(b.malha);
        b.estado = { fase: 'arco', t: 0, de: b.malha.position.clone() };
        g0.som('lancar');
      }
      if (!flynn.estaArremessando) {
        // vira de costas para a cesta e olha para a outra ponta
        ponta = -ponta;
        fase = 'virando';
        virando = 0.35;
        flynn.encarar(parada(ponta).x, parada(ponta).z);
      }
      return;
    }
    // virando
    if (pedidoDePausa) return pausar();
    virando -= dt;
    if (virando <= 0) {
      fase = 'correndo';
      flynn.pararDeEncarar();
    }
  };

  const pausar = (): void => {
    pausado = true;
    flynn.entrarEmServico();
    const pronto = pedidoDePausa;
    pedidoDePausa = null;
    pronto?.();
  };

  ligarAConversa(w, flynn, {
    nome: 'Ginásio da Escola do Gatito',
    noGinasio: true,
    // os dois a ~1 e ~1,6 da raia, do lado da câmera
    lado: -0.6,
    frente: 1.7,
    // no meio de um arremesso, ele termina primeiro: a bola não fica presa na mão
    parar: () => new Promise<void>((pronto) => {
      if (pausado) return pronto();
      pedidoDePausa = pronto;
    }),
    soltar: () => {
      pausado = false;
      barrado = 0;
      if (fase === 'virando') flynn.encarar(parada(ponta).x, parada(ponta).z);
    },
  });

  /** gancho de teste: o `scripts/flynn.mjs` mede o treino e o segura para fotografar */
  flynn.group.userData.teste = {
    flynn,
    treino: {
      get fase(): Fase {
        return fase;
      },
      get ponta(): number {
        return ponta;
      },
      get pausado(): boolean {
        return pausado;
      },
      get cestas(): number {
        return cestas;
      },
      get maiorVelocidade(): number {
        return maiorVelocidade;
      },
      bolas: () => [...bolas.values()].map((b) => ({
        lado: b.aro.lado, fase: b.estado.fase,
        x: b.malha.getWorldPosition(new THREE.Vector3()).x,
        y: b.malha.getWorldPosition(new THREE.Vector3()).y,
        z: b.malha.getWorldPosition(new THREE.Vector3()).z,
        repouso: { x: b.repouso.x, z: b.repouso.z },
      })),
      ligar: (sim: boolean) => {
        ligado = sim;
        if (!sim) flynn.entrarEmServico();
      },
    },
  };

  w.onUpdate((dt) => {
    passo(dt);
    const x = flynn.x;
    const z = flynn.z;
    flynn.update(dt);
    if (dt > 0) maiorVelocidade = Math.max(maiorVelocidade, Math.hypot(flynn.x - x, flynn.z - z) / dt);
    for (const b of bolas.values()) moverBola(b, dt);
  });
  return flynn;
}
