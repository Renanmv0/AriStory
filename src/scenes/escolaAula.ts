import * as THREE from 'three';
import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { Gatito } from '../entities/bichos/Gatito';
import { Luna } from '../entities/bichos/Luna';
import { ARI, RENAN } from '../characters/cast';
import { MODULO_1, licaoDaVez } from '../minigames/aula/apostila';
import type { Fala, Falante, Licao } from '../minigames/aula/tipos';
import { conversa, sentarOsDois } from './escolaComum';

/**
 * ============================================== A AULA DO GATITO, NA SALA 1
 *
 * O pedido do Renan: o Gatito passeia pela escola enquanto a aula não começa;
 * para começar, uma missão lá dentro — falar com a Luna no ginásio, e ela
 * avisa que a aula vai começar. Aí, na Sala 1, o Gatito está na mesa dele e
 * os três — o Ari, o Renan e a Luna — têm a aula.
 *
 * O CICLO, uma lição por aula:
 *
 * 1. a lição da vez é a primeira da apostila ainda sem estrela
 *    (`licaoDaVez`); a Luna, no ginásio, CHAMA a aula dela (`chamarAula`,
 *    com as falas da própria lição) e vai na frente — liga `aula-chamada`;
 * 2. com a aula chamada, o Gatito sai do saguão e a Luna do ginásio: os dois
 *    estão na Sala 1 — ele sentado EM CIMA da mesa do professor, de
 *    oculinhos (§2 do `docs/ESCOLA.md`), ela na ponta da primeira fila;
 * 3. "Sentar para a aula": a dupla senta no meio da primeira fila, bate o
 *    sinal, o Gatito abre a aula e a apostila abre na lição (`g.abrirApostila`);
 * 4. lição concluída: as estrelas, as falas de encerramento, a aula acaba
 *    (`aula-chamada` desliga), e os dois saem pela porta — ele volta a
 *    passear pelo saguão, ela a treinar no ginásio. Fechou o livro no meio:
 *    a aula continua chamada, e sentar de novo retoma.
 *
 * Fora da aula, a mesma carteira vira "Estudar a apostila": o livro abre onde
 * parou, com as lições já dadas (rever, refazer para mais estrelas).
 *
 * O ALUNO É O ARI, seja quem estiver no controle (§6.1 do plano): as falas da
 * aula saem pelo nome de cada um, e não por jogador e parceiro.
 */

/** a flag da aula chamada pela Luna, e ainda não terminada */
export const AULA_CHAMADA = 'aula-chamada';

const NOMES: Record<Falante, string> = {
  gatito: 'Gatito',
  luna: 'Luna',
  ari: ARI.name,
  renan: RENAN.name,
  walter: 'Walter',
  josefina: 'Josefina',
};

const G = NOMES.gatito;
const L = NOMES.luna;

/** as falas de uma lição, com o nome certo em cada balão */
export function falasDaAula(falas: readonly Fala[]): Array<[string, string]> {
  return falas.map((f) => [NOMES[f.quem], f.texto]);
}

/** a lição da próxima aula; `null` quando o módulo acabou */
export function aulaDaVez(g: GameAPI): Licao | null {
  return licaoDaVez(MODULO_1, g.progressoDaApostila());
}

/** a aula está chamada e ainda tem lição para dar */
export function emAula(g: GameAPI): boolean {
  return g.flag(AULA_CHAMADA) && aulaDaVez(g) !== null;
}

/** a Luna pode chamar a aula: o Gatito já convidou, e tem lição para dar */
export function podeChamarAula(g: GameAPI): boolean {
  return g.flag('gatito-conhecido') && !g.flag(AULA_CHAMADA) && aulaDaVez(g) !== null;
}

/** a última lição que o Gatito deu (para a lousa lembrar dela) */
function ultimaDada(g: GameAPI): Licao | null {
  const abertas = g.progressoDaApostila().abertas;
  return [...MODULO_1.licoes].reverse().find((l) => abertas.includes(l.id)) ?? null;
}

/**
 * O QUE ESTÁ NA LOUSA DA SALA 1: a lição da aula chamada; depois dela, a
 * última dada; antes de qualquer aula, `null` (a lousa de boas-vindas).
 */
