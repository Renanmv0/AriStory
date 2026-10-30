import * as THREE from 'three';
import type { GameAPI } from '../../core/types';
import type { WorldBuilder } from '../../world/WorldBuilder';
import type { Bicho } from '../../entities/bichos/Bicho';
import { LoteDeAboboras, type CaraDeAbobora } from '../../world/halloween/abobora';
import { CHAVE_DA_CACA, PARADAS_DA_CACA, PISTA_DO_FINAL } from '../../world/halloween/mapinha';
import { pocaDeLuz } from '../../world/furniture';
import { PALETTE as P } from '../../palette';
import { FANTASIAS_DA_CACA } from '../../world/itens';
import { FLAG_DO_ONIBUS, faseDoHalloween } from './fase';

/*
 * A CAÇA DE DOCES OU TRAVESSURAS (`docs/HALLOWEEN.md`, §5.3 e §6; a etapa
 * 5a). Na noite da festa, depois que o ônibus chega, a dupla segue as pistas
 * do mapinha da Estella por dez paradas — cada uma é alguém da festa, no
 * posto dele. Na conversa com zoom (`naFesta.ts`), quando é a vez dele, o
 * convidado pergunta "doces ou travessuras?":
 *
 * - 🍬 DOCES: ele dá a bala dele — 3 na cesta, sempre;
 * - 🎃 TRAVESSURA: ele apronta a brincadeira dele, e as balas (de 1 a 5)
 *   dependem de como foi: a HORA CERTA (a agulha que vai e volta embaixo da
 *   fala, `g.horaCerta`) para o granulado do Mano, o BU do Cookie, o frisbee
 *   do Flynn, o ponto do Jean-Luc, a maçã do Capy, o pulo das coelhinhas e o
 *   apito da Gina; uma pergunta para o Gatito, a Josefina e o Noel.
 *
 * Doce ou travessura, a pista da próxima parada vem do mesmo jeito, e vai
 * para o mapinha. A próxima parada fica marcada com uma abóbora acesa
 * flutuando em cima da cabeça (ninguém fica perdido), e quem chega cedo a uma
 * parada que ainda não é a vez dela ouve uma fala pedindo para seguir o
 * mapinha. A última (o Noel) dá a pista do final: a porta da Casinha, que
 * abre com 25 balas.
 *
 * AS PARADAS PARES ENTREGAM UMA FANTASIA INTEIRA (a etapa 5b, §5.2): a
 * abóbora (o Cookie), o pirata (o Jean-Luc), o gato preto (as coelhinhas), o
 * espantalho (a Josefina) e o bruxinho (o Noel) — costuradas pela Estella,
 * direto para o guarda-roupa dos dois (`FANTASIAS_DA_CACA`).
 *
 * As DEZ ABÓBORAS ESCONDIDAS pelo parque, fora do caminho da caça, dão uma
 * bala cada: é o que garante que ninguém fica preso na porta.
 *
 * Tudo no save: as paradas feitas (`halloween:caca`, o mesmo número que o
 * mapinha lê), as balas, quantos doces e quantas travessuras, e cada
 * abóbora escondida já pega.
 *
 * As falas são RASCUNHO (o Renan troca), cada uma no jeito de quem fala.
 */

/** as balas na cesta, e quantas a porta da Casinha pede (§5.3) */
export const CHAVE_DAS_BALAS = 'halloween:balas';
export const BALAS_DA_PORTA = 25;
const CHAVE_DOCES = 'halloween:doces';
const CHAVE_TRAVESSURAS = 'halloween:travessuras';
const BALAS_DO_DOCE = 3;
const flagDaAbobora = (i: number): string => `halloween:abobora-escondida:${i}`;

/** quem fala: um nome, ou a dupla (`@eu` é quem joga, `@par` quem acompanha) */
type Fala = readonly [string, string];
type Falas = readonly Fala[];

/** o acerto da hora certa (0 a 1) em balas (1 a 5) */
export function balasDoAcerto(acerto: number): number {
  if (acerto >= 0.92) return 5;
  if (acerto >= 0.75) return 4;
  if (acerto >= 0.45) return 3;
  if (acerto >= 0.2) return 2;
  return 1;
}

/** a brincadeira de uma parada: devolve as balas que ela deu */
type Travessura = (api: GameAPI, falar: (falas: Falas) => Promise<void>, festejar: () => void) => Promise<number>;

