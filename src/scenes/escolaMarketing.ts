import type { GameAPI, ItemDef } from '../core/types';
import type { WorldBuilder } from '../world/WorldBuilder';
import { bannerDosGatitos } from '../world/furniture';
import { ARI, RENAN } from '../characters/cast';
import { Valentina } from '../entities/bichos/Valentina';
import { conversa, posicionarParaConversar, soltarDaConversa } from './escolaComum';
import { MODULO_2, licaoDaVezNoCurso, moduloConcluido } from '../minigames/aula/apostila';

/** a flag da apresentação dela */
export const VALENTINA_CONHECIDA = 'valentina-conhecida';

/**
 * ELA É DA TURMA: do Módulo 3 em diante — o Módulo 2 inteiro com estrela, que
 * é quando a aula da vez passa a ser do 3 (a primeira lição sem estrela do
 * curso). Com o curso todo feito, continua sendo.
 */
export function valentinaNaAula(g: GameAPI): boolean {
  return moduloConcluido(MODULO_2, g.progressoDaApostila());
}

/** a próxima aula é dela também, e a dupla ainda não a conheceu: as coelhinhas mandam ir ao saguão */
export function faltaConhecerAValentina(g: GameAPI): boolean {
  return valentinaNaAula(g) && !g.flag(VALENTINA_CONHECIDA) && licaoDaVezNoCurso(g.progressoDaApostila()) !== null;
}

/** a aula com ela está chamada agora (ela está na Sala 1, e não no saguão) */
function naSalaUm(g: GameAPI): boolean {
  return valentinaNaAula(g) && g.flag('aula-chamada') && licaoDaVezNoCurso(g.progressoDaApostila()) !== null;
}

/**
 * ================================================ O MARKETING DOS GATITOS
 *
 * A VALENTINA (pedido do Renan): uma flamingo italiana, de Milão, que trabalha
 * no marketing dos Gatitos e faz a aula de português junto com a dupla.
 * "Bem vaidosa, bem vaidosa mesmo, como uma boss girl. Ela julga as
 * vestimentas dos outros, porém ela não é má: mesmo julgando, ela tenta dar
 * um jeito de elogiar as pessoas." E, como ninguém da dupla fala italiano,
 * só ALGUMAS expressões em italiano, nunca uma frase inteira: ciao, allora,
 * mamma mia, bellissimo, perfetto, cara mia, andiamo, brava.
 *
 * O POSTO DELA é o canto da frente à direita do saguão, perto da entrada: o
 * banner de marketing dos Gatitos (que ela fez, e assinou) e um pedacinho de
 * chão para desfilar. Ela é a primeira a ver quem entra — e a roupa de quem
 * entra.
 *
 * ELA REPARA NA ROUPA DE VERDADE: o juízo (`juizoDaRoupa`) lê o que o Ari e o
 * Renan estão vestindo agora (`g.wearables`) — o uniforme dos Gatitos, os
 * dois combinando, roupa demais, roupa de menos, ou a peça mais ousada pelo
 * nome — e sempre termina num elogio. É a primeira coisa que ela diz em toda
 * conversa, porque é a primeira coisa que ela vê.
 *
 * A AULA: do Módulo 3 em diante ela é colega de turma (a carteira atrás do
 * Renan, na Sala 1 — `escolaAula.ts`). Para a primeira aula do Módulo 3 ser
 * chamada, a dupla precisa ter conversado com ela antes (o pedido: "para
 * conversarmos com ela antes de fazermos as lições do novo módulo"); as
 * coelhinhas avisam no ginásio.
 *
 * AS FALAS SÃO RASCUNHO MEU, no jeito que o Renan descreveu; quando ele
 * mandar falas de verdade, elas entram aqui literais.
 */

const V = 'Valentina';
const A = ARI.name;
const R = RENAN.name;

/** uma fala, e o gesto dela nessa fala */
type Gesto = 'examina' | 'posa' | 'encanta';
type Fala = readonly [string, string, Gesto?];

