import type { GameAPI } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { ARI, RENAN } from '../characters/cast';
import { Flynn } from '../entities/bichos/Flynn';
import { conversa, posicionarParaConversar, soltarDaConversa } from './escolaComum';

/**
 * =============================================== A ATLÉTICA DOS GATITOS
 *
 * O FLYNN, a raposa presidente da atlética (pedido do Renan): o primeiro
 * atleta da escola. Por enquanto ele mora no REFEITÓRIO, para a dupla
 * conhecer — anda pelo corredor do meio, entre as duas colunas de mesas (é
 * elétrico: para pouco em cada canto), e quem chega perto pode conversar.
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

/** depois da festa da torcida, ele também viu a coreografia */
const DEPOIS_DA_FESTA: readonly Fala[] = [
  [F, 'Vocês viram a coreografia das meninas? Eu assisti da arquibancada e aplaudi tanto que a pata ficou dormente!', 'comemora'],
];

/**
 * Põe o Flynn no refeitório: o passeio pelo corredor do meio, o colisor que
 * anda com ele, e a conversa.
 */
export function montarOFlynn(w: WorldBuilder, r: Refeitorio): Flynn {
  /*
   * A ÁREA é o corredor entre as duas colunas de mesas (as da esquerda vão
   * até x = -29,3; as da direita começam em -24,2), da frente do balcão até
   * perto da parede de baixo. Nenhuma mesa dentro dela: ele passeia sem
   * `proibido`. O Gatito cruza esse corredor na ronda dele (z = 0) — os dois
   * se cruzam, e ninguém trava ninguém.
   */
  const flynn = new Flynn({ minX: -28.6, maxX: -24.9, minZ: r.z0 + 3, maxZ: r.z1 - 1.5 });
  const inicio = { x: -26.7, z: 1.6 };
  flynn.group.position.set(inicio.x, 0, inicio.z);
  flynn.group.rotation.y = Math.PI / 4;
  w.add(flynn.group);

  // ele é sólido para a dupla, como as coelhinhas no ginásio
  const colisor = { kind: 'circle' as const, x: inicio.x, z: inicio.z, r: 0.38 };
  w.colliders.push(colisor);

  /** gancho de teste: o `scripts/flynn.mjs` mede ele e segura o passeio para fotografar */
  flynn.group.userData.teste = { flynn };

  const falar = async (g: GameAPI, falas: readonly Fala[]): Promise<void> => {
    for (const [quem, texto, gesto] of falas) {
      if (gesto === 'comemora') flynn.comemorar(2);
      await conversa(g, [[quem, texto]]);
    }
  };

  const ponto = w.interact({
    id: 'escola:flynn',
    x: inicio.x, z: inicio.z, radius: 1.3,
    label: 'Falar com o Flynn', icon: '🦊',
    highlight: flynn.group,
    onInteract: async (g) => {
      flynn.entrarEmServico();
      const meio = posicionarParaConversar(g, { x: flynn.x, z: flynn.z });
      flynn.encarar(meio.x, meio.z);
      flynn.acenar(2.2);
      g.focusCamera(flynn.group);
      g.setZoom(8);
      try {
        if (!g.flag('flynn-conhecido')) {
          await falar(g, APRESENTACAO);
          g.som('apito');
          g.setFlag('flynn-conhecido');
          g.unlock({
            id: 'o-presidente-da-atletica',
            title: 'O presidente da atlética',
            place: 'Refeitório da Escola do Gatito',
            note: 'Uma raposa de bandana dos Gatitos, presidente da atlética, que já sabia o nosso nome antes de a gente se apresentar. Convidou a gente pra jogar — "sem pressão nenhuma", ele fez questão de dizer.',
            icon: '🦊',
          });
          g.toast('Flynn, o presidente da atlética dos Gatitos', '🦊');
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
        flynn.voltarAPassear();
      }
    },
  });

  w.onUpdate((dt) => {
    flynn.update(dt);
    ponto.moveTo(flynn.x, flynn.z);
    colisor.x = flynn.x;
    colisor.z = flynn.z;
  });
  return flynn;
}
