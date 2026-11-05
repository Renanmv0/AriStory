import type { Licao } from '../tipos';

/**
 * LIÇÃO 17 — "Beleza? Valeu!": o grupo da turma no celular.
 *
 * O PORTUGUÊS FALADO E ESCRITO NA PRESSA — o que nenhum livro de gramática
 * ensina e todo brasileiro usa: tá, tô, pra, né, bora; as abreviações do
 * WhatsApp (vc, pq, tb, blz, vlw, hj); e a risada: kkkk (e rs), e nunca
 * "jajaja" — que, em português, lê-se "já já já". O contraste é sempre o
 * mesmo: pode no grupo, não vale na prova.
 *
 * A cena é um bate-papo do grupo "Turma do Gatito". É a lição para o
 * exercício `conversa`, que já é um celular: aqui ele ganha o seu tema de
 * verdade. Quem fala é a turma toda; o tom de cada uma continua (a Sol em
 * caixa alta, a Estrella baixinho).
 */
export const LICAO_17: Licao = {
  id: 'beleza-valeu',
  numero: 17,
  titulo: 'Beleza? Valeu!',
  subtitulo: 'O grupo da turma no celular',
  assunto: 'o português falado: tá, tô, pra, né, e o internetês',
  emoji: '💬',
  cor: 'rosa',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'entender o português falado: tá, tô, pra, né, bora;',
          'ler e escrever as abreviações do celular: vc, pq, tb, blz, vlw;',
          'rir em português: kkkk, e nunca jajaja;',
          'responder a um "valeu" e saber quando escrever por extenso.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Turma do Gatito',
        lugar: 'O grupo da turma no celular, numa sexta à noite',
        falas: [
          { quem: 'luna', texto: 'Gente, vcs vão pro ginásio amanhã? Tô levando o lanche kkk' },
          { quem: 'sol', texto: '¡VOU SIM! blz! TMJ!!!' },
          { quem: 'estrella', texto: 'Tá bom... mas sem correr, né? rs' },
          { quem: 'valentina', texto: 'amei o look de vcs hj 😍 mas da próxima vez me chamem pra escolher kkk' },
          { quem: 'ari', texto: 'O que quer dizer "tmj"?' },
          { quem: 'renan', texto: 'Tamo junto. É tipo "pode contar comigo".' },
          { quem: 'luna', texto: 'Falado, a gente come letra, pana: tamo, tá, tô, pra.' },
          { quem: 'sol', texto: 'kkkkkkkk o Ari mandou "jajaja"! ¡Aqui é kkkk!' },
          { quem: 'gatito', texto: 'Recado do dia: amanhã tem aula. Não esqueçam o caderno! 😺' },
          { quem: 'sol', texto: 'Valeu, profe!!!' },
          { quem: 'ari', texto: 'Valeu! Beleza!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do grupo',
        itens: [
          { emoji: '💬', pt: 'a mensagem', es: 'el mensaje' },
          { emoji: '👥', pt: 'o grupo', es: 'el grupo' },
          { emoji: '😂', pt: 'kkkk · rs', es: 'jajaja' },
          { emoji: '👍', pt: 'beleza · blz', es: 'vale · de acuerdo' },
          { emoji: '🙏', pt: 'valeu · vlw', es: 'gracias' },
          { emoji: '🤝', pt: 'tmj (tamo junto)', es: 'cuenta conmigo' },
          { emoji: '🎙️', pt: 'o áudio', es: 'el audio' },
          { emoji: '📲', pt: 'mandar uma mensagem', es: 'enviar un mensaje' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Como a gente fala de verdade',
        texto: 'Falando, o brasileiro **come letras**: "estou" vira **tô**, "está" vira **tá**, "para" vira **pra**. Isso não é erro nem preguiça: é o jeito normal de falar, em todo o país — só não vai para a redação.',
      },
      {
        tipo: 'tabela',
        colunas: ['Escrito', 'Falado', 'Em espanhol'],
        linhas: [
          ['estou', 'tô', 'estoy'],
          ['está', 'tá', 'está'],
          ['estava', 'tava', 'estaba'],
          ['para', 'pra', 'para'],
          ['não é?', 'né?', '¿no? ¿verdad?'],
          ['vamos embora', 'bora', 'vámonos'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Na **fala**, na **mensagem** e no **bilhete para um amigo**: tô, tá, pra, né. No **texto da escola**, na **carta**, no **e-mail para o chefe**: estou, está, para, não é. Quem conhece os dois nunca erra a hora.',
      },
      {
        tipo: 'dica',
        texto: 'O **né?** no fim da frase é o nosso "¿no?" do espanhol: "Hoje tem aula, **né**?". Serve para pedir que a pessoa concorde — e para encher a conversa de simpatia.',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'O internetês',
        colunas: ['Escreve-se', 'Quer dizer', 'Em espanhol'],
        linhas: [
          ['vc · vcs', 'você · vocês', 'tú · ustedes'],
          ['pq', 'por que · porque', 'por qué · porque'],
          ['tb · tbm', 'também', 'también'],
          ['blz', 'beleza', 'vale'],
          ['vlw', 'valeu', 'gracias'],
          ['hj', 'hoje', 'hoy'],
          ['sdds', 'saudades', 'te extraño'],
        ],
      },
      {
        tipo: 'contraste',
        titulo: 'A risada em cada língua',
        pares: [
          { es: 'jajaja', pt: 'kkkk' },
          { es: 'jejeje', pt: 'rsrs' },
          { es: 'ja, ja, ja', pt: 'haha' },
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Em português, **jajaja** se lê "**já já já**" — e "já já" quer dizer "agorinha, daqui a pouco". Ninguém entende que é uma risada. Para rir, escreva **kkkk** (o *k* imita o som do riso) ou **rs**.',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Respondendo (e puxando conversa)',
        colunas: ['Se diz', 'Quer dizer'],
        linhas: [
          ['Valeu! · Brigado!', 'Obrigado! (solto)'],
          ['De nada! · Imagina! · Tamo junto!', 'Não há de quê'],
          ['E aí? · Fala!', 'Oi! Tudo bem?'],
          ['Beleza? — Beleza!', 'Tudo bem? — Tudo bem!'],
          ['Bora!', 'Vamos!'],
          ['Show! · Legal! · Demais!', 'Ótimo!'],
          ['Tranquilo · De boa', 'Sem problema'],
          ['Demorou!', 'Combinado!'],
        ],
        nota: 'A gíria muda de região (no Nordeste se diz "massa", em Minas, "uai"). Estas funcionam quase em todo lugar.',
      },
      {
        tipo: 'brasil',
        titulo: 'Bom dia, grupo!',
        texto: 'Em grupo de família ou de trabalho, sempre tem alguém que manda **bom dia** com uma imagem de flores e uma xícara de café. A regra do grupo é responder com 👍. E muita gente manda **áudio de três minutos** em vez de escrever: aperte o 1,5x e aguente firme.',
      },
      {
        tipo: 'dica',
        texto: 'Gíria é tempero: um pouquinho dá gosto, demais estraga o prato. Com o chefe, com o professor e com a vovó, escreva por extenso.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'No grupo da turma. Escolha o que o Ari manda.',
      com: 'sol',
      turnos: [
        {
          fala: 'Ari!! Vc vai no ginásio amanhã? kkkk',
          opcoes: ['Vou sim! Tô animado.', 'Voy sim! Estoy animado.', 'Vou si! Tô animado.'],
          certa: 0,
          porque: 'Tô é o "estou" falado. E a confirmação é "vou sim".',
        },
        {
          fala: 'Boraaa! Vai levar o quê?',
          opcoes: ['Levo o caderno, né?', 'Llevo o caderno, né?', 'Levo o cuaderno, né?'],
          certa: 0,
          porque: 'Levar e caderno, em português. O "né?" pede a concordância.',
        },
        {
          fala: 'Você escreveu "jajaja"! Aqui a risada é kkkk!',
          opcoes: ['Jajaja! Valeu pela dica!', 'Kkkk! Valeu pela dica!', 'Haja! Valeu pela dica!'],
          certa: 1,
          porque: 'Em português se ri com kkkk (ou rs).',
        },
        {
          fala: 'Valeu, Ari! Amanhã a gente se vê!',
          opcoes: ['Imagino! Tamo junto!', 'Imagina! Tamo junto!', 'Imaginar! Tamo junto!'],
          certa: 1,
          porque: '"Imagina!" é um jeito simpático de dizer "de nada".',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue a abreviação ao que ela quer dizer.',
      pares: [
        ['vc', 'você'],
        ['pq', 'por que · porque'],
        ['tb', 'também'],
        ['blz', 'beleza'],
        ['vlw', 'valeu'],
        ['hj', 'hoje'],
      ],
      porque: 'O internetês economiza dedo: tira as vogais (vc, blz, vlw) e junta as palavras.',
    },
    {
      tipo: 'classificar',
      enunciado: 'Conversa de celular ou texto formal?',
      grupos: ['📱 conversa / mensagem', '📄 texto formal'],
      itens: [
        { texto: 'Tô chegando, tá?', grupo: 0, porque: 'Tô e tá: falado.' },
        { texto: 'Estou chegando, está bem?', grupo: 1, porque: 'Estou e está por extenso: mais formal.' },
        { texto: 'Bora pro ginásio, né?', grupo: 0, porque: 'Bora, pro e né: conversa entre amigos.' },
        { texto: 'Vamos ao ginásio, não é?', grupo: 1, porque: 'Vamos e não é: mais formal.' },
        { texto: 'Pra mim tá ótimo.', grupo: 0, porque: 'Pra e tá: falado.' },
        { texto: 'Para mim está ótimo.', grupo: 1, porque: 'Para e está: por extenso.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha a melhor opção.',
      itens: [
        {
          pergunta: 'O que quer dizer "tmj"?',
          opcoes: ['Tamo junto: pode contar comigo.', 'Tem mais jogo.', 'Tudo muito justo.'],
          certa: 0,
          porque: 'Tmj = tamo junto = estamos juntos.',
        },
        {
          pergunta: 'Como se escreve a risada em português, por mensagem?',
          opcoes: ['kkkk', 'jajaja', 'jijiji'],
          certa: 0,
          porque: 'O jajaja se lê "já já já" em português. A risada é kkkk ou rs.',
        },
        {
          pergunta: 'O Gatito manda: "Valeu!". O que ele quer dizer?',
          opcoes: ['Obrigado!', 'Tchau!', 'Desculpa!'],
          certa: 0,
          porque: 'Valeu é um "obrigado" solto.',
        },
        {
          pergunta: 'Um amigo escreve: "Bora?". O que ele propõe?',
          opcoes: ['Vamos?', 'Quer dormir?', 'Quer comer?'],
          certa: 0,
          porque: 'Bora vem de "vamos embora": é a chamada para ir.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Passe do falado para o escrito (e vice-versa).',
      novaPagina: true,
      itens: [
        { antes: 'estou, falado →', aceitas: ['tô', 'to'], porque: 'Estou → tô.' },
        { antes: 'para, falado →', aceitas: ['pra'], porque: 'Para → pra.' },
        { antes: 'não é?, falado →', aceitas: ['né', 'ne'], porque: 'Não é? → né?' },
        { antes: 'tá, por extenso →', aceitas: ['está', 'esta'], porque: 'Tá → está.' },
        { antes: 'vcs, por extenso →', aceitas: ['vocês', 'voces'], porque: 'Vcs → vocês.' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a mensagem do grupo.',
      titulo: '📱 Turma do Gatito',
      texto: 'Oi, gente! {0}? Amanhã tem ginásio, {1} comigo? Eu {2} levando o lanche. Quem não puder, avisa no grupo, {3}? E quem gostou: {4} pela dica, Ari!',
      respostas: ['Beleza', 'bora', 'tô', 'tá', 'valeu'],
      distratores: ['para', 'você', 'jajaja'],
      porque: [
        '"Beleza?" é o jeito solto de perguntar "tudo bem?".',
        '"Bora" vem de "vamos embora": é o convite.',
        'Tô é o "estou" falado.',
        '"Tá?" no fim da frase pede o "está bem?" do outro.',
        'Valeu é o obrigado falado.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Jajaja!', 'Que', 'engraçado!'],
          errada: 0,
          correcao: 'Kkkk!',
          porque: 'Em português se ri com kkkk (ou rs). O jajaja lê-se "já já já".',
        },
        {
          palavras: ['Eu', 'estoy', 'chegando', 'em', 'cinco', 'minutos.'],
          errada: 1,
          correcao: 'estou',
          porque: 'Estoy é espanhol. Em português: estou — e, falando, tô.',
        },
        {
          palavras: ['Tô', 'sem', 'sono', 'hoy.'],
          errada: 3,
          correcao: 'hoje.',
          porque: 'Hoy vira hoje (com j e e).',
        },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não combina?',
      itens: [
        {
          pergunta: 'Qual destas NÃO é uma forma falada?',
          opcoes: ['tá', 'tô', 'pra', 'está'],
          certa: 3,
          porque: 'Está é a forma por extenso; tá, tô e pra são as faladas.',
        },
        {
          pergunta: 'Qual destas NÃO é um jeito de rir por mensagem, no Brasil?',
          opcoes: ['kkkk', 'rs', 'haha', 'jajaja'],
          certa: 3,
          porque: 'Jajaja é a risada do espanhol; em português lê-se "já já já".',
        },
      ],
    },
  ],
  consigo: [
    'entender o português falado: tô, tá, pra, né, bora;',
    'ler as abreviações do celular: vc, pq, tb, blz, vlw;',
    'rir em português (kkkk) e responder a um "valeu";',
    'saber quando escrever por extenso.',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'luna', texto: '¡Épale, o sinal! Mandei no grupo, mas ninguém leu... kkk' },
      { quem: 'sol', texto: '¡EU LI! ...Agora.' },
      { quem: 'estrella', texto: 'Eu li faz tempo. Só não respondi. Desculpa, rs.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje é a aula mais conectada do curso.' },
      { quem: 'gatito', texto: 'Vocês falam de um jeito no grupo e escrevem de outro na prova. A lição é sobre os dois.' },
      { quem: 'ari', texto: 'Posso mandar áudio, profe?' },
      { quem: 'valentina', texto: 'Eu cuido do grupo da turma, profe. E do perfil da escola. E do meu, claro.' },
      { quem: 'gatito', texto: 'Só se for de dez segundos. Abram na lição 17: "Beleza? Valeu!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Parabéns, Ari! Agora você fala e escreve do jeito que cada hora pede.' },
      { quem: 'renan', texto: 'Valeu, profe!' },
      { quem: 'gatito', texto: 'Imagina! Tamo junto!' },
      { quem: 'valentina', texto: 'Valeu, profe! Bjs! ...Isso é internetês, né? Tô aprendendo rapidinho.' },
      { quem: 'sol', texto: '¡kkkkkkk! ...Escrevi certo?' },
    ],
  },
};