/** O POSTO: o banner e o chão do desfile, no canto da frente à direita do saguão */
export const POSTO_DA_VALENTINA = {
  banner: { x: 21.9, z: 4.15 },
  area: { minX: 21.3, maxX: 23.0, minZ: 5.0, maxZ: 6.3 },
} as const;

// ===================================================== O JUÍZO DA ROUPA

/** as peças que alguém está vestindo agora (as vagas cheias) */
function vestidas(g: GameAPI, quem: string): ItemDef[] {
  return g.wearables(quem).filter((p): p is ItemDef => !!p);
}

const dosGatitos = (p: ItemDef): boolean => p.id.includes('gatitos');

/**
 * O JUÍZO: olha as duas roupas e devolve o que ela diz — sempre a crítica
 * primeiro e o elogio no fim. `vez` alterna a frase de cada caso, para ela
 * não repetir a mesma coisa duas conversas seguidas.
 */
export function juizoDaRoupa(g: GameAPI, vez: number): Fala[] {
  const ari = vestidas(g, ARI.id);
  const renan = vestidas(g, RENAN.id);
  const todas = [...ari, ...renan];
  const escolhe = <T,>(lista: readonly T[]): T => lista[vez % lista.length];
  const gatitosAri = ari.some(dosGatitos);
  const gatitosRenan = renan.some(dosGatitos);
  const iguais = ari.filter((p) => renan.some((q) => q.id === p.id));

  if (gatitosAri && gatitosRenan) {
    return [escolhe<Fala>([
      [V, 'Os dois de Gatitos? Perfetto. Bom gosto... e marketing de graça pra escola. Eu aprovo.', 'encanta'],
      [V, 'Uniforme dos Gatitos nos dois! Não é tão chique quanto o meu, claro. Mas vocês vestem com orgulho, e orgulho é elegante.', 'encanta'],
    ])];
  }
  if (gatitosAri || gatitosRenan) {
    const quem = gatitosAri ? A : R;
    const outro = gatitosAri ? R : A;
    return [
      [V, `O ${quem} veio de Gatitos e o ${outro} não? Hmm. Metade da dupla está bem vestida.`, 'examina'],
      [V, `Brincadeira, ${outro}. Você também está bonito. Só não está de Gatitos... ainda.`, 'encanta'],
    ];
  }
  if (iguais.length) {
    return [escolhe<Fala>([
      [V, 'Combinandinho, os dois? Mamma mia. Casal que combina é quase tão chique quanto eu sozinha.', 'examina'],
      [V, 'Peça igual nos dois... É coragem, isso. E coragem, cara mia, é o primeiro passo do estilo.', 'encanta'],
    ])];
  }
  if (todas.length >= 6) {
    return [
      [V, 'Quanta coisa! Acessório em cima de acessório...', 'examina'],
      [V, 'Mas sabe que funciona? Quem tem muito estilo precisa de espaço pra mostrar. Eu entendo vocês.', 'encanta'],
    ];
  }
  if (!todas.length) {
    return [escolhe<Fala>([
      [V, 'Básico. Clássico. Nada de exagero. O básico é para poucos... e vocês estão quase lá.', 'examina'],
      [V, 'Sem um acessório, nem unzinho? Hmm. Ainda bem que vocês têm um rosto bonito pra compensar.', 'examina'],
    ])];
  }
  // o caso de sempre: ela escolhe a peça mais ousada de um dos dois, pelo nome
  const de = vez % 2 === 0 && ari.length ? { nome: A, pecas: ari } : renan.length ? { nome: R, pecas: renan } : { nome: A, pecas: ari };
  const peca = de.pecas[vez % de.pecas.length];
  return [
    [V, `${de.nome}... "${peca.nome}"? Ousado. Eu nunca usaria.`, 'examina'],
    [V, escolhe([
      'Em você, até que funciona. Não conta pra ninguém que eu disse isso.',
      'Mas em você ficou bom. Alguém mais estilosa que eu? Não tem. Mas vocês chegam perto.',
      'Vocês até que têm senso de estilo, sabia? Escondido, mas têm.',
    ]), 'encanta'],
  ];
}

// =========================================================== AS CONVERSAS