export function lousaDaSala1(g: GameAPI): string[] | null {
  const l = emAula(g) ? aulaDaVez(g) : ultimaDada(g);
  return l ? [`Lição ${l.numero}`, l.titulo, 'Prof. Gatito'] : null;
}

/**
 * A LUNA CHAMA A AULA (no ginásio): o sinal, as falas da lição da vez, o
 * aviso, e a flag. Quem a chama cuida de levar a Luna embora do ginásio.
 */
export async function chamarAula(g: GameAPI): Promise<void> {
  const licao = aulaDaVez(g);
  if (!licao) return;
  // o sinal da escola toca no meio da conversa, e é ele que ela ouve
  g.som('sino');
  await g.wait(0.7);
  await conversa(g, falasDaAula(licao.aula.chamada));
  g.setFlag(AULA_CHAMADA);
  g.toast(`A aula do Gatito vai começar na Sala 1: lição ${licao.numero}!`, '🔔');
}

/** o que o Gatito diz das estrelas, logo que o livro fecha */
const DAS_ESTRELAS: Record<number, string> = {
  3: 'Três estrelinhas! Nota máxima, {aluno}!',
  2: 'Duas estrelinhas. Muito bem, {aluno}!',
  1: 'Uma estrelinha, e muita coragem. Dá pra refazer quando quiser: a apostila guarda a melhor vez.',
};

export interface SalaDaAula {
  /** o id da sala, para os ids das interações */
  id: string;
  /** a âncora do meio da primeira fila, e cada um dos dois nela */
  ancora: THREE.Object3D;
  jogador: THREE.Vector3;
  parceiro: THREE.Vector3;
  /** para onde a câmera olha com a dupla sentada */
  foco: THREE.Object3D;
  /** onde fica o ponto de sentar */
  x: number;
  z: number;
  /** onde cada um fica de pé ao levantar */
  saida: { jogador: [number, number]; parceiro: [number, number] };
  /** o assento da carteira da Luna (a ponta da primeira fila) */
  lugarDaLuna: { x: number; z: number };
  /** o tampo da mesa do professor: é ali que o Gatito senta */
  mesa: { x: number; y: number; z: number };
  /** a porta da sala, por onde os dois vão embora no fim */
  porta: { x: number; z: number };
  /** o x do corredor livre de carteiras, do lado da porta */
  corredor: number;
  /** o z do vão entre a segunda e a terceira fileira */
  vaoDasFileiras: number;
  /** as falas de sentar na primeira fila antes de a escola ter aula */
  falasDeSentar: ReadonlyArray<readonly [string, string]>;
}

/** o topo do assento da carteira escolar (ver `carteiraEscolar`) */
const ASSENTO = 0.47;

/**
 * Monta, na Sala 1, o que depende da aula: o Gatito na mesa e a Luna na
 * carteira (com a aula chamada) e o ponto da primeira fila — que é "Sentar
 * para a aula", "Estudar a apostila" ou só "Sentar na primeira fila".
 */
