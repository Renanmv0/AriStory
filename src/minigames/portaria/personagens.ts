/**
 * OS PERSONAGENS DA PORTARIA — quem são, como falam e como se mexem.
 *
 * O pedido do Renan (2026-11-20): "cada um com uma personalidade BEM distinta,
 * para os personagens serem memoráveis e a gente conseguir lembrar dos que
 * aparecem muitas vezes", e "para cada personagem, alguma animação específica".
 * A ficha de cada um tem a personalidade em uma linha, o bordão, o JEITO de
 * responder às perguntas (§6 do plano), as falas de cada momento (chegar,
 * entrar, ser barrado, ser apontado à toa, ser pego, ouvir a mesma pergunta
 * de novo) e os NOMES das animações — a cena (etapa 6 do §14) implementa
 * cada uma; a descrição está no §11 de `docs/PORTARIA-DO-CLUBE.md` e no
 * comentário de cada ficha.
 *
 * Os bichos do jogo continuam sendo eles mesmos: a voz é a que já têm (todos
 * chamam a dupla de "bebitos"); os novos nascem aqui.
 */
import type { Assunto, Desfecho, Especie, Retrato } from './tipos';

/** o jeito de RESPONDER às perguntas (§6): é o que deixa a transcrição com a cara de cada um */
export type Jeito =
  | 'sincero' | 'enrolado' | 'vaidoso' | 'certinho' | 'desencanado' | 'apressado' | 'dorminhoco'
  | 'brincalhao' | 'teimoso' | 'sonolento' | 'timido' | 'resmungao'
  | 'afobado' | 'doce' | 'seguranca' | 'dramatico' | 'elegante' | 'animado' | 'fofo'
  | 'professor' | 'carinhosa' | 'atleta' | 'marrento' | 'diva' | 'formal';

/** as cinco animações de todo visitante (§5): a cena acha cada uma pelo nome */
export interface AnimacoesDaPortaria {
  /** como ele chega até a janela */
  chegada: string;
  /** o que ele faz enquanto espera (o tique) */
  tique: string;
  /** como ele passa pela cancela */
  entra: string;
  /** como ele vai embora barrado */
  barrado: string;
  /** a reação a ser apontado (pego ou à toa) */
  apontado: string;
}

export interface FichaDaPortaria {
  id: string;
  /** o nome no papel e na fala (o figurante ganha o nome sorteado no lugar) */
  nome: string;
  icone: string;
  /** o rosto de sempre (o figurante sorteia a cor e a marca) */
  retrato: Retrato;
  /** a personalidade em UMA linha, para lembrar */
  personalidade: string;
  jeito: Jeito;
  /** o bordão: é a primeira coisa que ele diz na janela */
  bordao: string;
  /** o que mais ele pode dizer ao chegar (sorteado depois do bordão) */
  chegada: readonly string[];
  entra: readonly string[];
  barrado: readonly string[];
  /** apontado sem diferença nenhuma */
  aToa: readonly string[];
  /** a mesma pergunta de novo */
  irritado: readonly string[];
  /** a resposta ao "Veio fazer o quê?" */
  motivo: readonly string[];
  /** o que ele faz quando é pego (o roteiro de um dia pode trocar) */
  desfecho: Desfecho;
  /** a fala de quando é pego */
  pego: readonly string[];
  animacoes: AnimacoesDaPortaria;
}

const R = (especie: Especie, cor: string, marca: string | null = null, extra: Partial<Retrato> = {}): Retrato => ({
  especie, cor, marca, ...extra,
});

// ================================================== OS RECORRENTES NOVOS (§11)

/**
 * SEU HIPÓLITO, o hipopótamo — o sócio mais antigo, folgado e encantador; acha
 * que antiguidade vale mais que carteirinha. Nunca mente: ENROLA (toda
 * resposta vira uma desculpa nova).
 * Chega de chinelo, toalha no ombro e a boia de patinho, se abanando com a
 * carteirinha; apoia a papada no balcão e o tampo RANGE; apontado, revira os
 * bolsos e tira coisa (o pato, os óculos, um sanduíche) até achar a mesma
 * carteirinha; entra girando a toalha ("AÊ!"); barrado, suspira e EMBAÇA o vidro.
 */
const HIPOLITO: FichaDaPortaria = {
  id: 'hipolito', nome: 'Seu Hipólito', icone: '🦛',
  retrato: R('hipopotamo', 'lilas', 'pintasNoFocinho'),
  personalidade: 'o sócio mais antigo do clube: folgado, encantador, e acha que antiguidade vale mais que carteirinha',
  jeito: 'enrolado',
  bordao: 'Meu filho, eu sou sócio desde quando isso aqui era brejo!',
  chegada: ['Bom dia, minha filha! Que calor, hein? A piscina me chama.', 'Ô, guarita nova! No meu tempo era uma cadeira e um guarda-sol.'],
  entra: ['AÊ! Isso é que é portaria!', 'Obrigado, meu filho. Eu sabia que vocês eram gente boa.'],
  barrado: ['Brejo, meu filho. ERA UM BREJO. E eu já tava aqui.', 'Tá bom, tá bom… eu volto. Com a carteirinha. Talvez.'],
  aToa: ['Tá me estranhando, meu filho? Esse aí sou eu, ué.', 'Olha bem: mesma papada, mesmo charme.'],
  irritado: ['Já falei, minha filha. Eu falo devagar, mas falo uma vez só.'],
  motivo: ['Boiar. Eu sou um especialista em boiar.', 'Tomar um solzinho e boiar. Nessa ordem.'],
  desfecho: 'seEnrola',
  pego: ['Vencida? Ela tá é MADURA, meu filho.', 'Ah, essa daí é a velha. A nova tá no outro calção.', 'A foto molhou, por isso parece vencida.'],
  animacoes: {
    chegada: 'hipolito:abanandoACarteirinha',
    tique: 'hipolito:papadaNoBalcao',
    entra: 'hipolito:girandoAToalha',
    barrado: 'hipolito:suspiroQueEmbaca',
    apontado: 'hipolito:revirandoOsBolsos',
  },
};

/**
 * DONA ALPACINA, a alpaca — a vaidosa do clube; cada dia um penteado, e cada
 * penteado é um evento. Responde certo, mas sempre volta ao cabelo.
 * Chega jogando a franja (a cabeleira balança atrasada); ajeita um fio no
 * reflexo do vidro; apontada, levanta a franja e mostra a pinta do focinho;
 * entra mandando beijinho e fazendo selfie; barrada, o penteado MURCHA.
 */