interface Parada {
  /** as etiquetas de quem atende esta parada (as coelhinhas são três) */
  quem: readonly string[];
  /** quem pergunta "doces ou travessuras?" */
  nome: string;
  /** a chegada, e a pergunta (o que vai na caixa das duas escolhas) */
  abre: Falas;
  pergunta: string;
  doce: Falas;
  travessura: Travessura;
  /** a fala antes de dar a pista */
  pista: Falas;
  /** quando a dupla chega antes da vez dela */
  cedo: Falas;
  /**
   * a ENTREGA DA FANTASIA (as paradas pares, a etapa 5b): quem está na parada
   * entrega a fantasia que a Estella costurou, e ela vai para o guarda-roupa
   */
  fantasia?: { nome: string; falas: Falas };
}

/**
 * A TRAVESSURA DE TEMPO: a explicação, a agulha (a ação é de quem joga) e a
 * fala de como foi — `bom` com 4 ou 5 balas, `meio` com 3, `ruim` com 1 ou 2.
 */
const deTempo = (
  antes: Falas,
  acao: string,
  bom: Falas,
  meio: Falas,
  ruim: Falas,
  opts: { periodo?: number; zona?: number; som?: Parameters<GameAPI['som']>[0] } = {},
): Travessura => async (api, falar, festejar) => {
  await falar(antes);
  if (opts.som) api.som(opts.som);
  const balas = balasDoAcerto(await api.horaCerta(acao, undefined, opts));
  if (balas >= 4) festejar();
  await falar(balas >= 4 ? bom : balas === 3 ? meio : ruim);
  return balas;
};

/** A TRAVESSURA DE PERGUNTA: cada resposta com as suas balas e a sua fala */
const dePergunta = (
  antes: Falas,
  quem: string,
  pergunta: string,
  respostas: ReadonlyArray<{ opcao: string; balas: number; falas: Falas }>,
): Travessura => async (api, falar, festejar) => {
  await falar(antes);
  const i = await api.ask(pergunta, respostas.map((r) => r.opcao), quem);
  const r = respostas[Math.max(0, i)];
  if (r.balas >= 4) festejar();
  await falar(r.falas);
  return r.balas;
};

const M = 'Mano';
const C = 'Cookie';
const F = 'Flynn';
const J = 'Jean-Luc';
const CP = 'Capy';
const L = 'Luna';
const S = 'Sol';
const E = 'Estrella';
const GT = 'Gatito';
const JS = 'Josefina';
const G = 'Gina';
const N = 'Noel';