/** A APRESENTAÇÃO, na primeira conversa (o juízo entra logo depois do "ciao") */
function apresentacao(g: GameAPI): Fala[] {
  const naTurma = valentinaNaAula(g);
  return [
    [V, 'Ciao, ciao! Não, não, fiquem paradinhos aí um segundo...', 'examina'],
    ...juizoDaRoupa(g, 0),
    [A, 'Ela tá olhando a nossa roupa?'],
    [V, 'Estou, sim. É o meu trabalho. Quer dizer... é o meu dom. O trabalho é no marketing dos Gatitos.'],
    [V, 'Valentina, muito prazer. Vim de Milão, a capital da moda. Os cartazes, o mural, o perfil da escola na internet... tudo passa por mim.', 'posa'],
    [R, 'Então foi você que fez esse banner aí?'],
    [V, 'Fui eu. Ficou um pouco simples: o Gatito não deixou eu pôr glitter. Mas eu assinei embaixo, viu?'],
    [V, 'E vocês são o Ari e o Renan, os alunos do Gatito. A Luna fala de vocês sem parar.'],
    naTurma
      ? [V, 'Allora: eu estou aprendendo português também. E começou o Módulo 3... então agora eu faço a aula com vocês!', 'encanta']
      : [V, 'Allora: eu estou aprendendo português também. Quando vocês chegarem no Módulo 3, eu entro na turma de vocês.', 'encanta'],
    [A, 'Você vai estudar com a gente?'],
    [V, 'Claro. Alguém precisa deixar aquela Sala 1 mais elegante.', 'posa'],
    [V, 'E eu aprendo rápido. Quase tão rápido quanto eu me arrumo. Andiamo, Gatitos!'],
  ];
}

/** AS CONVERSAS DE DEPOIS, uma por vez, em roda (depois do juízo da roupa) */
const CONVERSAS: ReadonlyArray<readonly Fala[]> = [
  [[V, 'Sabiam que o flamingo é rosa por causa do que come? Eu sou rosa por escolha. Mas também como muito bem.', 'posa']],
  [
    [V, 'Ser chique não é ter roupa cara. É andar no corredor como se fosse uma passarela.', 'posa'],
    [V, '...Ter roupa cara ajuda um pouquinho, mas não conta pra ninguém.'],
  ],
  [
    [V, 'Estou fazendo a campanha nova dos Gatitos. O slogan: "aprender com estilo".'],
    [R, 'E o estilo é seu?'],
    [V, 'Naturalmente. O aprender é do Gatito. Dividimos o crédito, somos profissionais.', 'posa'],
  ],
  [
    [V, 'Ari, o seu português está melhorando. Ainda não está tão bonito quanto o meu blazer...'],
    [V, '...mas está chegando lá. Brava! Quer dizer, bravo. Viu? Eu também erro.', 'encanta'],
  ],
  [[V, 'A Estella, da boutique do parque, tem muito bom gosto. Não tanto quanto eu, claro. Mas é a única que eu deixo me dar dica de roupa.']],
  [
    [V, 'Mamma mia, o Flynn veio de bandana de novo. Eu disse pra ele que bandana com regata é ousado.'],
    [V, 'Ele respondeu "obrigado!". Ele é muito fofo. E muito ousado.', 'encanta'],
  ],
  [
    [V, 'Em italiano, "burro" é manteiga. Imagina o susto no primeiro dia, quando me ofereceram pão com burro.'],
    [A, 'Em espanhol, burro é burro mesmo.'],
    [V, 'Pois é. Português é cheio de pegadinhas. Ainda bem que eu sou mais esperta que elas.', 'posa'],
  ],
  [[V, 'Eu não sigo tendência, cara mia. Eu faço a tendência. As coelhinhas estão usando laço por minha causa, sabiam?', 'posa']],
];

/** o que ela diz na carteira, antes de a aula começar (a Sala 1 lê daqui) */
export const VALENTINA_NA_CARTEIRA: readonly Fala[] = [
  [V, 'Ciao, colegas! Guardei a minha carteira bem atrás de vocês: daqui eu vejo a lousa e as roupas de vocês. As duas coisas são importantes.'],
];