const ALPACINA: FichaDaPortaria = {
  id: 'alpacina', nome: 'Dona Alpacina', icone: '🦙',
  retrato: R('alpaca', 'creme', 'pintaNoFocinho', { cabelo: 'franja' }),
  personalidade: 'a vaidosa do clube: um penteado novo por dia, e cada penteado é um evento',
  jeito: 'vaidoso',
  bordao: 'Repara não, amores: penteado novo!',
  chegada: ['Bom diaaa, amores. Sentiram o perfume? É de camomila.', 'Hoje acordei inspirada. Dá pra ver, né?'],
  entra: ['Beijinho, amores! Vou postar a cancela subindo.', 'Obrigadaaa. Vocês têm um olho ótimo pra beleza.'],
  barrado: ['Barrada? EU? Com ESTE cabelo?', 'Tudo bem… mas o cabelo não merecia isso.'],
  aToa: ['Ah, tá olhando o cabelo? Pode olhar, amor, é de graça.', 'É o CABELO, amor, o rosto é o mesmo! Olha a pintinha.'],
  irritado: ['Amor, eu já respondi. Presta atenção em mim, não só no cabelo.'],
  motivo: ['Mostrar ESTE cabelo.', 'Tomar sol de lado, pra não amassar o penteado.'],
  desfecho: 'confessa',
  pego: ['Ai, que vergonha… tá bom, não sou eu.'],
  animacoes: {
    chegada: 'alpacina:jogandoAFranja',
    tique: 'alpacina:ajeitandoNoReflexo',
    entra: 'alpacina:selfieNaCancela',
    barrado: 'alpacina:penteadoMurcha',
    apontado: 'alpacina:levantandoAFranja',
  },
};

/**
 * A ALPACONA, a prima da Alpacina — o mesmo penteado da prima, a carteirinha
 * da prima, e nenhuma pinta no focinho (o teste do rosto de verdade, dia 4).
 * Fala igualzinho à prima, mas mais grave e mais nervosa.
 */
const ALPACONA: FichaDaPortaria = {
  id: 'alpacona', nome: 'Alpacona', icone: '🦙',
  retrato: R('alpaca', 'creme', null, { cabelo: 'tranca' }),
  personalidade: 'a prima da Alpacina: copia o penteado, a pose e a carteirinha — só esqueceu a pinta',
  jeito: 'vaidoso',
  bordao: 'Repara não, amores: penteado… novo!',
  chegada: ['Sou eu, a Alpacina. A de sempre. Com o cabelo de sempre.'],
  entra: ['Obrigada! A minha prima… digo, EU agradeço.'],
  barrado: ['A Alpacina vai saber disso. Digo… eu vou saber.'],
  aToa: ['Tá olhando o quê? O cabelo? É o da prima. MEU, digo.'],
  irritado: ['Já falei, amor. Sou a Alpacina. A de sempre.'],
  motivo: ['Tomar sol. Como a Alpacina. Que sou eu.'],
  desfecho: 'confessa',
  pego: ['Tá bom, tá bom! Sou a prima dela. A pinta, né? Eu sempre esqueço a pinta.'],
  animacoes: {
    chegada: 'alpacona:jogandoAFranjaDuro',
    tique: 'alpacona:olhandoPraTras',
    entra: 'alpacona:correndoDeLado',
    barrado: 'alpacona:penteadoCai',
    apontado: 'alpacona:tapandoOFocinho',
  },
};

/**
 * BENTO, o gêmeo certinho — gravatinha-borboleta, sabe o número de cor, fala
 * rápido e confere o relógio. A pinta na orelha ESQUERDA é dele.
 * Chega ajeitando a gravata; bate o pé esperando; entra na ponta dos pés;
 * apontado sem motivo, sua; barrado, fica revoltado mas educado.
 */
const BENTO: FichaDaPortaria = {
  id: 'bento', nome: 'Bento', icone: '🐷',
  retrato: R('porquinho', 'rosa', 'pintaNaOrelhaEsquerda', { enfeite: 'gravatinha' }),
  personalidade: 'o gêmeo certinho: gravatinha, relógio, número de cor e uma pressa educada',
  jeito: 'certinho',
  bordao: 'Tudo nos conformes, tudo nos conformes.',
  chegada: ['Bom dia. Cheguei três minutos adiantado, como sempre.', 'Documentos em ordem, em ordem alfabética.'],
  entra: ['Obrigado. Muito eficiente. Vou anotar no meu caderninho.', 'Perfeito. Nos conformes.'],
  barrado: ['Com todo o respeito: isso NÃO está nos conformes.', 'Vou levar isso à diretoria. Educadamente.'],
  aToa: ['É-é a minha foto, sim. A pinta, olha. Na orelha esquerda.', 'Eu… eu fiz alguma coisa errada? Eu nunca faço.'],
  irritado: ['Já respondi, mas respondo de novo, com prazer: está tudo nos conformes.'],
  motivo: ['Natação, das dez às dez e quarenta. Depois, leitura.'],
  desfecho: 'confessa',
  pego: ['Isso foi um engano. Um engano nos conformes.'],
  animacoes: {
    chegada: 'bento:ajeitandoAGravata',
    tique: 'bento:batendoOPe',
    entra: 'bento:pontaDosPes',
    barrado: 'bento:revoltadoEducado',
    apontado: 'bento:suando',
  },
};

/**
 * BETO, o gêmeo desencanado — boné para trás, chiclete, "relaxa"; não é sócio
 * (até o sábado). Perguntado o número, chuta. Sem a pinta na orelha.
 * Chega deslizando com a mão no bolso; faz bola de chiclete que ESTOURA;
 * pego, fica VERMELHO (o rosa escurece) e confessa rindo; entra fazendo
 * "toca aqui" no ar; barrado, dá de ombros.
 */
const BETO: FichaDaPortaria = {
  id: 'beto', nome: 'Beto', icone: '🐷',
  retrato: R('porquinho', 'rosa', null, { enfeite: 'bone' }),
  personalidade: 'o gêmeo desencanado: boné para trás, chiclete, e a carteirinha do irmão no bolso',
  jeito: 'desencanado',
  bordao: 'Relaxa, é rapidinho.',
  chegada: ['E aí, beleza? Bonita a guarita, hein.', 'Ó, tá tudo aí. Pode carimbar.'],
  entra: ['Valeu! Toca aqui. No ar mesmo.', 'Show. Sabia que ia dar bom.'],
  barrado: ['De boa. Eu tento de novo amanhã.', 'Tranquilo, tranquilo. Sem estresse.'],
  aToa: ['Que foi? Sou eu, ué. Bonitão.'],
  irritado: ['Mano… já falei, né?'],
  motivo: ['Dar um mergulho. Rapidinho.'],
  desfecho: 'confessa',
  pego: ['Hahaha, pegaram! É do Bento. Ele nem tá usando agora.'],
  animacoes: {
    chegada: 'beto:deslizandoComAMaoNoBolso',
    tique: 'beto:bolaDeChiclete',
    entra: 'beto:tocaAquiNoAr',
    barrado: 'beto:deOmbros',
    apontado: 'beto:ficandoVermelho',
  },
};

