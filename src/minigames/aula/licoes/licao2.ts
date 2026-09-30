import type { Licao } from '../tipos';

/**
 * LIÇÃO 2 — "O jantar das confusões": os FALSOS AMIGOS.
 *
 * A lição mais engraçada para quem fala espanhol, e a mais útil: as palavras
 * que parecem iguais e querem dizer outra coisa (os heterossemânticos). O
 * cenário é o Mania de Churrasco de verdade — com os pratos do cardápio do
 * jogo (a arepa, o perro caliente) e o Walter, que só late.
 *
 * O "esquisito" é da Luna: ela já contou no ginásio que passou um mês
 * elogiando a comida dos outros de esquisita (`escolaGinasio.ts`).
 */
export const LICAO_2: Licao = {
  id: 'jantar-das-confusoes',
  numero: 2,
  titulo: 'O jantar das confusões',
  subtitulo: 'Uma noite no Mania de Churrasco',
  assunto: 'falsos amigos',
  emoji: '🍽️',
  cor: 'mostarda',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'reconhecer os falsos amigos mais perigosos para quem fala espanhol;',
          'pedir comida e elogiar o prato sem assustar ninguém;',
          'deixar gorjeta (e não propina!) para o garçom;',
          'desconfiar de palavra que parece igualzinha.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Sexta à noite no Mania',
        lugar: 'Mania de Churrasco, mesa perto da janela',
        falas: [
          { quem: 'luna', texto: 'Walter, um perro caliente, por favor!' },
          { quem: 'walter', texto: 'Au?!' },
          { quem: 'renan', texto: 'Aqui é cachorro-quente, Luna. E fala baixinho: o Walter é um cachorro.' },
          { quem: 'ari', texto: 'Pra mim, a arepa de queijo. A da semana passada estava exquisita!' },
          { quem: 'walter', texto: 'Auuu...' },
          { quem: 'renan', texto: 'Calma, Walter! "Exquisita" em espanhol é deliciosa. Em português, "esquisita" é estranha.' },
          { quem: 'luna', texto: 'Naguará... eu passei um mês chamando a comida dos outros de esquisita.' },
          { quem: 'ari', texto: 'No final, a gente deixa uma propina pro Walter?' },
          { quem: 'renan', texto: 'Gorjeta! Propina aqui é suborno. O Walter é honesto.' },
          { quem: 'walter', texto: 'Au! Au!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da cena',
        itens: [
          { emoji: '🌭', pt: 'cachorro-quente', es: 'perro caliente' },
          { emoji: '🐶', pt: 'cachorro', es: 'perro', nota: 'o Walter!' },
          { emoji: '😋', pt: 'delicioso · gostoso', es: 'exquisito · rico' },
          { emoji: '🤨', pt: 'esquisito', es: 'raro · extraño' },
          { emoji: '💰', pt: 'gorjeta', es: 'propina' },
          { emoji: '🕵️', pt: 'propina', es: 'soborno', nota: 'coisa de filme policial' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Falsos amigos',
        texto: 'São palavras que **parecem iguais** nas duas línguas, mas **querem dizer outra coisa**. Os linguistas chamam de *heterossemânticos*. Para quem fala espanhol, eles são a maior pegadinha do português — justamente porque o resto é tão parecido.',
      },
      {
        tipo: 'tabela',
        titulo: 'Os falsos amigos da mesa',
        colunas: ['A palavra', 'Em espanhol quer dizer…', 'Em português quer dizer…'],
        linhas: [
          ['exquisito · esquisito', 'delicioso', 'estranho (raro)'],
          ['propina', 'gorjeta', 'suborno (soborno)'],
          ['vaso', 'copo', 'vaso de flor (florero)'],
          ['taza · taça', 'xícara', 'taça de vinho (copa)'],
          ['cena', 'jantar', 'cena de filme (escena)'],
          ['salsa', 'molho', 'salsinha (perejil)'],
          ['polvo', 'pó', 'o bicho de oito braços (pulpo)'],
          ['presunto', 'suposto', 'o frio do sanduíche (jamón)'],
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'E longe da mesa',
        colunas: ['A palavra', 'Em espanhol quer dizer…', 'Em português quer dizer…'],
        linhas: [
          ['embarazada · embaraçada', 'grávida', 'confusa, enrolada'],
          ['borracha', 'bêbada', 'a de apagar (goma)'],
          ['apellido · apelido', 'sobrenome', 'nome carinhoso (apodo)'],
          ['cachorro', 'filhote', 'cão de qualquer idade (perro)'],
          ['rato', 'um tempinho', 'o bicho (ratón)'],
          ['largo', 'comprido', 'amplo (ancho)'],
          ['rojo · roxo', 'vermelho', 'a cor da uva (morado)'],
          ['pelado (na Venezuela)', 'sem dinheiro', 'sem roupa!'],
        ],
      },
      {
        tipo: 'atencao',
        texto: '"Embaraçada" existe em português, mas quer dizer **confusa** ou **enrolada** (cabelo embaraçado!). Para vergonha, diga **fiquei envergonhado** ou **fiquei sem graça**.',
      },
      {
        tipo: 'dica',
        texto: 'Palavra igualzinha ao espanhol? Desconfie um pouquinho. Na dúvida, pergunte: "O que quer dizer…?". Ninguém acha feio.',
      },
      {
        tipo: 'brasil',
        titulo: 'A gorjeta já vem na conta',
        texto: 'Em muitos restaurantes do Brasil, a conta chega com **10% de serviço** — que é opcional. Se o atendimento foi bom (como o do Walter), é só pagar junto.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'ligar',
      enunciado: 'Ligue a palavra em espanhol à tradução em português.',
      pares: [
        ['exquisito', 'delicioso'],
        ['propina', 'gorjeta'],
        ['vaso', 'copo'],
        ['cena', 'jantar'],
        ['embarazada', 'grávida'],
      ],
      porque: 'Cuidado: "esquisito", "propina", "vaso" e "cena" existem em português — com outro sentido.',
    },
    {
      tipo: 'conversa',
      enunciado: 'O Walter está atendendo a mesa. Escolha o que o Ari diz.',
      com: 'walter',
      turnos: [
        {
          contexto: 'O Walter traz o cardápio.',
          fala: 'Au! Au?',
          opcoes: [
            'Um suco de morango num vaso grande, por favor.',
            'Um suco de morango num copo grande, por favor.',
            'Um suco de morango numa taza grande, por favor.',
          ],
          certa: 1,
          porque: 'Suco se toma no copo! Vaso é de flor — e "taza", em português, é xícara.',
        },
        {
          contexto: 'Ele serve a arepa e fica esperando.',
          fala: 'Au?',
          opcoes: ['Hum, está esquisita!', 'Hum, está exquisita!', 'Hum, está deliciosa!'],
          certa: 2,
          porque: 'Para elogiar: delicioso, gostoso, uma delícia. "Esquisito" é estranho!',
        },
        {
          contexto: 'Ele traz a conta.',
          fala: 'Au!',
          opcoes: ['Aqui está, e fica com a gorjeta!', 'Aqui está, e fica com a propina!'],
          certa: 0,
          porque: 'Gorjeta é o dinheirinho a mais para quem atendeu. Propina é suborno — coisa de filme policial.',
        },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        {
          frase: 'Em português, "cachorro" é qualquer cão, filhote ou adulto.',
          verdade: true,
          porque: 'O Walter é um cachorro, e adulto. Em espanhol, "cachorro" é só o filhote.',
        },
        {
          frase: 'Se a comida está esquisita, ela está deliciosa.',
          verdade: false,
          porque: 'Esquisita = estranha. Deliciosa é "exquisita" em espanhol.',
        },
        {
          frase: '"Um rato", em português, é um tempinho.',
          verdade: false,
          porque: 'Rato é o bicho (ratón) — o Gatito que o diga. Um tempinho é "um pouquinho" ou "um instante".',
        },
        {
          frase: 'Roxo é a cor da uva.',
          verdade: true,
          porque: 'Roxo = morado. O "rojo" do espanhol é vermelho.',
        },
        {
          frase: 'O apelido de uma pessoa é o sobrenome dela.',
          verdade: false,
          porque: 'Apelido é nome carinhoso (apodo). Sobrenome é o "apellido" do espanhol.',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o diário da Luna com as palavras do banco. Cuidado: tem falso amigo no banco!',
      titulo: 'Querido diário,',
      texto: 'Hoje o {0} no Mania foi ótimo. A arepa estava {1} e o Walter trouxe o suco num {2} gigante. Eu fiquei {3} quando pedi um perro caliente... No fim, a gente deixou uma boa {4}.',
      respostas: ['jantar', 'deliciosa', 'copo', 'envergonhada', 'gorjeta'],
      distratores: ['cena', 'esquisita', 'vaso', 'embarazada', 'propina'],
      porque: [
        '"Cena", em português, é de filme. A refeição da noite é o jantar.',
        'Elogio é "deliciosa". "Esquisita" seria estranha.',
        'Suco vem no copo. "Vaso" é de planta.',
        'Vergonha é "envergonhada". "Embarazada" seria grávida!',
        'Gorjeta é o agrado do garçom. "Propina" é suborno.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no falso amigo e veja a correção.',
      itens: [
        {
          palavras: ['O', 'Renan', 'esqueceu', 'o', 'apellido', 'da', 'Luna.'],
          errada: 4,
          correcao: 'sobrenome',
          porque: 'O nome de família é "sobrenome". "Apelido" é o nome carinhoso.',
        },
        {
          palavras: ['Eu', 'apago', 'o', 'erro', 'com', 'a', 'goma.'],
          errada: 6,
          correcao: 'borracha.',
          porque: 'Em português, a de apagar é a "borracha". (E "bêbada" é outra conversa...)',
        },
        {
          palavras: ['A', 'Luna', 'ficou', 'embarazada', 'com', 'a', 'pergunta.'],
          errada: 3,
          correcao: 'envergonhada',
          porque: 'Com vergonha: "envergonhada" ou "sem graça". "Embarazada" é grávida!',
        },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não é falso amigo?',
      itens: [
        {
          pergunta: 'Qual palavra quer dizer a MESMA coisa nas duas línguas?',
          opcoes: ['polvo', 'rato', 'chocolate', 'largo'],
          certa: 2,
          porque: 'Chocolate é chocolate em qualquer lugar. Polvo (pó × bicho), rato (tempinho × bicho) e largo (comprido × amplo) enganam.',
        },
        {
          pergunta: 'E agora?',
          opcoes: ['borracha', 'café', 'vaso', 'cena'],
          certa: 1,
          porque: 'Café é café. Borracha, vaso e cena mudam de sentido.',
        },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha a resposta certa.',
      itens: [
        {
          pergunta: 'O Gatito correu atrás de um rato. O que ele perseguiu?',
          opcoes: ['🐭 um ratinho', '⏱️ um momentinho', '✏️ uma borracha'],
          certa: 0,
          porque: 'Em português, rato é o bicho. Coitado do rato...',
        },
        {
          pergunta: 'Na Venezuela, "estoy pelado" é estar sem dinheiro. No Brasil, "estou pelado" quer dizer…',
          opcoes: ['que está sem dinheiro', 'que está sem roupa 😳', 'que cortou o cabelo'],
          certa: 1,
          porque: 'Sem roupa! Sem dinheiro, no Brasil, é "estou duro" ou "estou sem grana".',
        },
      ],
    },
  ],
  consigo: [
    'reconhecer falsos amigos como esquisito, propina, vaso e cena;',
    'elogiar a comida do jeito certo;',
    'deixar gorjeta (e não propina) para o Walter;',
    'desconfiar de palavra que parece igual ao espanhol.',
  ],
  aula: {
    chamada: [
      { quem: 'luna', texto: '¡Panas! A próxima aula do Gatito já vai começar!' },
      { quem: 'luna', texto: 'Hoje é falsos amigos. Eu sou especialista em cair neles... ¡Qué pena!' },
      { quem: 'luna', texto: 'Vou na frente guardar os lugares!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje a aula é sobre amigos.' },
      { quem: 'ari', texto: 'Amigos?' },
      { quem: 'gatito', texto: 'Falsos amigos. Palavras que parecem espanhol, mas mentem.' },
      { quem: 'luna', texto: 'Eu já elogiei muita comida de esquisita. Não me julguem.' },
      { quem: 'gatito', texto: 'Abram na lição 2: "O jantar das confusões".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Agora ninguém mais chama a comida do Walter de esquisita.' },
      { quem: 'renan', texto: 'E a gorjeta dele tá garantida.' },
      { quem: 'luna', texto: 'Vou contar pro Walter. Ele vai ficar burda de feliz!' },
    ],
  },
};
