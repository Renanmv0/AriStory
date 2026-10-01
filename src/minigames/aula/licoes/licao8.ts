import type { Licao } from '../tipos';

/**
 * LIÇÃO 8 — "Bola pra frente!": esporte no ginásio dos Gatitos.
 *
 * O "jugar" do espanhol se divide em dois no português: JOGAR (esporte, jogo,
 * videogame) e BRINCAR (brincadeira de criança, e também piada: "tô
 * brincando"). E "brincar" é falso amigo de verdade — em espanhol, é pular!
 * Junto, o vocabulário do jogo (quadra, time, placar, ganhar, perder,
 * empatar) e a palavra que é a cara das três coelhinhas: TORCER, a torcida.
 *
 * A cena é a revanche de basquete no ginásio, com a Sol perdendo e a Luna
 * torcendo pros dois.
 */
export const LICAO_8: Licao = {
  id: 'bola-pra-frente',
  numero: 8,
  titulo: 'Bola pra frente!',
  subtitulo: 'Um jogo de basquete no ginásio',
  assunto: 'jogar, brincar e torcer: o esporte',
  emoji: '🏀',
  cor: 'verde',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'separar jogar de brincar (o "jugar" do espanhol);',
          'falar de um jogo: a quadra, o time, o placar;',
          'contar quem ganhou, quem perdeu e quem empatou;',
          'torcer como as coelhinhas.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'A revanche',
        lugar: 'Ginásio da escola, na quadra de basquete',
        falas: [
          { quem: 'sol', texto: '¡VAMOS A JUGAR! ...Quer dizer: bora jogar basquete!' },
          { quem: 'ari', texto: 'Eu adoro brincar de basquete!' },
          { quem: 'renan', texto: 'Jogar, Ari. Brincar é de criança... ou de piada.' },
          { quem: 'ari', texto: 'Mas em espanhol "brincar" é pular!' },
          { quem: 'estrella', texto: 'A Sol pula e brinca. As duas coisas. O tempo todo.' },
          { quem: 'ari', texto: 'Cesta! Ponto pra mim!' },
          { quem: 'luna', texto: '¡Qué nota! Dois a zero pro Ari!' },
          { quem: 'sol', texto: 'Tá brincando! Eu quero revanche!' },
          { quem: 'luna', texto: 'E a gente torce pros dois. Somos a torcida!' },
          { quem: 'renan', texto: 'Perdeu, Sol? Bola pra frente!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras do jogo',
        itens: [
          { emoji: '🏀', pt: 'jogar', es: 'jugar (deporte, juego)' },
          { emoji: '🧸', pt: 'brincar', es: 'jugar (niños) · bromear', nota: 'em espanhol, "brincar" é pular!' },
          { emoji: '🏟️', pt: 'a quadra', es: 'la cancha' },
          { emoji: '👕', pt: 'o time', es: 'el equipo' },
          { emoji: '📣', pt: 'a torcida', es: 'la afición · la barra' },
          { emoji: '🔢', pt: 'o placar', es: 'el marcador' },
          { emoji: '🏆', pt: 'ganhar · perder · empatar', es: 'ganar · perder · empatar' },
          { emoji: '🧺', pt: 'a cesta', es: 'la canasta' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O "jugar" que vira dois',
        texto: 'Em espanhol, criança e jogador de futebol *juegan*. Em português, não: o esporte e o jogo de regras são **jogar**; a brincadeira de criança — e a piada — são **brincar**.',
      },
      {
        tipo: 'tabela',
        colunas: ['Em espanhol', 'Em português', 'Exemplo'],
        linhas: [
          ['jugar al fútbol', 'jogar futebol', 'Vamos jogar futebol no sábado?'],
          ['jugar videojuegos', 'jogar videogame', 'Joguei videogame a noite toda.'],
          ['jugar (los niños)', 'brincar', 'As crianças brincam no parque.'],
          ['bromear', 'brincar', 'Calma, tô brincando!'],
          ['tocar la guitarra', 'tocar violão', 'Ela toca violão muito bem.'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Esporte vai **sem o "a"**: jogar futebol, jogar basquete (e não "jogar ao futebol"). E "brincar" não é pular! Pular é **pular** ou **saltar** — como a Sol.',
      },
      {
        tipo: 'contraste',
        titulo: 'Falsos amigos da quadra',
        pares: [
          { es: 'Brincar la cuerda.', pt: 'Pular corda.' },
          { es: '¡Estás bromeando!', pt: 'Você tá brincando!' },
          { es: 'La cancha de básquet.', pt: 'A quadra de basquete.' },
          { es: 'Una cuadra (de la calle).', pt: 'Um quarteirão.' },
        ],
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Quanto tá o jogo?',
        colunas: ['', 'Exemplo'],
        linhas: [
          ['🏆 ganhar', 'O Ari ganhou de dois a zero.'],
          ['😿 perder', 'A Sol perdeu a primeira.'],
          ['🤝 empatar', 'Empatou: três a três!'],
          ['🔢 o placar', 'Quanto tá o jogo? Tá dois a um.'],
          ['🥅 marcar · fazer ponto', 'Ele fez dois pontos. No futebol: fez um gol!'],
        ],
      },
      {
        tipo: 'texto',
        titulo: 'Torcer',
        texto: '**Torcer para** (ou **por**) um time é querer que ele ganhe, gritar, sofrer junto. Quem torce é **torcedor**, e o grupo todo é a **torcida** — como a Luna, a Sol e a Estrella, a torcida dos Gatitos.',
      },
      {
        tipo: 'dica',
        texto: 'Errou a cesta? Perdeu o jogo? O brasileiro diz "bola pra frente!": esquece e continua. Serve para o jogo, para a vida... e para a apostila.',
      },
      {
        tipo: 'brasil',
        titulo: 'Qual é o seu time?',
        texto: 'No Brasil, "qual é o seu time?" é pergunta de quem acabou de se conhecer. O time de futebol passa de pai para filho, e em dia de jogo grande a rua inteira veste a camisa.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'classificar',
      enunciado: 'Jogar, brincar ou tocar?',
      grupos: ['⚽ jogar', '🧸 brincar', '🎸 tocar'],
      itens: [
        { texto: '… futebol', grupo: 0, porque: 'Esporte é jogar: jogar futebol.' },
        { texto: '… de esconde-esconde', grupo: 1, porque: 'Brincadeira de criança é brincar: brincar de esconde-esconde.' },
        { texto: '… violão', grupo: 2, porque: 'Instrumento se toca: tocar violão.' },
        { texto: '… videogame', grupo: 0, porque: 'Jogo com regra, ganhar e perder: jogar videogame.' },
        { texto: '"Tô só …!" (era piada)', grupo: 1, porque: 'Piada é brincadeira: tô brincando.' },
        { texto: '… basquete', grupo: 0, porque: 'Esporte é jogar: jogar basquete.' },
        { texto: '… piano', grupo: 2, porque: 'Instrumento: tocar piano.' },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: 'Em português, "brincar" quer dizer pular.', verdade: false, porque: 'Pular é pular. Brincar é jugar (de criança) ou bromear.' },
        { frase: '"Tô brincando" quer dizer "estoy bromeando".', verdade: true, porque: 'Brincar também é fazer piada.' },
        { frase: '"Jogar ao futebol" é o jeito certo.', verdade: false, porque: 'Sem o "a": jogar futebol.' },
        { frase: 'Torcer para um time é querer que ele ganhe.', verdade: true, porque: 'E quem torce faz parte da torcida.' },
        { frase: 'A "quadra" do ginásio é a "cancha" do espanhol.', verdade: true, porque: 'Quadra de basquete, de vôlei, de tênis = cancha.' },
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'A Sol mandou mensagem durante o jogo. Escolha a resposta do Ari.',
      com: 'sol',
      turnos: [
        {
          fala: '¡ARI! Quanto tá o jogo?',
          opcoes: ['Está dos a uno.', 'Tá dois a um pra gente!', 'É dois para um.'],
          certa: 1,
          porque: 'O placar se diz com "a": dois a um. E no dia a dia, "tá".',
        },
        {
          fala: 'Você vai jogar no time dos Gatitos?',
          opcoes: ['Vou jogar, sim!', 'Vou brincar no time, sim!', 'Vou a jugar, sim!'],
          certa: 0,
          porque: 'Time e esporte pedem jogar: vou jogar.',
        },
        {
          fala: '¡PERDEMOS! ¡Que tristeza!',
          opcoes: ['Bola pra trás!', 'Que bola!', 'Bola pra frente!'],
          certa: 2,
          porque: 'Para animar depois de perder: bola pra frente!',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a notícia do jornalzinho da escola.',
      novaPagina: true,
      titulo: '🏀 Jornal dos Gatitos',
      texto: 'O jogo foi na {0} do ginásio. O nosso {1} jogou contra a turma da Sol, e a {2} gritou o tempo todo. No fim, o {3} ficou três a três: os dois times {4}!',
      respostas: ['quadra', 'time', 'torcida', 'placar', 'empataram'],
      distratores: ['cancha', 'hinchada', 'ganharam'],
      porque: [
        'A cancha, em português, é a quadra.',
        'O equipo do esporte: o time.',
        'Quem grita e torce é a torcida.',
        'O marcador dos pontos é o placar.',
        'Três a três: ninguém ganhou, empataram.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Vamos', 'jugar', 'basquete', 'hoje?'],
          errada: 1,
          correcao: 'jogar',
          porque: 'Em português é jogar, com "o".',
        },
        {
          palavras: ['As crianças', 'jogam', 'de pega-pega', 'no parque.'],
          errada: 1,
          correcao: 'brincam',
          porque: 'Brincadeira de criança é brincar: brincam de pega-pega.',
        },
        {
          palavras: ['Eu', 'jogo', 'ao', 'futebol', 'no sábado.'],
          errada: 2,
          correcao: '(sem o "ao")',
          porque: 'Esporte vai direto: jogo futebol.',
        },
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Qual não é do jogo?',
      itens: [
        {
          pergunta: 'Três são do jogo de basquete. Qual não é?',
          opcoes: ['o placar', 'a quadra', 'o violão', 'a cesta'],
          certa: 2,
          porque: 'Violão se toca; não tem violão no basquete.',
        },
        {
          pergunta: 'Três são resultados de um jogo. Qual não é?',
          opcoes: ['ganhar', 'empatar', 'perder', 'brincar'],
          certa: 3,
          porque: 'Ganhar, perder e empatar são resultados. Brincar não tem placar.',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['Eu', 'torço', 'para', 'o time', 'da escola.'], porque: 'Torcer para (ou por) um time.' },
        { pedacos: ['O jogo', 'tá', 'dois', 'a', 'um.'], porque: 'O placar: dois a um.' },
      ],
    },
  ],
  consigo: [
    'separar jogar (esporte) de brincar (criança e piada);',
    'dizer o placar e quem ganhou, perdeu ou empatou;',
    'falar da quadra, do time e da torcida;',
    'animar alguém com "bola pra frente!".',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'sol', texto: '¡EL SINAL! Hoje a aula é de esporte! ¡Es MI aula!' },
      { quem: 'luna', texto: 'Sol, toda aula é sua quando você grita assim.' },
      { quem: 'estrella', texto: 'Bebam água antes, tá? Aula de esporte dá sede.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje a aula é sobre o que vocês mais fazem no ginásio.' },
      { quem: 'sol', texto: '¡SALTAR!' },
      { quem: 'gatito', texto: 'Também. Mas hoje é jogar, brincar e torcer. Lição 8: "Bola pra frente!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Placar final: muitos pontos pro Ari. Os erros? Bola pra frente!' },
      { quem: 'luna', texto: 'E a torcida torceu o tempo todo!' },
      { quem: 'estrella', texto: '...E ninguém se machucou. Que bom.' },
    ],
  },
};