/**
 * TATÁ, o tamanduá do Papita Delivery — o entregador mais apressado da cidade;
 * vive no celular e fala por mensagem (frases curtas, sem verbo). Lê a
 * entrega no celular, às vezes a de OUTRO pedido.
 * Chega de patinete, derrapando; bate o pé e a mochila térmica apita; pega a
 * caneta com a LÍNGUA e assina sozinho; pego, rola a tela: "Ih. Clube errado.";
 * entra numa curva fechada com buzininha; barrado, dá uma estrela no app.
 */
const TATA: FichaDaPortaria = {
  id: 'tata', nome: 'Tatá', icone: '🛵',
  retrato: R('tamandua', 'caramelo', 'faixaNoPeito', { enfeite: 'boneDoPapita' }),
  personalidade: 'o entregador mais apressado da cidade: vive no celular e fala por mensagem',
  jeito: 'apressado',
  bordao: 'Entrega! Assina! Rapidinho!',
  chegada: ['Papita Delivery! Pedido saindo! Digo, chegando!', 'Oi! Tchau! Assina aqui!'],
  entra: ['Valeu! Cinco estrelas!', 'Entregue! Próximo!'],
  barrado: ['Avaliação: uma estrela!', 'Sem tempo, sem tempo. Fui!'],
  aToa: ['Tá certo! Tá certo! Rápido!'],
  irritado: ['Já respondi! Tá no app!'],
  motivo: ['Entrega! Papita!'],
  desfecho: 'confessa',
  pego: ['Ih. Clube errado.', 'Ops. Pedido de outro. Fui!'],
  animacoes: {
    chegada: 'tata:patineteDerrapando',
    tique: 'tata:mochilaApitando',
    entra: 'tata:curvaFechada',
    barrado: 'tata:digitandoUmaEstrela',
    apontado: 'tata:rolandoATela',
  },
};

/**
 * DONA PREGUIÇA — a vovó mais doce do clube, a mais lenta do mundo; responde
 * em duas partes: começa, COCHILA (o relógio corre) e termina. Nunca mente.
 * Chega de bengala, devagar (a fila inteira suspira); boceja longuíssimo;
 * apontada, põe os óculos em três tempos; entra acenando até sumir; barrada,
 * os olhos marejam devagarinho — ninguém aguenta.
 */
const PREGUICA: FichaDaPortaria = {
  id: 'preguica', nome: 'Dona Preguiça', icone: '🦥',
  retrato: R('preguica', 'bege', 'mascaraDosOlhos', { enfeite: 'oculosDeLeitura' }),
  personalidade: 'a vovó mais doce do clube e a mais lenta do mundo, sempre com uma história de "no meu tempo"',
  jeito: 'dorminhoco',
  bordao: 'Ah, meu bem… no meu tempo…',
  chegada: ['Bom diiiia, meus bens… que guarita bonita…', 'Calma… que eu já… chego…'],
  entra: ['Obrigada, meu bem… vocês são uns amores…'],
  barrado: ['Ah… tudo bem, meu bem… eu volto… outro dia… devagarinho…'],
  aToa: ['Hmm? …Ah, sou eu sim, meu bem… sempre fui…'],
  irritado: ['Meu bem… eu já disse… mas digo de novo… com calma…'],
  motivo: ['Hidroginástica… às dez… ou às onze… depende de quando eu chegar…'],
  desfecho: 'confessa',
  pego: ['Ah, meu bem… a vovó se enganou…'],
  animacoes: {
    chegada: 'preguica:bengalaDevagar',
    tique: 'preguica:bocejoLongo',
    entra: 'preguica:acenandoAteSumir',
    barrado: 'preguica:olhosMarejando',
    apontado: 'preguica:oculosEmTresTempos',
  },
};

/** o NETINHO da Dona Preguiça (dia 3, convidado da avó): pendurado no pescoço dela, quieto e curioso */
const NETINHO: FichaDaPortaria = {
  id: 'netinho', nome: 'Tiquinho', icone: '🦥',
  retrato: R('preguica', 'bege', 'mascaraDosOlhos'),
  personalidade: 'o neto da Dona Preguiça: pendurado no pescoço da avó, curioso e mudo',
  jeito: 'timido',
  bordao: '…',
  chegada: ['(ele acena com uma garrinha)'],
  entra: ['(ele sorri pendurado)'],
  barrado: ['(ele esconde a cara no pescoço da avó)'],
  aToa: ['(ele pisca devagar)'],
  irritado: ['(ele pisca, mais devagar ainda)'],
  motivo: ['(ele aponta para a piscina)'],
  desfecho: 'confessa',
  pego: ['(ele esconde a cara)'],
  animacoes: {
    chegada: 'netinho:penduradoNaAvo', tique: 'netinho:balancando', entra: 'netinho:acenando',
    barrado: 'netinho:escondendoACara', apontado: 'netinho:piscando',
  },
};

// ============================================= OS FIGURANTES, UM TIPO POR ESPÉCIE

/**
 * Os figurantes não têm nome fixo (sorteiam do `NOMES_DOS_FIGURANTES`), mas
 * cada ESPÉCIE é um TIPO, com um jeito que se reconhece na fila.
 */

/** a LONTRA brincalhona: chega boiando de costas numa boia, equilibra uma pedrinha no nariz e confessa rindo */
const LONTRA: FichaDaPortaria = {
  id: 'lontra', nome: 'lontra', icone: '🦦',
  retrato: R('lontra', 'marrom', null),
  personalidade: 'a lontra brincalhona: faz piada de tudo, até de ser pega',
  jeito: 'brincalhao',
  bordao: 'Opa! Chegou a alegria da piscina!',
  chegada: ['Toc toc! Quem é? A lontra mais feliz do clube!', 'Bora, bora, que a água tá me chamando!'],
  entra: ['Uhuuu! Tchibum garantido!', 'Valeu! Vou dar uma cambalhota em homenagem.'],
  barrado: ['Ah, poxa! Mas foi engraçado, vai.', 'Tá bom, eu boio no laguinho do parque.'],
  aToa: ['Hahaha, cócegas não! Sou eu mesma!'],
  irritado: ['De novo? Tá bom: é a mesma resposta, só que mais feliz!'],
  motivo: ['Nadar de costas! É a minha especialidade.', 'Mergulhar atrás de pedrinha bonita.'],
  desfecho: 'confessa',
  pego: ['Hahaha, me pegaram! Valeu a tentativa, né?'],
  animacoes: {
    chegada: 'lontra:boiandoDeCostas', tique: 'lontra:pedrinhaNoNariz', entra: 'lontra:cambalhota',
    barrado: 'lontra:deslizandoTriste', apontado: 'lontra:rindoDeBarriga',
  },
};