/** AS DEZ PARADAS, na ordem do mapinha (`PARADAS_DA_CACA`) */
const PARADAS: readonly Parada[] = [
  {
    quem: ['mano'], nome: M,
    abre: [[M, 'Muahaha… visitas na minha sorveteria.']],
    pergunta: 'E então, meus queridos: doces… ou travessuras?',
    doce: [[M, 'Doces, claro. Bala de abóbora, feita aqui no quiosque, gelada no ponto.'], [M, 'Muahaha… digo, bom apetite.']],
    travessura: deTempo(
      [[M, 'Travessura? Muahaha! Então abram a boca: o granulado de morcego vai voar!']],
      'Pegar o granulado no ar!',
      [[M, 'Pegou tudo! Nem um morceguinho caiu no chão.'], [M, '… Muahaha. Digo: parabéns.']],
      [[M, 'Metade na boca, metade na capa. Tá ótimo: vampiro come de tudo.']],
      [[M, 'Granulado no cabelo… no nariz… na orelha… Muahaha! Esse sim foi um susto de vampiro.'], [M, 'Toma, umas balinhas pra consolar.']],
      { periodo: 1.4 },
    ),
    pista: [[M, 'E a próxima pista… eu escrevi com calda de chocolate. Brincadeira, foi de caneta.']],
    cedo: [],
  },
  {
    quem: ['cookie'], nome: C,
    abre: [[C, 'Oi…']],
    pergunta: 'Doces ou travessuras? Pode escolher sem pressa. Eu espero.',
    doce: [[C, 'Doces. Toma: os docinhos minúsculos. São os meus favoritos.'], [C, 'Cabem direitinho na tromba. Na mão de vocês também, eu acho.']],
    travessura: deTempo(
      [[C, 'Travessura… tá bom. Eu levanto o lençol e dou um BU.'], [C, 'E vocês dão um BU de volta, bem na hora. Combinado?']],
      'Dar um BU de volta na hora certa!',
      [[C, 'Bu… — AAAH!'], [C, '… Fui eu que me assustei. De novo. Vocês são muito bons nisso.']],
      [[C, 'Buu… — ai! Um susto médio. Um sustinho. Gostei.']],
      [[C, 'Buu. … Vocês nem piscaram.'], [C, 'Tudo bem. Eu ensaio mais pro ano que vem. Toma umas balinhas mesmo assim.']],
      { periodo: 1.6 },
    ),
    pista: [[C, 'A Estella me deu a pista pra entregar. Eu decorei, olha:']],
    cedo: [[C, 'Doces? … Ainda não é a minha vez. O mapinha diz quem vem antes de mim.'], [C, 'Eu espero. Sou bom de esperar.']],
    fantasia: {
      nome: 'abóbora',
      falas: [
        [C, 'Ah… e tem mais uma coisa. A Estella pediu pra eu guardar até vocês chegarem.'],
        [C, 'Uma fantasia de abóbora. Eu escolhi essa porque a abóbora grande ali é minha amiga.'],
        ['@par', 'Tem até carinha! E o chapeuzinho com cabinho!'],
        [C, 'Já tá no guarda-roupa de vocês. Eu dobrei bem devagar, pra não amassar a folha.'],
      ],
    },
  },
  {
    quem: ['flynn'], nome: F,
    abre: [[F, 'AUUUU! Visita no campinho!']],
    pergunta: 'Doces ou travessuras? Escolham rápido, que lobisomem tem pressa!',
    doce: [[F, 'Doce é energia! Balas de goma de lua, pro treino de amanhã.'], [F, 'E bebam água depois, hein!']],
    travessura: deTempo(
      [[F, 'Travessura de lobisomem: um passe de frisbee no escuro!'], [F, 'Eu lanço, vocês pegam. Quanto mais na hora, mais balas. Vão, Gatitos!']],
      'Pegar o frisbee!',
      [[F, 'NA MÃO! AUUUUU! Isso foi passe de campeonato!']],
      [[F, 'Pegou com a ponta dos dedos! Vale! Vale muito!']],
      [[F, 'Passou raspando… e foi parar perto do lago. Tudo bem, eu busco.'], [F, 'Toma, balinha de consolação. Faz parte do treino!']],
      { periodo: 1.2, som: 'lancar' },
    ),
    pista: [[F, 'E a pista da próxima! Eu li correndo, mas acho que é assim:']],
    cedo: [[F, 'Calma, calma! Na corrida tem ordem.'], [F, 'Sigam a pista do mapinha, que eu tô aqui esperando. AUUU!']],
  },
  {
    quem: ['jean-luc'], nome: J,
    abre: [[J, 'Bonsoir, mes amis. Bonbons… ou une petite travessura?']],
    pergunta: 'Doces ou travessuras? Choisissez.',
    doce: [[J, 'Bonbons. Des pirulitos de olho.'], [J, 'Ils vous regardent. C\'est normal. É Halloween.']],
    // o ponto de ping pong: ganhou, 5 balas; perdeu, 1 (§6)
    travessura: async (api, falar, festejar) => {
      await falar([[J, 'Une travessura? Alors… un point de ping pong. Un seul.'], [J, 'Se ganharem, cinq bonbons. Se perderem… un bonbon de consolation.']]);
      api.som('quicar');
      const ganhou = (await api.horaCerta('Rebater na hora certa!', undefined, { periodo: 1.1 })) >= 0.75;
      api.som('quicar');
      if (ganhou) {
        festejar();
        await falar([[J, 'Mon Dieu… Ce soir, le fantôme a perdu.'], [J, 'Cinq bonbons, comme promis. Un fantôme cumpre a palavra.']]);
        return 5;
      }
      await falar([[J, 'Hon hon. O fantasma do lago não perde no escuro.'], [J, 'Un bonbon de consolation. Revanche no ano que vem, mes amis.']]);
      return 1;
    },
    pista: [[J, 'Et voilà la pista. Em voz baixa, com mistério:']],
    cedo: [[J, 'Pas encore. O mistério tem uma ordem, mes amis.'], [J, 'Leiam o mapinha. Je vous attends.']],
    fantasia: {
      nome: 'pirata',
      falas: [
        [J, 'Et voilà, un cadeau da madame Estella. Para os piratas do meu lago.'],
        [J, 'Chapéu de três pontas, une épée de bois… et un perroquet.'],
        ['@eu', 'Um papagaio! Ele vai no ombro?'],
        [J, 'Naturellement. Ele ainda não fala francês. Já está no guarda-roupa de vocês, mes amis.'],
      ],
    },
  },
  {
    quem: ['capy'], nome: CP,
    abre: [[CP, 'Tum-tum… tum-tum… O tubarão do bem pergunta:']],
    pergunta: 'Doces ou travessuras?',
    doce: [[CP, 'Doces! Maçãs do amor… pequenininhas. Cabem na cesta, eu medi.']],
    travessura: deTempo(
      [[CP, 'Travessura do tubarão: pescar maçã com a boca, na bacia!'], [CP, 'Mão pra trás, e mergulha na hora certa. Eu fico de olho: salva-vidas é salva-vidas.']],
      'Mergulhar na hora certa!',
      [[CP, 'De primeira! Tubarão nenhum pesca melhor que isso.'], [CP, 'Tum-tum-tum-tum! … É a música da vitória.']],
      [[CP, 'Pegou na segunda! Nariz molhado, mas maçã na boca. Vale!']],
      [[CP, 'Molhou até a sobrancelha… e a maçã fugiu nadando.'], [CP, 'Ninguém sai triste da minha bacia: toma umas balas.']],
      { periodo: 1.5, som: 'agua' },
    ),
    pista: [[CP, 'A pista eu guardei num saquinho, pra não molhar:']],
    cedo: [[CP, 'Tum-tum… ainda não! O tubarão espera a vez dele.'], [CP, 'Olhem o mapinha da Estella.']],
  },
  {
    quem: ['luna', 'sol', 'estrella'], nome: L,
    abre: [[L, '¡ÉPALE! ¡Doces ou travessuras!'], [S, 'Luna… quem pergunta somos NÓS. Eles que vieram buscar.'], [L, '¡Ay, verdad! De novo, então:']],
    pergunta: 'Doces ou travessuras?',
    doce: [[S, '¡Dulces! Pipoca de caramelo, um saquinho de cada uma!'], [E, 'Três saquinhos. Pra ser justo.']],
    travessura: deTempo(
      [[L, '¡Travesura! A gente conta: uno, dos, tres…'], [S, '… e no ¡YA! todo mundo pula junto! ¡Bien alto!']],
      '¡YA! Pular junto!',
      [[S, '¡SINCRONIZADOS! ¡Qué fino!'], [L, '¡Uh-uh! Até a coruja voou!']],
      [[L, '¡Casi casi! Meio segundo depois, mas com estilo.']],
      [[E, 'Tudo bem. Pular atrasado também é pular.'], [S, '¡Y fue chévere igual! Toma, pipoca de consolo.']],
      { periodo: 1.3 },
    ),
    pista: [[E, 'A pista. Eu li duas vezes, pra entregar certinho:']],
    cedo: [[L, '¡Epa! Ainda não é a nossa vez, panas.'], [E, 'O mapinha da Estella sabe a ordem. Sigam ele, tá?']],
    fantasia: {
      nome: 'gato preto',
      falas: [
        [L, '¡Y AHORA el regalo! A Estella deixou com a gente pra entregar!'],
        [S, '¡Una fantasia de gatito preto! Com orelhinha, luva de patinha e rabo de laço!'],
        [E, 'O rabo balança quando vocês andam. A gente testou.'],
        [L, '¡Ya está no guarda-roupa de vocês! ¡Miau!'],
      ],
    },
  },
  {
    quem: ['gatito'], nome: GT,
    abre: [[GT, 'Au. … Hoje até a pergunta é uma lição.']],
    pergunta: 'Doces ou travessuras?',
    doce: [[GT, 'Doces. Biscoitos de gato preto.'], [GT, '… Eu sei. Eu vim de Walter. Mas o biscoito é de gato.']],
    travessura: dePergunta(
      [[GT, 'Travessura de professor: uma pergunta de português de Halloween.']],
      GT,
      'Como se diz "bruja" em português?',
      [
        { opcao: 'Bruxa', balas: 5, falas: [[GT, 'Bruxa, com X. Muito bem! Vocês estudaram.'], [GT, 'Nota dez. … Six seven.']] },
        { opcao: 'Bruja', balas: 2, falas: [[GT, 'Quase! Em espanhol é bruja, com J. Em português, bruxa, com X.'], [GT, 'Errar faz parte da aula. Toma.']] },
        { opcao: 'Vassoura', balas: 2, falas: [[GT, 'Vassoura é o que a bruxa usa pra voar! A palavra é bruxa.'], [GT, 'Mas a lógica foi boa. Toma.']] },
      ],
    ),
    pista: [[GT, 'E a pista. Leiam com atenção, que tem palavra nova:']],
    cedo: [[GT, 'Uma coisa de cada vez.'], [GT, 'Primeiro a pista do mapinha, depois o Gatito. É o plano da aula.']],
  },
  {
    quem: ['josefina'], nome: JS,
    abre: [[JS, 'Ah, oi, vocês dois. Pensem com calma:']],
    pergunta: 'Doces ou travessuras?',
    doce: [[JS, 'Doces. Bombom de bolo de abóbora, da horta, embrulhadinho.']],
    travessura: dePergunta(
      [[JS, 'Travessura? Então vou contar uma história de fantasma. Bem devagar…'], [JS, 'Era uma vez um fantasma que só tomava sorvete. Todo dia, o mesmo sabor.']],
      JS,
      'Qual era o sabor favorito do fantasma?',
      [
        { opcao: 'Sorvete de BUnilha 🍦', balas: 5, falas: [[JS, 'BUnilha! Hihi… acertaram. Essa eu guardei o ano inteiro.']] },
        { opcao: 'Suspiro', balas: 4, falas: [[JS, 'Suspiro… que bonito. Fantasma suspira mesmo. Mas era BUnilha.'], [JS, 'Hihi. Vale quase tudo.']] },
        { opcao: 'Pé de moleque', balas: 3, falas: [[JS, 'Pé de moleque? Fantasma não tem pé, queridos. Era BUnilha!'], [JS, 'Hihi… desculpa. Toma.']] },
      ],
    ),
    pista: [[JS, 'E a pista, que a Estella me pediu pra guardar. Com calma:']],
    cedo: [[JS, 'Sem pressa. Sigam as pistas na ordem.'], [JS, 'As abóboras não fogem, e eu também não.']],
    fantasia: {
      nome: 'espantalho',
      falas: [
        [JS, 'Ah, e antes que eu esqueça… a Estella deixou isto comigo.'],
        [JS, 'Uma fantasia de espantalho. Combina com a horta, não acham?'],
        [JS, 'Tem até um corvinho no chapéu. Ele não assusta ninguém. Nem os corvos.'],
        [JS, 'Já guardei no guarda-roupa de vocês. Sem pressa pra vestir.'],
      ],
    },
  },
  {
    quem: ['girafa'], nome: G,
    abre: [[G, 'Boa noiteee! Ordem da casa: tem que escolher!']],
    pergunta: 'Doces ou travessuras?',
    doce: [[G, 'Doce! Bala de goma de aranha! Pode comer, ela não pica.']],
    travessura: deTempo(
      [[G, 'Travessura? Então quero ver! Quando eu apitar, todo mundo congela na pose de fantasma!'], [G, 'Na hora certa, viu? Nem antes, nem depois.']],
      'Congelar no apito!',
      [[G, 'Pose perfeita! Nem o véu mexeu. Ordem da casa cumprida!']],
      [[G, 'Mexeu um tiquinho… mas a pose ficou linda. Passa!']],
      [[G, 'Ih, congelou atrasado! Parecia um fantasma com soluço.'], [G, 'Toma umas balinhas. Na festa ninguém sai de mão vazia.']],
      { periodo: 1.3, som: 'apito' },
    ),
    pista: [[G, 'E agora a pista. Eu li lá de cima, com o pescoço todo:']],
    cedo: [[G, 'Ei, ei! Fila é fila, até na festa.'], [G, 'Sigam o mapinha. Ordem da casa!']],
  },
  {
    quem: ['noel'], nome: N,
    abre: [[N, 'VOCÊS CHEGARAM! O experimento final!']],
    pergunta: 'Doces ou travessuras? RÁPIDO!',
    doce: [[N, 'DOCES! Bala-poção! Muda de cor na boca!'], [N, 'Experimento aprovado! … Eu acho. A laranja eu ainda não sei.']],
    travessura: dePergunta(
      [[N, 'TRAVESSURA! Vocês vão me ajudar a terminar a poção!']],
      N,
      'Qual ingrediente vai no caldeirão?',
      [
        { opcao: 'Pó de estrela ✨', balas: 5, falas: [[N, 'PÓ DE ESTRELA! Olha a fumacinha! Roxa, laranja, verde… FUNCIONOU!'], [N, 'É CIÊNCIA!']] },
        { opcao: 'Gosma verde 🟢', balas: 4, falas: [[N, 'Gosma… borbulhou! Borbulhou MUITO! Afastem-se!'], [N, '… Brincadeira, é só bolha.']] },
        { opcao: 'Asa de morcego 🦇', balas: 3, falas: [[N, 'Asa de morcego… de pelúcia. Fez "puf". Um puf pequeno.'], [N, 'Ciência também é puf!']] },
      ],
    ),
    pista: [[N, 'E agora, a última pista! A MAIS IMPORTANTE! Ela leva pro final!']],
    cedo: [[N, 'Ainda NÃO! O experimento tem ordem!'], [N, 'Primeiro as outras pistas, DEPOIS o laboratório!']],
    fantasia: {
      nome: 'bruxinho',
      falas: [
        [N, 'E AGORA… O PRESENTE FINAL! A Estella me deu pra entregar!'],
        [N, 'Uma fantasia de BRUXINHO! Com capa de estrelinhas e VASSOURA!'],
        [N, 'A vassoura não voa. Eu testei. Duas vezes.'],
        [N, 'Tá no guarda-roupa de vocês! EXPERIMENTO CONCLUÍDO!'],
      ],
    },
  },
];