export function montarAulaDoGatito(w: WorldBuilder, s: SalaDaAula): void {
  const g0 = w.game;
  const naAula = emAula(g0);

  // ------------------------------------------------ o professor e a colega
  const parado = (x: number, z: number): { minX: number; maxX: number; minZ: number; maxZ: number } => ({
    minX: x, maxX: x, minZ: z, maxZ: z,
  });
  let gatito: Gatito | null = null;
  let luna: Luna | null = null;
  if (naAula) {
    gatito = new Gatito(parado(s.mesa.x, s.mesa.z));
    gatito.usarOculos(true);
    gatito.sentarEm(s.mesa.x, s.mesa.z, 0, s.mesa.y);
    // miado de professor é espaçado: ele está dando aula
    gatito.aoSoar = () => g0.som('miado');
    w.add(gatito.group);
    luna = new Luna(parado(s.lugarDaLuna.x, s.lugarDaLuna.z));
    luna.sentarEm(s.lugarDaLuna.x, s.lugarDaLuna.z, Math.PI, ASSENTO);
    w.add(luna.group);
    /** gancho de teste: o `scripts/aula.mjs` mede os dois na sala */
    gatito.group.userData.teste = { gatito, luna };
  }
  /**
   * O PULO PARA O CHÃO: o Gatito desce da mesa para a FRENTE dela, e a Luna
   * sai da carteira para o LADO — pular reto para baixo deixava o gato
   * debaixo do tampo e a coelha dentro da cadeira. Um arco curto, com um
   * tico de subida antes de cair.
   */
  const pulando: Array<{ quem: Gatito | Luna; de: THREE.Vector3; para: THREE.Vector3; t: number; pronto: () => void }> = [];
  const pular = (quem: Gatito | Luna, x: number, z: number): Promise<void> =>
    new Promise((pronto) => {
      pulando.push({ quem, de: quem.group.position.clone(), para: new THREE.Vector3(x, 0, z), t: 0, pronto });
    });
  w.onUpdate((dt) => {
    gatito?.update(dt);
    luna?.update(dt);
    for (let i = pulando.length - 1; i >= 0; i--) {
      const p = pulando[i];
      p.t = Math.min(1, p.t + dt * 2.6);
      p.quem.group.position.lerpVectors(p.de, p.para, p.t);
      p.quem.group.position.y += Math.sin(p.t * Math.PI) * 0.18;
      if (p.t >= 1) {
        pulando.splice(i, 1);
        p.pronto();
      }
    }
  });

  const falarComGatito = gatito
    ? w.interact({
      id: `${s.id}:gatito`,
      x: s.mesa.x, z: s.mesa.z + 0.95, radius: 0.95,
      label: 'Falar com o Gatito', icon: '🐱',
      highlight: gatito.group,
      onInteract: async (g) => {
        g.som('miado');
        await conversa(g, [[G, `Sentem-se, turma! A lição ${aulaDaVez(g)?.numero ?? ''} já vai começar.`]]);
      },
    })
    : null;
  const falarComLuna = luna
    ? w.interact({
      id: `${s.id}:luna`,
      x: s.lugarDaLuna.x + 0.2, z: s.lugarDaLuna.z + 0.75, radius: 0.8,
      label: 'Falar com a Luna', icon: '🐰',
      highlight: luna.group,
      onInteract: async (g) => {
        await conversa(g, [[L, 'Guardei os lugares do meu lado, panas! Senta, senta!']]);
      },
    })
    : null;

  /** no fim da aula, os dois descem e vão embora pela porta */
  const irEmbora = async (): Promise<void> => {
    if (falarComGatito) falarComGatito.enabled = false;
    if (falarComLuna) falarComLuna.enabled = false;
    const saem: Array<Promise<void>> = [];
    /*
     * OS CAMINHOS fogem das carteiras: o Gatito pelo vão entre a mesa dele e
     * a primeira fila, e depois pelo corredor da porta (x = 3,3, onde não há
     * carteira); a Luna pela ponta da fileira, junto da parede, e depois pelo
     * vão entre a segunda e a terceira fileira.
     */
    if (gatito) {
      const gt = gatito;
      gt.levantar();
      saem.push((async () => {
        await pular(gt, s.mesa.x, s.mesa.z + 0.8);
        await gt.irPara(s.corredor, s.mesa.z + 0.8, 1.2);
        await gt.irPara(s.corredor, s.porta.z - 0.6, 1.2);
        await gt.irPara(s.porta.x, s.porta.z, 1.2);
        gt.group.visible = false;
      })());
    }
    if (luna) {
      const ln = luna;
      ln.levantar();
      saem.push((async () => {
        await g0.wait(0.5);
        await pular(ln, s.lugarDaLuna.x - 0.5, s.lugarDaLuna.z);
        await ln.irPara(s.lugarDaLuna.x - 0.5, s.vaoDasFileiras, 1.3);
        await ln.irPara(s.corredor, s.vaoDasFileiras, 1.3);
        await ln.irPara(s.porta.x, s.porta.z, 1.3);
        ln.group.visible = false;
      })());
    }
    await Promise.all(saem);
  };

  // ------------------------------------------------ a carteira da primeira fila
  const rotulo = (g: GameAPI): { label: string; icon: string } => {
    if (emAula(g)) return { label: 'Sentar para a aula', icon: '📘' };
    if (g.progressoDaApostila().abertas.length) return { label: 'Estudar a apostila', icon: '📘' };
    return { label: 'Sentar na primeira fila', icon: '🪑' };
  };
  const sentar = (g: GameAPI): void => {
    g.lockPlayer(true);
    g.ridePlayer(s.ancora, s.jogador, 1, Math.PI);
    g.rideCompanion(s.ancora, s.parceiro, 1, Math.PI);
    g.setSitting(true);
    g.focusCamera(s.foco);
  };
  const levantar = (g: GameAPI): void => {
    g.setSitting(false);
    g.focusCamera(null);
    g.setZoom(13);
    g.releasePlayer(s.saida.jogador[0], s.saida.jogador[1], Math.PI);
    g.releaseCompanion(s.saida.parceiro[0], s.saida.parceiro[1], Math.PI);
    g.lockPlayer(false);
  };

  /** ESTUDAR: senta, abre a apostila onde parou, e levanta quando ela fecha */
  const estudar = async (g: GameAPI): Promise<void> => {
    sentar(g);
    await g.wait(0.4);
    await g.abrirApostila();
    levantar(g);
  };

  /** A AULA: o sinal, o Gatito, a apostila na lição da vez, e o fim */
  const darAula = async (g: GameAPI): Promise<void> => {
    const licao = aulaDaVez(g);
    if (!licao) return;
    const primeira = !g.progressoDaApostila().abertas.length;
    sentar(g);
    g.setZoom(8.5);
    if (falarComGatito) falarComGatito.enabled = false;
    if (falarComLuna) falarComLuna.enabled = false;
    await g.wait(0.6);
    g.som('sino');
    await g.wait(0.7);
    await conversa(g, falasDaAula(licao.aula.abertura));
    const r = await g.abrirApostila({ licao: licao.id });
    const feita = r.concluidas.find((c) => c.id === licao.id);
    if (!feita) {
      await conversa(g, [[G, 'Sem pressa, Ari. Quando quiser continuar, é só sentar de novo: a apostila espera na mesma lição.']]);
      levantar(g);
      if (falarComGatito) falarComGatito.enabled = true;
      if (falarComLuna) falarComLuna.enabled = true;
      return;
    }
    if (feita.estrelas === 3) gatito?.sixSeven();
    luna?.torcer(2.2);
    g.som('sacudida');
    await conversa(g, [[G, DAS_ESTRELAS[feita.estrelas].replace('{aluno}', ARI.name)]]);
    await conversa(g, falasDaAula(licao.aula.encerramento));
    g.setFlag(AULA_CHAMADA, false);
    if (primeira) {
      g.unlock({
        id: 'primeira-aula-do-gatito',
        title: 'A primeira aula do Gatito',
        place: 'Escola do Gatito',
        note: 'Sala 1, primeira fila: você, eu e a Luna, e o Gatito de oculinhos em cima da mesa. Primeira lição: "tudo bem?" se responde com "tudo!". E a apostila tem o seu nome na capa.',
        icon: '📘',
      });
    }
    if (!aulaDaVez(g)) {
      g.unlock({
        id: 'modulo-1-do-gatito',
        title: 'O Módulo 1 completinho',
        place: 'Escola do Gatito',
        note: 'Seis lições, a apostila inteira, e um professor muito orgulhoso de você. No fim, o Gatito pediu um cafuné — e agora você sabe o que é.',
        icon: '🎓',
      });
    }
    levantar(g);
    void irEmbora();
  };

  const ponto = w.interact({
    id: `${s.id}:sentar`,
    x: s.x, z: s.z, radius: 1.2,
    ...rotulo(g0),
    onInteract: async (g) => {
      if (emAula(g)) await darAula(g);
      else if (g.progressoDaApostila().abertas.length) await estudar(g);
      else {
        await sentarOsDois(g, {
          ancora: s.ancora, jogador: s.jogador, parceiro: s.parceiro, facing: Math.PI, foco: s.foco,
          falas: s.falasDeSentar,
          saida: { jogador: s.saida.jogador, parceiro: s.saida.parceiro, facing: Math.PI },
        });
      }
      Object.assign(ponto, rotulo(g));
    },
  });
}