/** o BODE teimoso: discute tudo, responde pergunta com pergunta; barrado, dá uma cabeçada (leve) no balcão */
const BODE: FichaDaPortaria = {
  id: 'bode', nome: 'bode', icone: '🐐',
  retrato: R('bode', 'cinza', null, { enfeite: 'barbicha' }),
  personalidade: 'o bode teimoso: discute tudo, e responde pergunta com outra pergunta',
  jeito: 'teimoso',
  bordao: 'E por que eu teria que mostrar alguma coisa?',
  chegada: ['Quem foi que inventou essa fila, hein?', 'Bom dia. Ou não. Depende de vocês.'],
  entra: ['Hunf. Já não era sem tempo.', 'Viu? Era só deixar.'],
  barrado: ['Isso é um absurdo! E eu vou ficar aqui reclamando.', 'Hunf! (cabeçada no balcão)'],
  aToa: ['E daí? Não tem nada errado aí, tem? TEM?'],
  irritado: ['Vai perguntar de novo? Por quê? Por QUÊ?'],
  motivo: ['Nadar. Algum problema nisso?'],
  desfecho: 'seEnrola',
  pego: ['E quem disse que isso importa?', 'Isso aí é detalhe de quem não tem o que fazer.'],
  animacoes: {
    chegada: 'bode:pisandoDuro', tique: 'bode:mascandoCapim', entra: 'bode:empinandoOQueixo',
    barrado: 'bode:cabecadaNoBalcao', apontado: 'bode:batendoOCasco',
  },
};

/** o COALA sonolento: abraça o próprio documento e cochila em pé, CALADO, acordando assustado */
const COALA: FichaDaPortaria = {
  id: 'coala', nome: 'coala', icone: '🐨',
  retrato: R('coala', 'cinzaClaro', null),
  personalidade: 'o coala sonolento: abraça o documento e cochila em pé, calado, até acordar assustado',
  jeito: 'sonolento',
  bordao: '…hã? Ah. Oi. Já é a minha vez?',
  chegada: ['(boceja) Bom… dia…', 'Tô acordado. Tô. Juro.'],
  entra: ['Ah… obrigado… vou tirar um cochilo na espreguiçadeira.'],
  barrado: ['Hm… tá… vou cochilar em casa então.'],
  aToa: ['Hã? Quê? Ah… sou eu, sou eu.'],
  irritado: ['Hã? …Ah, eu já respondi? Acho que respondi dormindo.'],
  motivo: ['Cochilar na sombra. Profissionalmente.'],
  desfecho: 'confessa',
  pego: ['(acorda assustado) Hã?! Não fui eu! …Fui eu. Desculpa.'],
  animacoes: {
    chegada: 'coala:abracandoODocumento', tique: 'coala:cochilandoEmPe', entra: 'coala:arrastandoOsPes',
    barrado: 'coala:bocejandoTriste', apontado: 'coala:acordandoAssustado',
  },
};

/** o PANDA-VERMELHO tímido: fala baixinho, some atrás do balcão quando apontado e entra dando um pulinho */
const PANDA: FichaDaPortaria = {
  id: 'pandaVermelho', nome: 'panda-vermelho', icone: '🐼',
  retrato: R('pandaVermelho', 'ferrugem', null),
  personalidade: 'o panda-vermelho tímido: fala baixinho e some atrás do balcão quando olham demais',
  jeito: 'timido',
  bordao: '(baixinho) …oi.',
  chegada: ['(baixinho) …com licença…', '(baixinho) …desculpa incomodar…'],
  entra: ['(dá um pulinho) …obrigado!'],
  barrado: ['(baixinho) …tá bom… desculpa…'],
  aToa: ['(some atrás do balcão) …sou eu…'],
  irritado: ['(mais baixinho ainda) …eu falei…'],
  motivo: ['Ler na sombra.'],
  desfecho: 'confessa',
  pego: ['(some atrás do balcão) …desculpa… não era meu…'],
  animacoes: {
    chegada: 'panda:espiandoPelaQuina', tique: 'panda:mexendoNoRabo', entra: 'panda:pulinho',
    barrado: 'panda:orelhasBaixas', apontado: 'panda:sumindoAtrasDoBalcao',
  },
};

/** o TEXUGO resmungão: reclama do calor, da fila e do clube; bufa e cruza os braços; barrado, "eu sabia" */
const TEXUGO: FichaDaPortaria = {
  id: 'texugo', nome: 'texugo', icone: '🦡',
  retrato: R('texugo', 'cinzaEscuro', 'listraBranca'),
  personalidade: 'o texugo resmungão: reclama do calor, da fila, do clube e de quem reclama',
  jeito: 'resmungao',
  bordao: 'Que calor. Que fila. Que clube.',
  chegada: ['Vinte minutos nessa fila. VINTE.', 'Hunf. Guarita nova e a mesma demora.'],
  entra: ['Finalmente. Agora vou reclamar da piscina.', 'Hunf. Obrigado, eu acho.'],
  barrado: ['Eu sabia. Eu SABIA.', 'Típico.'],
  aToa: ['Tá olhando o quê? É a minha cara. Sempre foi essa.'],
  irritado: ['Pergunta de novo. Vai. Eu tenho o dia inteiro. (não tenho)'],
  motivo: ['Reclamar da temperatura da água. Pessoalmente.'],
  desfecho: 'confessa',
  pego: ['Tá. Tá bom. Pegaram. Que dia.'],
  animacoes: {
    chegada: 'texugo:bufando', tique: 'texugo:bracosCruzados', entra: 'texugo:resmungandoAndando',
    barrado: 'texugo:euSabia', apontado: 'texugo:revirandoOsOlhos',
  },
};

// ================================================= OS BICHOS DO JOGO, NA PORTARIA

const NOEL: FichaDaPortaria = {
  id: 'noel', nome: 'Noel', icone: '🦃',
  retrato: R('peru', 'marrom', 'barbelaVermelha'),
  personalidade: 'o dono do bar de sucos: sempre atrasado, sempre com caixas, sempre em MAIÚSCULAS',
  jeito: 'afobado',
  bordao: 'BEBITOS! ESQUECI O GELO!',
  chegada: ['Três caixas de laranja e nenhuma de paciência!', 'O SUCO NÃO SE ESPREME SOZINHO!'],
  entra: ['OBRIGADO! Passa lá depois que tem suco!', 'Gluglu! Vocês são os melhores!'],
  barrado: ['MAS EU SOU O NOEL!', 'E as LARANJAS? Quem vai explicar pras laranjas?'],
  aToa: ['Sou eu! Olha o leque! (abre o leque)'],
  irritado: ['NOEL! N-O-E-L! Gluglu!'],
  motivo: ['ABRIR O BAR! Tô ATRASADO!'],
  desfecho: 'confessa',
  pego: ['Gluglu… tá bom.'],
  animacoes: {
    chegada: 'noel:caixasNaCara', tique: 'noel:gluguNervoso', entra: 'noel:abrindoOLeque',
    barrado: 'noel:lequeMurcho', apontado: 'noel:abrindoOLeque',
  },
};