/** o elogio do fim da aula, um por aula (a Sala 1 lê daqui) */
export const VALENTINA_NO_FIM_DA_AULA: readonly string[] = [
  'Brava, Ari! Você responde bonito. Quase tão bonito quanto eu anoto.',
  'Bellissimo! Hoje eu aprendi uma palavra nova e um jeito novo de prender o cabelo. Dia produtivo.',
  'Perfetto. Vocês dois juntos estudando é muito fofo. Fofo e chique, que é a combinação mais difícil.',
  'Allora, até a próxima aula! E venham bem vestidos: aqui também é passarela.',
];

/** a voz dela no balão, para quem monta a aula ler sem importar a classe */
export const NOME_DA_VALENTINA = V;

// ================================================================= O POSTO

/**
 * Põe a Valentina no saguão: o banner, o desfile no canto da entrada, o
 * colisor que anda com ela e a conversa. Com a aula do Módulo 3 chamada ela
 * está na Sala 1, e aqui não põe ninguém (só o banner).
 */
export function montarAValentina(w: WorldBuilder): Valentina | null {
  const P0 = POSTO_DA_VALENTINA;
  w.add(w.place(bannerDosGatitos(), P0.banner.x, 0, P0.banner.z));
  w.blockBox(P0.banner.x, P0.banner.z, 0.48, 0.17);

  const g0 = w.game;
  if (naSalaUm(g0)) return null;

  const valentina = new Valentina({ ...P0.area });
  valentina.group.rotation.y = Math.PI / 4;
  w.add(valentina.group);
  /** gancho de teste: o `scripts/valentina.mjs` mede ela, veste looks e segura o passeio para fotografar */
  valentina.group.userData.teste = { valentina };

  // ela é sólida para a dupla, como o Flynn
  const colisor = { kind: 'circle' as const, x: valentina.x, z: valentina.z, r: 0.34 };
  w.colliders.push(colisor);

  const falar = async (g: GameAPI, falas: readonly Fala[]): Promise<void> => {
    for (const [quem, texto, gesto] of falas) {
      if (gesto === 'examina') valentina.examinar(3);
      else if (gesto === 'posa') valentina.posar(2.8);
      else if (gesto === 'encanta') valentina.encantar(2);
      await conversa(g, [[quem, texto]]);
    }
  };

  const ponto = w.interact({
    id: 'escola:valentina',
    x: valentina.x, z: valentina.z, radius: 1.3,
    label: 'Falar com a Valentina', icon: '🦩',
    highlight: valentina.group,
    onInteract: async (g) => {
      g.lockPlayer(true);
      valentina.entrarEmServico();
      const meio = posicionarParaConversar(g, { x: valentina.x, z: valentina.z }, 1.2, 0.5);
      valentina.encarar(meio.x, meio.z);
      g.focusCamera(valentina.group);
      g.setZoom(8);
      try {
        if (!g.flag(VALENTINA_CONHECIDA)) {
          await falar(g, apresentacao(g));
          g.setFlag(VALENTINA_CONHECIDA);
          g.som('sacudida');
          g.unlock({
            id: 'a-diva-do-marketing',
            title: 'A diva do marketing',
            place: 'Saguão da Escola do Gatito',
            note: 'Uma flamingo de Milão, de blazer dos Gatitos e óculos escuros na cabeça, que olhou a nossa roupa de cima a baixo antes de dizer oi. Criticou, e elogiou logo depois. E vai fazer a aula de português com a gente.',
            icon: '🦩',
          });
          g.toast('Valentina, do marketing dos Gatitos', '🦩');
          return;
        }
        const vez = g.bump('valentina.conversas');
        await falar(g, juizoDaRoupa(g, vez));
        await falar(g, CONVERSAS[(vez - 1) % CONVERSAS.length]);
      } finally {
        g.focusCamera(null);
        g.setZoom(13);
        soltarDaConversa(g);
        valentina.pararDeEncarar();
        valentina.voltarAPassear();
      }
    },
  });

  w.onUpdate((dt) => {
    valentina.update(dt);
    ponto.moveTo(valentina.x, valentina.z);
    colisor.x = valentina.x;
    colisor.z = valentina.z;
  });
  return valentina;
}