/**
 * AS ABÓBORAS ESCONDIDAS (§5.3): uma bala cada, longe do caminho da caça —
 * nos cantos do parque, atrás de arbusto, perto da cerca. Os pontos foram
 * medidos contra o colisor e as árvores do parque.
 */
const ESCONDIDAS: ReadonlyArray<{ x: number; z: number; cara: CaraDeAbobora }> = [
  { x: -28, z: -8, cara: 'piscando' },
  { x: -6, z: 6, cara: 'sorriso' },
  { x: 24, z: -6, cara: 'dentinho' },
  { x: 5, z: -33, cara: 'susto' },
  { x: -14, z: -31, cara: 'sorriso' },
  { x: 28, z: 26, cara: 'piscando' },
  { x: -34, z: -2, cara: 'dentinho' },
  { x: 14, z: -28, cara: 'sorriso' },
  { x: 22, z: 30, cara: 'susto' },
  { x: -36, z: -24, cara: 'piscando' },
];

export interface ElencoDaCaca {
  /** quem tem esta etiqueta na festa (o bicho no posto) */
  bicho(peca: string): Bicho | null;
  /** o gesto de alegria de quem tem esta etiqueta (o mesmo da chegada da conversa) */
  festejar(peca: string): void;
}

export interface CacaDaFesta {
  /** a vez desta etiqueta na caça: a parada é ele agora, ainda não é, já foi — ou ele não é parada */
  vez(api: GameAPI, peca: string): 'agora' | 'cedo' | 'feita' | null;
  /** a parada dele, já de perto (a conversa chama depois da apresentação) */
  parar(api: GameAPI, peca: string): Promise<void>;
}