const JOSEFINA: FichaDaPortaria = {
  id: 'josefina', nome: 'Josefina', icone: '🐢',
  retrato: R('tartaruga', 'verde', 'cascoDeFlor'),
  personalidade: 'a jardineira: doce, devagar, e sempre com uma mudinha para alguém',
  jeito: 'doce',
  bordao: 'Bom dia, meus amores!',
  chegada: ['Trouxe uma mudinha pra guarita ficar mais alegre.', 'Cada planta merece um cantinho com sol.'],
  entra: ['Obrigada, meus queridos. Até já!'],
  barrado: ['Ah… tudo bem, meus amores. (entra no casco por um tempinho)'],
  aToa: ['Sou eu sim, meu amor. Mais velha que a estufa.'],
  irritado: ['Calma, meu amor. Eu respondo quantas vezes precisar.'],
  motivo: ['Cuidar do jardim, meu amor. Ele não espera.'],
  desfecho: 'confessa',
  pego: ['Ai, que distraída eu sou.'],
  animacoes: {
    chegada: 'josefina:tirandoACarteirinhaDoCasco', tique: 'josefina:cabecaPraFora', entra: 'josefina:passoDevagar',
    barrado: 'josefina:entrandoNoCasco', apontado: 'josefina:cabecaPraFora',
  },
};

const CAPY: FichaDaPortaria = {
  id: 'capy', nome: 'Capy', icone: '🦫',
  retrato: R('capivara', 'caramelo', 'apitoNoPeito'),
  personalidade: 'o salva-vidas: segurança acima de tudo, até na portaria',
  jeito: 'seguranca',
  bordao: 'Segurança não tira folga!',
  chegada: ['Capacete afivelado, distância segura!', 'Portaria é a primeira linha de segurança!'],
  entra: ['Valeu! Olho vivo, hein!', 'Bom trabalho. Salva-vidas aprova.'],
  barrado: ['Justo. Regra é regra. Eu volto com tudo certo.'],
  aToa: ['Sou eu, o Capy. Pode conferir. Conferir é segurança.'],
  irritado: ['Pode perguntar de novo. Perguntar duas vezes é segurança.'],
  motivo: ['Assumir o posto na piscina!'],
  desfecho: 'seCorrige',
  pego: ['Opa! O capacete! (tira o capacete) Agora sim.'],
  animacoes: {
    chegada: 'capy:chegandoDeMoto', tique: 'capy:alongandoOPescoco', entra: 'capy:apitandoAoPassar',
    barrado: 'capy:batendoContinencia', apontado: 'capy:tirandoOCapacete',
  },
};

const JEANLUC: FichaDaPortaria = {
  id: 'jeanluc', nome: 'Jean-Luc', icone: '🦆',
  retrato: R('pato', 'branco', 'bicoLaranja', { enfeite: 'boinaEOculosEscuros' }),
  personalidade: 'o pato francês: dramático, competitivo e convencido de que charme é documento',
  jeito: 'dramatico',
  bordao: 'Bonjour, mes amis!',
  chegada: ['Um pato tem que ter estilo. E carteirinha. Eu tenho os dois. Mais ou menos.'],
  entra: ['Magnifique! Vocês têm gosto!', 'Merci! Vou treinar um saque em homenagem.'],
  barrado: ['C\'est une catastrophe!', 'Isso não vai ficar assim, mes amis!'],
  aToa: ['Voilà! O rosto mais elegante do clube.'],
  irritado: ['Mon Dieu, de novo? Tá bom: com sotaque, então.'],
  motivo: ['Treinar o meu saque. E ser admirado.'],
  desfecho: 'seEnrola',
  pego: ['C\'est la même chose!', 'Detalhes, mes amis, detalhes!'],
  animacoes: {
    chegada: 'jeanluc:subindoNoCaixote', tique: 'jeanluc:ajeitandoOsOculos', entra: 'jeanluc:reverencia',
    barrado: 'jeanluc:desmaioDeMentira', apontado: 'jeanluc:desmaioDeMentira',
  },
};

const ESTELLA: FichaDaPortaria = {
  id: 'estella', nome: 'Estella', icone: '🐑',
  retrato: R('ovelha', 'branca', 'oculosDeCostura'),
  personalidade: 'a costureira: elegante, "querida" para todo mundo, e mede tudo o que vê',
  jeito: 'elegante',
  bordao: 'Bom dia, queridos!',
  chegada: ['Bonita a guarita, querida… mas a cortina está curta.'],
  entra: ['Obrigada, queridos. E que uniforme bem alinhado!'],
  barrado: ['Tudo bem, querida. Mas a bainha dessa decisão está torta.'],
  aToa: ['Sou eu, querida. Pode medir.'],
  irritado: ['Já disse, querida. Com todos os pontos.'],
  motivo: ['O Noel me convidou para provar o suco novo.'],
  desfecho: 'confessa',
  pego: ['Ai, querida, que deselegante da minha parte.'],
  animacoes: {
    chegada: 'estella:medindoAJanela', tique: 'estella:fitaMetricaNoPescoco', entra: 'estella:passoDeDesfile',
    barrado: 'estella:suspiroElegante', apontado: 'estella:ajeitandoOsOculos',
  },
};

const MANO: FichaDaPortaria = {
  id: 'mano', nome: 'Mano', icone: '🐧',
  retrato: R('pinguim', 'azulMarinho', 'peitoBranco'),
  personalidade: 'o sorveteiro: curto, animado, e resolve tudo com uma casquinha e uma dancinha',
  jeito: 'animado',
  bordao: 'EU VOU QUERER.',
  chegada: ['OPA! GUARITA NOVA!', 'Calor, né? Eu tenho a solução.'],
  entra: ['VALEU! (dancinha)', 'Boa escolha, boa escolha.'],
  barrado: ['EU RESPEITO. (sai dançando assim mesmo)'],
  aToa: ['Sou eu! O Mano! (dancinha)'],
  irritado: ['Já falei! Mas falo dançando.'],
  motivo: ['Tomar um sol. Pinguim também toma sol.'],
  desfecho: 'confessa',
  pego: ['Tá bom, tá bom. Sem convite. Mas COM casquinha.'],
  animacoes: {
    chegada: 'mano:dancinha', tique: 'mano:balancandoACasquinha', entra: 'mano:dancinha',
    barrado: 'mano:saindoDancando', apontado: 'mano:congelando',
  },
};

const COOKIE: FichaDaPortaria = {
  id: 'cookie', nome: 'Cookie', icone: '🐘',
  retrato: R('elefante', 'cinzaRosado', 'quepeDaBilheteria'),
  personalidade: 'o da bilheteria da roda: enorme, delicado, fala baixinho e ama coisa pequenininha',
  jeito: 'fofo',
  bordao: 'Oi, bebitos… não se assustem, sou só eu.',
  chegada: ['Eu vim de folga. Folga pequenininha.'],
  entra: ['Obrigado… vou devagarinho, pra não fazer onda.'],
  barrado: ['Tudo bem… (as orelhas murcham)'],
  aToa: ['Sou eu… pode olhar a tromba.'],
  irritado: ['Eu repito… baixinho…'],
  motivo: ['Molhar a tromba. E soprar bolhinha.'],
  desfecho: 'confessa',
  pego: ['Ah… é proibido? Eu não sabia… desculpa.'],
  animacoes: {
    chegada: 'cookie:trombaPelaFresta', tique: 'cookie:soprandoBolhinha', entra: 'cookie:passoNaPontaDasPatas',
    barrado: 'cookie:orelhasMurchas', apontado: 'cookie:trombaEnrolada',
  },
};

const GATITO: FichaDaPortaria = {
  id: 'gatito', nome: 'Gatito', icone: '🐱',
  retrato: R('gato', 'creme', 'manchaCaramelo'),
  personalidade: 'o professor de pelúcia: organizado, orgulhoso da turma, e com o "six seven" na ponta da língua',
  jeito: 'professor',
  bordao: 'Six seven!',
  chegada: ['Bom dia, bebitos! Hoje é o Dia da Escola no Clube!'],
  entra: ['Ótimo! Nota dez para a portaria!'],
  barrado: ['Hmm… vou rever a matéria e volto.'],
  aToa: ['Sou eu, o professor. Pode conferir, é bom exercício.'],
  irritado: ['Pergunta repetida é ótimo para fixar. Mas eu já respondi.'],
  motivo: ['Receber a turma! Os Gatitos vêm aí.'],
  desfecho: 'confessa',
  pego: ['Errei. Professor também erra. Vou anotar.'],
  animacoes: {
    chegada: 'gatito:acenandoComAApostila', tique: 'gatito:sixSeven', entra: 'gatito:pulinhoDePelucia',
    barrado: 'gatito:orelhasBaixas', apontado: 'gatito:ajeitandoOsOculos',
  },
};

const TIALIZ: FichaDaPortaria = {
  id: 'tializ', nome: 'Tia Liz', icone: '🐻',
  retrato: R('ursa', 'caramelo', 'trancaComMolinhas'),
  personalidade: 'a tia da cantina: carinhosa, mãezona das três irmãs, e sempre com merenda',
  jeito: 'carinhosa',
  bordao: '¡Mis niños!',
  chegada: ['Trouxe arepita pra portaria. Uma pra cada.'],
  entra: ['¡Gracias, mis amores! Meninas, de mãos dadas!'],
  barrado: ['Ay… tudo bem. A gente volta.'],
  aToa: ['Sou eu, mi niño. A Tia Liz de sempre.'],
  irritado: ['Já disse, mi amor. Mas digo com carinho.'],
  motivo: ['O Dia da Escola! As meninas não dormiram de tanta ansiedade.'],
  desfecho: 'seCorrige',
  pego: ['¡Luna! Sai daí de trás, mi amor. (a Luna aparece)'],
  animacoes: {
    chegada: 'tializ:arepitaPelaFresta', tique: 'tializ:conferindoAsMeninas', entra: 'tializ:levandoAsMeninas',
    barrado: 'tializ:abracandoAsMeninas', apontado: 'tializ:chamandoALuna',
  },
};

const LUNA: FichaDaPortaria = {
  id: 'luna', nome: 'Luna', icone: '🐰',
  retrato: R('coelha', 'branca', 'lacoAzul'),
  personalidade: 'a irmã tímida: se esconde atrás da Tia Liz e só aparece quando chamam',
  jeito: 'timido',
  bordao: '…',
  chegada: ['(escondida atrás da Tia Liz)'],
  entra: ['(sai de mãos dadas com a Tia Liz)'],
  barrado: ['(some de novo)'],
  aToa: ['(espia)'],
  irritado: ['(…)'],
  motivo: ['(…)'],
  desfecho: 'seCorrige',
  pego: ['…oi. (a Luna aparece)'],
  animacoes: {
    chegada: 'luna:escondida', tique: 'luna:espiando', entra: 'luna:deMaosDadas',
    barrado: 'luna:sumindo', apontado: 'luna:aparecendo',
  },
};

const SOL: FichaDaPortaria = {
  id: 'sol', nome: 'Sol', icone: '🐰',
  retrato: R('coelha', 'caramelo', 'lacoAmarelo'),
  personalidade: 'a irmã que pula: só as orelhas aparecem na janela, de pulo em pulo',
  jeito: 'animado',
  bordao: 'OI! OI! OI!',
  chegada: ['(pula para aparecer na janela)'],
  entra: ['UHUL!'],
  barrado: ['Aaah…'],
  aToa: ['Sou eu! (pula)'],
  irritado: ['JÁ FALEI! (pula)'],
  motivo: ['PULAR NA PISCINA!'],
  desfecho: 'confessa',
  pego: ['Ops!'],
  animacoes: {
    chegada: 'sol:pulandoNaJanela', tique: 'sol:pulandoNaJanela', entra: 'sol:salto',
    barrado: 'sol:orelhasBaixas', apontado: 'sol:pulandoNaJanela',
  },
};

const ESTRELLA: FichaDaPortaria = {
  id: 'estrella', nome: 'Estrella', icone: '🐰',
  retrato: R('coelha', 'marrom', 'lacoRosa'),
  personalidade: 'a irmã das estrelinhas: não para quieta, gira atrás da fila',
  jeito: 'animado',
  bordao: 'Olha a minha estrelinha!',
  chegada: ['(faz uma estrelinha atrás da Tia Liz)'],
  entra: ['(estrelinha pela cancela)'],
  barrado: ['Ah, poxa…'],
  aToa: ['Sou eu! (estrelinha)'],
  irritado: ['(estrelinha impaciente)'],
  motivo: ['Fazer estrelinha na grama!'],
  desfecho: 'confessa',
  pego: ['Hihi.'],
  animacoes: {
    chegada: 'estrella:estrelinha', tique: 'estrella:estrelinha', entra: 'estrella:estrelinha',
    barrado: 'estrella:sentadinha', apontado: 'estrella:estrelinha',
  },
};