export function montarACaca(w: WorldBuilder, elenco: ElencoDaCaca): CacaDaFesta {
  const g0 = w.game;
  const ativa = (api: GameAPI): boolean => faseDoHalloween(api) === 'festa' && api.flag(FLAG_DO_ONIBUS);
  const feitas = (api: GameAPI): number => api.stat(CHAVE_DA_CACA);
  const indice = (peca: string): number => PARADAS.findIndex((p) => p.quem.includes(peca));

  const mostrar = (api: GameAPI): void => api.mostrarCesta({ balas: api.stat(CHAVE_DAS_BALAS), meta: BALAS_DA_PORTA });
  const dar = (api: GameAPI, balas: number): void => {
    api.bump(CHAVE_DAS_BALAS, balas);
    api.som('balas');
    api.toast(`+${balas} ${balas === 1 ? 'bala' : 'balas'} na cesta`, '🍬');
    mostrar(api);
  };
  /** diz as falas na ordem, trocando `@eu`/`@par` pelos nomes da dupla */
  const falarCom = (api: GameAPI) => async (falas: Falas): Promise<void> => {
    for (const [quem, texto] of falas) {
      const nome = quem === '@eu' ? api.playerName() : quem === '@par' ? api.companionName() : quem;
      await api.say([texto], nome);
    }
  };

  const caca: CacaDaFesta = {
    vez(api, peca) {
      const i = indice(peca);
      if (i < 0 || !ativa(api)) return null;
      const n = feitas(api);
      return i === n ? 'agora' : i > n ? 'cedo' : 'feita';
    },
    async parar(api, peca) {
      const vez = caca.vez(api, peca);
      const falar = falarCom(api);
      const i = indice(peca);
      if (vez === 'cedo') {
        await falar(PARADAS[i].cedo);
        return;
      }
      if (vez !== 'agora') return;
      const p = PARADAS[i];
      await falar([['@eu', 'Doces ou travessuras! 🎃'], ...p.abre]);
      const escolha = await api.ask(p.pergunta, ['🍬 Doces!', '🎃 Travessura!'], p.nome);
      if (escolha === 0) {
        await falar(p.doce);
        api.bump(CHAVE_DOCES);
        dar(api, BALAS_DO_DOCE);
      } else {
        const balas = await p.travessura(api, falar, () => {
          for (const q of p.quem) elenco.festejar(q);
        });
        api.bump(CHAVE_TRAVESSURAS);
        dar(api, balas);
      }
      // a FANTASIA das paradas pares (a 5b): direto para o guarda-roupa dos dois
      if (p.fantasia) {
        await falar(p.fantasia.falas);
        for (const peca of FANTASIAS_DA_CACA[i + 1] ?? []) api.ganharPeca(peca);
        api.som('caixa');
        api.toast(`Fantasia de ${p.fantasia.nome} no guarda-roupa`, '🎃');
      }
      // a pista da próxima (o Noel dá a do final), e ela vai para o mapinha
      const ultima = i === PARADAS.length - 1;
      const pista = ultima ? PISTA_DO_FINAL : PARADAS_DA_CACA[i + 1].pista;
      await falar([...p.pista, [p.nome, `“${pista}”`]]);
      api.bump(CHAVE_DA_CACA);
      api.toast(ultima ? 'A pista do final no mapinha' : 'Pista nova no mapinha', '🗺️');
      api.som('memoria');
      if (ultima) {
        const balas = api.stat(CHAVE_DAS_BALAS);
        const falta = BALAS_DA_PORTA - balas;
        await falar(
          falta <= 0
            ? [['@par', `A cesta tá cheia: ${balas} balas!`], ['@eu', 'Então vamos. Atrás da roda, onde a cerca fecha o mato…']]
            : [['@par', `${balas} balas… e a porta pede ${BALAS_DA_PORTA}.`], ['@eu', `Faltam ${falta}. Será que tem mais abóbora escondida pelo parque?`]],
        );
      }
    },
  };

  // ------------------------------------------------ a abóbora da próxima parada
  /*
   * Uma abóbora média acesa flutuando em cima da cabeça de quem é a próxima
   * parada, subindo e descendo devagar; e embaixo, no chão, uma poça de
   * luz laranja respirando em volta dele (um halo atrás da abóbora, que
   * chegou a ser tentado, virava um quadrado de borda — parecia placa). A abóbora
   * sozinha se perdia na frente da sorveteria (laranja contra laranja): é a
   * luz no chão que se lê de longe, de qualquer giro da câmera. Luz PINTADA,
   * nenhuma luz de verdade. Some durante as falas (a conversa de zoom chega
   * perto, e ela ficaria no meio do quadro).
   */
  const marca = w.add(new LoteDeAboboras().por({ x: 0, z: 0, tamanho: 'media', cara: 'sorriso', giro: Math.PI / 4 }).montar({ acesas: true, semPoca: true }));
  marca.name = 'marca-da-proxima-parada';
  marca.visible = false;
  const luzDaParada = w.add(pocaDeLuz(1.3, P.luzDeAbobora, 0.9));
  luzDaParada.name = 'luz-da-proxima-parada';
  luzDaParada.visible = false;
  const caixa = new THREE.Box3();
  /** a próxima parada que a marca segue, e a altura da cabeça dele */
  let seguindo: { n: number; bicho: Bicho; alto: number } | null = null;

  // --------------------------------------------------- as abóboras escondidas
  const lote = new LoteDeAboboras();
  for (const a of ESCONDIDAS) lote.por({ x: a.x, z: a.z, tamanho: 'pequena', cara: a.cara, giro: Math.PI / 4 });
  const escondidas = w.add(lote.montar({ acesas: true }));
  escondidas.name = 'aboboras-escondidas';
  escondidas.userData.peca = 'aboboras-escondidas';
  escondidas.visible = false;
  const pontos = ESCONDIDAS.map((a, i) => {
    if (g0.flag(flagDaAbobora(i))) lote.esconder(i);
    const it = w.interact({
      id: `halloween:abobora-escondida-${i}`,
      x: a.x, z: a.z, radius: 1.2,
      label: 'Pegar a abóbora escondida',
      icon: '🎃',
      priority: 2,
      onInteract: async (api) => {
        if (api.flag(flagDaAbobora(i))) return;
        api.setFlag(flagDaAbobora(i));
        lote.esconder(i);
        it.enabled = false;
        api.som('pegar');
        dar(api, 1);
        const achadas = ESCONDIDAS.filter((_, k) => api.flag(flagDaAbobora(k))).length;
        api.toast(`Abóbora escondida ${achadas}/${ESCONDIDAS.length}`, '🎃');
        if (!api.flag('halloween:viu:abobora-escondida')) {
          api.setFlag('halloween:viu:abobora-escondida');
          await api.say(['Uma abóbora escondida! E tinha uma bala dentro.'], api.companionName());
        }
      },
    });
    it.enabled = false;
    return it;
  });

  // ---------------------------------------------------------------- o relógio
  let ligada = false;
  let tempo = 0;
  w.onUpdate((dt) => {
    tempo += dt;
    const agora = ativa(g0);
    if (agora !== ligada) {
      ligada = agora;
      escondidas.visible = agora;
      if (agora) {
        mostrar(g0);
        // quem passou de uma parada par antes de ela dar fantasia (o save do
        // teste, o da 5a) recebe a fantasia agora, sem cerimônia
        for (const [parada, pecas] of Object.entries(FANTASIAS_DA_CACA)) {
          if (feitas(g0) >= Number(parada)) for (const peca of pecas) g0.ganharPeca(peca);
        }
      } else g0.mostrarCesta(null);
    }
    if (!agora) {
      marca.visible = luzDaParada.visible = false;
      return;
    }
    pontos.forEach((it, i) => (it.enabled = !g0.flag(flagDaAbobora(i))));
    lote.tremer(tempo);

    const n = feitas(g0);
    if (n >= PARADAS.length) {
      marca.visible = luzDaParada.visible = false;
      return;
    }
    if (seguindo?.n !== n) {
      const bicho = elenco.bicho(PARADAS[n].quem[0]);
      if (bicho) {
        caixa.setFromObject(bicho.group);
        seguindo = { n, bicho, alto: caixa.max.y - bicho.group.position.y };
      } else seguindo = null;
    }
    marca.visible = luzDaParada.visible = !!seguindo && !g0.emDialogo();
    if (seguindo) {
      marca.position.set(seguindo.bicho.x, seguindo.alto + 0.5 + Math.sin(tempo * 2.2) * 0.1, seguindo.bicho.z);
      marca.rotation.y = Math.sin(tempo * 0.9) * 0.35;
      luzDaParada.position.set(seguindo.bicho.x, 0.02, seguindo.bicho.z);
      luzDaParada.scale.setScalar(1 + Math.sin(tempo * 2.2) * 0.08);
    }
  });

  // o gancho do teste: a vez de cada um, as balas e os pontos escondidos
  marca.userData.caca = {
    feitas: () => feitas(g0),
    balas: () => g0.stat(CHAVE_DAS_BALAS),
    escondidas: ESCONDIDAS.map((a) => ({ x: a.x, z: a.z })),
    paradas: PARADAS.map((p) => p.quem[0]),
  };
  return caca;
}