const FLYNN: FichaDaPortaria = {
  id: 'flynn', nome: 'Flynn', icone: '🦊',
  retrato: R('raposa', 'laranja', 'bandanaAzul'),
  personalidade: 'o presidente da atlética: não para de trotar e não fica atrás de rival nenhum',
  jeito: 'atleta',
  bordao: 'E aí, bebitos! Sem pressão nenhuma!',
  chegada: ['Vim correndo da escola. Literalmente.'],
  entra: ['Valeu! Toca aqui! (pela fresta)'],
  barrado: ['Tranquilo! Eu dou mais uma volta no quarteirão.'],
  aToa: ['Sou eu! Mais rápido que a foto, mas sou eu.'],
  irritado: ['Já respondi! Mas respondo correndo no lugar.'],
  motivo: ['O Dia da Escola! E um treininho na piscina.'],
  desfecho: 'confessa',
  pego: ['Opa. Falta minha. Tô treinando isso.'],
  animacoes: {
    chegada: 'flynn:trotandoAteAJanela', tique: 'flynn:trotandoNoLugar', entra: 'flynn:arrancada',
    barrado: 'flynn:voltaNoQuarteirao', apontado: 'flynn:parandoDeTrotar',
  },
};

const ROCCO: FichaDaPortaria = {
  id: 'rocco', nome: 'Rocco', icone: '🐺',
  retrato: R('lobo', 'cinza', 'cicatrizNaSobrancelha'),
  personalidade: 'o capitão dos Dogões: marrento, mas gente boa — e sempre tentando um jeitinho',
  jeito: 'marrento',
  bordao: 'Rocco. Capitão dos Dogões.',
  chegada: ['A gente veio pro Dia da Escola. De uma escola. Qualquer.'],
  entra: ['Valeu. Fala pro Flynn que eu tô aqui.'],
  barrado: ['AUUUUU! (uivo de protesto) Tá bom. Ano que vem.', 'Fala pro Flynn que eu passei. E que ele teve sorte.'],
  aToa: ['Tá encarando? Eu encaro de volta.'],
  irritado: ['Já falei. Capitão não repete.'],
  motivo: ['Ver o treino da raposinha. De perto.'],
  desfecho: 'seEnrola',
  pego: ['A gente é da escola. Outra escola, mas escola.'],
  animacoes: {
    chegada: 'rocco:chegandoComOsDogoes', tique: 'rocco:estalandoOPescoco', entra: 'rocco:passandoDeOmbro',
    barrado: 'rocco:uivo', apontado: 'rocco:encarando',
  },
};

/** os DOGÕES, o time do Rocco (cachorros de uniforme vermelho e cinza): uma turma só na janela, em coro */
const DOGOES: FichaDaPortaria = {
  id: 'dogoes', nome: 'os Dogões', icone: '🐶',
  retrato: R('cachorro', 'variado', 'uniformeVermelho'),
  personalidade: 'o time do Rocco: falam em coro e latem o grito de guerra',
  jeito: 'marrento',
  bordao: 'DO-GÕES! DO-GÕES!',
  chegada: ['(latem o grito de guerra)'],
  entra: ['AU AU AU!'],
  barrado: ['Auuuu…'],
  aToa: ['(rosnado fofo)'],
  irritado: ['(latido em coro)'],
  motivo: ['VER O JOGO!'],
  desfecho: 'seEnrola',
  pego: ['(olham para o Rocco)'],
  animacoes: {
    chegada: 'dogoes:gritoDeGuerra', tique: 'dogoes:empurraEmpurra', entra: 'dogoes:correria',
    barrado: 'dogoes:rabosBaixos', apontado: 'dogoes:olhandoProRocco',
  },
};

const VALENTINA: FichaDaPortaria = {
  id: 'valentina', nome: 'Valentina', icone: '🦩',
  retrato: R('flamingo', 'rosa', 'oculosGatinho'),
  personalidade: 'a do marketing: diva italiana que transforma qualquer janela num ensaio de fotos',
  jeito: 'diva',
  bordao: 'Ciao, bebitos!',
  chegada: ['A luz desse guichê está perfetta. Uma foto, rápido!'],
  entra: ['Grazie! Pietro, andiamo!'],
  barrado: ['Che peccato… mas a pose valeu.'],
  aToa: ['Sou eu, amori. De perfil fico ainda melhor.'],
  irritado: ['Já disse, amore. Com a pose e tudo.'],
  motivo: ['Fotografar o Dia da Escola. E ser fotografada.'],
  desfecho: 'confessa',
  pego: ['Mamma mia. Que vergonha elegante.'],
  animacoes: {
    chegada: 'valentina:posandoNaJanela', tique: 'valentina:numPeSo', entra: 'valentina:desfile',
    barrado: 'valentina:oculosNaTesta', apontado: 'valentina:poseDePerfil',
  },
};

const PIETRO: FichaDaPortaria = {
  id: 'pietro', nome: 'Pietro', icone: '🦚',
  retrato: R('pavao', 'azulPavao', 'quepeDeMotorista'),
  personalidade: 'o motorista: formal, de luvas brancas, e abre o leque quando fica contente',
  jeito: 'formal',
  bordao: 'Buongiorno. Pietro, motorista da signorina Valentina.',
  chegada: ['Com licença. O crachá, por gentileza.'],
  entra: ['Grazie mille. (abre o leque)'],
  barrado: ['Compreendo perfeitamente. Aguardo no carro.'],
  aToa: ['Sou eu, sim. Pietro. Às ordens.'],
  irritado: ['Pietro. Às ordens. Pela segunda vez.'],
  motivo: ['Acompanhar a signorina.'],
  desfecho: 'confessa',
  pego: ['Perdão. Um engano imperdoável.'],
  animacoes: {
    chegada: 'pietro:tirandoOQuepe', tique: 'pietro:luvasCruzadas', entra: 'pietro:abrindoOLeque',
    barrado: 'pietro:reverencia', apontado: 'pietro:endireitando',
  },
};

/** todas as fichas, pelo `id` */
export const FICHAS: Readonly<Record<string, FichaDaPortaria>> = Object.fromEntries([
  HIPOLITO, ALPACINA, ALPACONA, BENTO, BETO, TATA, PREGUICA, NETINHO,
  LONTRA, BODE, COALA, PANDA, TEXUGO,
  NOEL, JOSEFINA, CAPY, JEANLUC, ESTELLA, MANO, COOKIE,
  GATITO, TIALIZ, LUNA, SOL, ESTRELLA, FLYNN, ROCCO, DOGOES, VALENTINA, PIETRO,
].map((f) => [f.id, f]));

/** as espécies dos figurantes (cada uma é um TIPO) */
export const ESPECIES_FIGURANTES = ['lontra', 'bode', 'coala', 'pandaVermelho', 'texugo'] as const;
export type EspecieFigurante = typeof ESPECIES_FIGURANTES[number];

/** os nomes que os figurantes sorteiam, por espécie (sem repetir no mesmo dia) */
export const NOMES_DOS_FIGURANTES: Readonly<Record<EspecieFigurante, readonly string[]>> = {
  lontra: ['Lola', 'Olavo', 'Nanda', 'Teco', 'Marina', 'Dudu', 'Iara'],
  bode: ['Seu Bartolomeu', 'Bóris', 'Seu Tonico', 'Barbosa', 'Dona Cabrita', 'Seu Bené'],
  coala: ['Kiko', 'Dona Kátia', 'Cacá', 'Bebel', 'Tutu', 'Seu Nino'],
  pandaVermelho: ['Pipo', 'Mei', 'Lino', 'Ruivinha', 'Fifi', 'Dodô'],
  texugo: ['Seu Teodoro', 'Tobias', 'Dona Tereza', 'Seu Juca', 'Dona Cida', 'Zeca'],
};

/** as cores e as marcas que os figurantes sorteiam (a foto "de outro" troca uma delas) */
export const VARIACOES_DOS_FIGURANTES: Readonly<Record<EspecieFigurante, { cores: readonly string[]; marcas: readonly (string | null)[] }>> = {
  lontra: { cores: ['marrom', 'chocolate', 'mel'], marcas: [null, 'manchaNoPeito', 'bigodeBranco'] },
  bode: { cores: ['cinza', 'branco', 'malhado'], marcas: [null, 'chifreTorto', 'brincoNaOrelha'] },
  coala: { cores: ['cinzaClaro', 'cinzaAzulado', 'grafite'], marcas: [null, 'narizGrande', 'orelhaRasgadinha'] },
  pandaVermelho: { cores: ['ferrugem', 'laranja', 'vermelhoEscuro'], marcas: [null, 'caudaListrada', 'manchaNaTesta'] },
  texugo: { cores: ['cinzaEscuro', 'cinza', 'pretoEBranco'], marcas: [null, 'listraBranca', 'cicatrizNoNariz'] },
};

// ================================================================ as respostas

const POR_EXTENSO = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];

/** a resposta "crua" de um assunto, antes do jeito de cada um (o valor continua o do papel: só a FALA muda) */
function base(assunto: Assunto, valor: string): string {
  switch (assunto) {
    case 'nome': return `Meu nome é ${valor}.`;
    case 'numero': return `O meu número é ${valor}.`;
    case 'motivo': return valor;
    case 'convidou': return `Quem me convidou foi ${valor}.`;
    case 'destino': return `Entrega em: ${valor}.`;
    case 'exame': return `O exame vale até ${valor}.`;
    case 'sacola': return `Na sacola tem ${valor}.`;
    case 'quantos': return `Somos ${POR_EXTENSO[Number(valor)] ?? valor}.`;
  }
}

/**
 * o que cada jeito põe antes e depois da resposta (escolhido pelo assunto: a
 * mesma pergunta dá sempre a mesma frase). O que vem DEPOIS começando por
 * vírgula é vocativo ("…, mi amor."): a resposta perde o ponto final e emenda.
 */
const MOLDE: Readonly<Record<Jeito, { antes?: readonly string[]; depois?: readonly string[] }>> = {
  sincero: {},
  enrolado: { antes: ['Ah, meu filho… '], depois: [' Mas isso é detalhe.', ' Desde o tempo do brejo.', ' Pode confiar.'] },
  vaidoso: { antes: ['Amor, '], depois: [' Reparou no cabelo?', ' Anota aí, com a letra bonita.'] },
  certinho: { antes: ['Prontamente: '], depois: [' Nos conformes.'] },
  desencanado: { antes: ['Ah… '], depois: [' Relaxa.', ' Acho.'] },
  apressado: { depois: [' Rápido!', ' Assina!'] },
  dorminhoco: { antes: ['Ah, meu bem… '] },
  brincalhao: { depois: [' Hahaha!', ' Tchibum!'] },
  teimoso: { antes: ['E por que você quer saber? '], depois: [' Satisfeito?'] },
  sonolento: { antes: ['(boceja) '], depois: [' …zz.'] },
  timido: { antes: ['(baixinho) …'] },
  resmungao: { depois: [' Que pergunta.', ' Hunf.'] },
  afobado: { depois: [' TÔ ATRASADO!', ' GLUGLU!'] },
  doce: { depois: [', meu amor.'] },
  seguranca: { depois: [' Confere aí, conferir é segurança.'] },
  dramatico: { antes: ['Mon Dieu… '], depois: [' Voilà.'] },
  elegante: { depois: [', querida.'] },
  animado: { depois: [' (dancinha)'] },
  fofo: { antes: ['(baixinho) '], depois: [' …pequenininho.'] },
  professor: { depois: [' Anotem.'] },
  carinhosa: { depois: [', mi amor.'] },
  atleta: { depois: [' (trotando no lugar)'] },
  marrento: { depois: [' Algum problema?'] },
  diva: { antes: ['Amore, '], depois: [' Perfetto.'] },
  formal: { antes: ['Por gentileza: '] },
};

const pegar = <T>(lista: readonly T[] | undefined, i: number): T | undefined =>
  lista && lista.length ? lista[i % lista.length] : undefined;

const INDICE: Readonly<Record<Assunto, number>> = { nome: 0, numero: 1, motivo: 2, convidou: 3, destino: 4, exame: 5, sacola: 6, quantos: 7 };

/** emenda o que vem antes, a resposta e o que vem depois, com a pontuação certa */
function emendar(antes: string, meio: string, depois: string): string {
  let m = meio;
  // depois de "Amor, " ou "Prontamente: " a resposta continua a frase: minúscula
  if (/[,:]\s$/.test(antes) && !/^[A-ZÁÉÍÓÚÂÊÔ]{2}/.test(m)) m = m.charAt(0).toLowerCase() + m.slice(1);
  if (depois.startsWith(',')) m = m.replace(/[.!?]$/, '');
  return `${antes}${m}${depois}`;
}

/**
 * A FALA DE UMA RESPOSTA, no jeito da ficha. Devolve uma lista de balões: a
 * Dona Preguiça responde em DOIS (começa, cochila e termina — a cena põe o
 * "zZz" no meio e o relógio corre).
 */
export function responder(ficha: FichaDaPortaria, assunto: Assunto, valor: string): string[] {
  const i = INDICE[assunto];
  const molde = MOLDE[ficha.jeito];
  const antes = pegar(molde.antes, i) ?? '';
  const depois = pegar(molde.depois, i) ?? '';
  if (ficha.jeito === 'dorminhoco') {
    // ela começa a frase, cochila ANTES da última palavra, e termina com ela
    const frase = emendar(antes, base(assunto, valor), depois);
    const corte = frase.lastIndexOf(' ');
    return [`${frase.slice(0, corte)}…`, '(zZz…)', `…${frase.slice(corte + 1)}`];
  }
  return [emendar(antes, base(assunto, valor), depois)];
}
