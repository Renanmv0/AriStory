import type { Licao } from '../tipos';

/**
 * LIÇÃO 4 — "Na horta da Josefina": o GÊNERO das palavras.
 *
 * Os heterogenéricos — as palavras que trocam de gênero do espanhol para o
 * português (la leche → o leite, el árbol → a árvore) — e a regra de ouro do
 * "-agem", que é sempre feminino. De brinde, os nomes das frutas e das
 * comidas que na Venezuela têm outro nome (patilla, cambur, lechosa…).
 *
 * A Josefina e a horta dela existem no clube; o "devagar se chega" é o jeito
 * dela (`clube.ts`: "Eu sou devagar, meu bem. Mas eu chego.").
 */
export const LICAO_4: Licao = {
  id: 'horta-da-josefina',
  numero: 4,
  titulo: 'Na horta da Josefina',
  subtitulo: 'Um sábado de colheita no clube',
  assunto: 'o leite, a árvore: o gênero das palavras',
  emoji: '🍉',
  cor: 'verde',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'saber quais palavras trocam de gênero do espanhol para o português;',
          'usar o "o" e o "a" certos (e o adjetivo junto);',
          'usar a regra de ouro: tudo que termina em -agem é feminino;',
          'pedir melancia, maracujá e mamão pelo nome brasileiro.',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Sábado de colheita',
        lugar: 'A horta da Josefina, no clube',
        falas: [
          { quem: 'josefina', texto: 'Bom dia, meus bens! Vieram colher comigo?' },
          { quem: 'luna', texto: '¡Qué nota! Olha que patilla gigante!' },
          { quem: 'josefina', texto: 'Patilla? Aqui ela se chama melancia, meu bem.' },
          { quem: 'ari', texto: 'E aquela árvore com a fruta amarela?' },
          { quem: 'josefina', texto: 'É o pé de mamão. Na sua terra ele tem outro nome, não tem?' },
          { quem: 'ari', texto: 'Lechosa! Hum... que cheiro bom. Senti com a nariz daqui.' },
          { quem: 'renan', texto: 'Com O nariz, Ari. Em português, nariz é masculino.' },
          { quem: 'luna', texto: '¡Qué vaina! Em espanhol é la nariz, la leche, la miel...' },
          { quem: 'josefina', texto: 'Aqui é o nariz, o leite, o mel. E a árvore, a cor, a viagem — que em espanhol são meninos.' },
          { quem: 'josefina', texto: 'Devagar se chega, meu bem. Planta e palavra: ninguém consegue apressar.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Na Venezuela é assim; no Brasil, assim',
        itens: [
          { emoji: '🍉', pt: 'a melancia', es: 'patilla' },
          { emoji: '🍌', pt: 'a banana', es: 'cambur' },
          { emoji: '🧡', pt: 'o mamão', es: 'lechosa' },
          { emoji: '💛', pt: 'o maracujá', es: 'parchita' },
          { emoji: '🎃', pt: 'a abóbora', es: 'auyama' },
          { emoji: '🌽', pt: 'o milho', es: 'jojoto' },
          { emoji: '🍿', pt: 'a pipoca', es: 'cotufas' },
          { emoji: '🫘', pt: 'o feijão preto', es: 'caraotas' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'Menino ou menina?',
        texto: 'Em português, todo substantivo é **masculino (o)** ou **feminino (a)**, igual ao espanhol. A pegadinha: algumas palavras **trocam de gênero** de uma língua para a outra. São os *heterogenéricos*.',
      },
      {
        tipo: 'tabela',
        titulo: 'Em espanhol é LA, em português é O',
        colunas: ['Em espanhol', 'Em português'],
        linhas: [
          ['la leche', 'o leite'],
          ['la miel', 'o mel'],
          ['la sal', 'o sal'],
          ['la sangre', 'o sangue'],
          ['la nariz', 'o nariz'],
          ['la sonrisa', 'o sorriso'],
          ['la costumbre', 'o costume'],
          ['la alarma', 'o alarme'],
        ],
      },
      {
        tipo: 'tabela',
        titulo: 'Em espanhol é EL, em português é A',
        colunas: ['Em espanhol', 'Em português'],
        linhas: [
          ['el árbol', 'a árvore'],
          ['el puente', 'a ponte'],
          ['el color', 'a cor'],
          ['el dolor', 'a dor'],
          ['el viaje', 'a viagem'],
          ['el mensaje', 'a mensagem'],
          ['el paisaje', 'a paisagem'],
          ['el equipo', 'a equipe'],
        ],
      },
      {
        tipo: 'dica',
        texto: 'A regra de ouro: terminou em **-agem**, pode pôr "a" sem medo — a viagem, a mensagem, a garagem, a paisagem, a massagem. Em espanhol, as irmãs em -aje são todas masculinas.',
      },
      {
        tipo: 'atencao',
        texto: 'O gênero manda na frase inteira: o artigo, o adjetivo e até a contração mudam junto. **O** leite está gelad**o**; **a** árvore é alt**a**; **no** nariz, **na** ponte.',
      },
      {
        tipo: 'brasil',
        titulo: 'A feira livre',
        texto: 'Uma vez por semana, uma rua da cidade vira mercado: barracas de fruta, verdura, peixe… e o **pastel de feira com caldo de cana**, que é quase obrigatório. Feirante que gosta de você dá "uma provinha" da fruta.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'classificar',
      enunciado: 'O ou A? Separe as palavras.',
      grupos: ['o (masculino)', 'a (feminino)'],
      itens: [
        { texto: 'leite', grupo: 0, porque: 'Em espanhol é "la leche", mas em português é O leite.' },
        { texto: 'viagem', grupo: 1, porque: 'Termina em -agem: é feminina. A viagem.' },
        { texto: 'mel', grupo: 0, porque: '"La miel" em espanhol; O mel em português.' },
        { texto: 'árvore', grupo: 1, porque: '"El árbol" em espanhol; A árvore em português.' },
        { texto: 'sorriso', grupo: 0, porque: '"La sonrisa" em espanhol; O sorriso em português.' },
        { texto: 'ponte', grupo: 1, porque: '"El puente" em espanhol; A ponte em português.' },
        { texto: 'nariz', grupo: 0, porque: '"La nariz" em espanhol; O nariz em português.' },
        { texto: 'cor', grupo: 1, porque: '"El color" em espanhol; A cor em português.' },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue o nome venezuelano ao nome brasileiro.',
      pares: [
        ['patilla', 'melancia'],
        ['cambur', 'banana'],
        ['lechosa', 'mamão'],
        ['parchita', 'maracujá'],
        ['cotufas', 'pipoca'],
        ['caraotas', 'feijão preto'],
      ],
      porque: 'Na feira brasileira ninguém vai entender "cambur" — mas todo mundo sorri se você pedir uma banana.',
    },
    {
      tipo: 'escolha',
      enunciado: 'Complete com o artigo ou o adjetivo certo.',
      itens: [
        {
          pergunta: '___ viagem até a escola foi longa.',
          opcoes: ['O', 'A'],
          certa: 1,
          porque: '-agem é feminino: A viagem.',
        },
        {
          pergunta: 'O leite está ___.',
          opcoes: ['gelado', 'gelada'],
          certa: 0,
          porque: 'Leite é masculino, então o adjetivo também: o leite gelado.',
        },
        {
          pergunta: 'A árvore do Villa Lobos é muito ___.',
          opcoes: ['alto', 'alta'],
          certa: 1,
          porque: 'Árvore é feminino em português: a árvore alta.',
        },
        {
          pergunta: 'Senti o cheiro da flor com ___ nariz.',
          opcoes: ['a', 'o'],
          certa: 1,
          porque: 'Nariz é masculino em português: o nariz. Em espanhol é "la nariz".',
        },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque na palavra errada.',
      itens: [
        {
          palavras: ['Eu', 'coloquei', 'a', 'sal', 'na', 'salada.'],
          errada: 2,
          correcao: 'o',
          porque: '"La sal" em espanhol, mas O sal em português.',
        },
        {
          palavras: ['A', 'Luna', 'mandou', 'um', 'mensagem', 'pro', 'Ari.'],
          errada: 3,
          correcao: 'uma',
          porque: 'Mensagem termina em -agem: é feminina. Uma mensagem.',
        },
        {
          palavras: ['O', 'cor', 'do', 'uniforme', 'dos', 'Gatitos', 'é', 'azul.'],
          errada: 0,
          correcao: 'A',
          porque: '"El color" em espanhol, mas A cor em português.',
        },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a lista de compras da Luna com o nome brasileiro de cada coisa.',
      titulo: '🛒 Lista da Luna (em português, ¡por fin!)',
      texto: 'Comprar: uma {0} bem grande (patilla), seis {1} (cambur) para fazer vitamina, {2} (cotufas) para o cinema e {3} (caraotas) para o almoço de domingo.',
      respostas: ['melancia', 'bananas', 'pipoca', 'feijão preto'],
      distratores: ['mamão', 'maracujá'],
      porque: [
        'Patilla = melancia.',
        'Cambur = banana — e seis bananas.',
        'Cotufas = pipoca.',
        'Caraotas = feijão preto, o da feijoada.',
      ],
    },
    {
      tipo: 'intruso',
      enunciado: 'Ache a diferente.',
      itens: [
        {
          pergunta: 'Qual destas palavras é MASCULINA em português?',
          opcoes: ['garagem', 'paisagem', 'sorriso', 'massagem'],
          certa: 2,
          porque: 'O sorriso. As outras três terminam em -agem: todas femininas.',
        },
        {
          pergunta: 'E qual destas é FEMININA em português?',
          opcoes: ['leite', 'mel', 'sangue', 'ponte'],
          certa: 3,
          porque: 'A ponte! Em espanhol é "el puente". Leite, mel e sangue são masculinos em português.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva a palavra em português.',
      itens: [
        { antes: 'el viaje → a', aceitas: ['viagem'], porque: 'El viaje = a viagem (com G, e feminina).' },
        { antes: 'la leche → o', aceitas: ['leite'], porque: 'La leche = o leite (masculino).' },
        { antes: 'el puente → a', aceitas: ['ponte'], porque: 'El puente = a ponte (feminina).' },
      ],
    },
  ],
  consigo: [
    'lembrar que o leite, o mel, o sal e o nariz são masculinos;',
    'lembrar que a árvore, a ponte, a cor e a viagem são femininas;',
    'usar a regra de ouro: -agem é feminino;',
    'fazer o adjetivo concordar: o leite gelado, a árvore alta;',
    'pedir melancia, maracujá e mamão na feira.',
  ],
  aula: {
    chamada: [
      { quem: 'luna', texto: '¡Panas! Aula do Gatito daqui a pouco! Hoje é sobre o gênero das palavras.' },
      { quem: 'luna', texto: 'Eu sempre falo "a leite". Sempre! ¡Qué vaina! Bora, que eu guardo o lugar.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Pergunta rápida: o leite ou a leite?' },
      { quem: 'luna', texto: '...A leite?' },
      { quem: 'gatito', texto: 'O leite! Hoje é dia das palavras que trocam de gênero. Lição 4: "Na horta da Josefina".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'O leite, o mel, a árvore, a viagem... vocês estão afiados.' },
      { quem: 'renan', texto: 'A Josefina ia ficar orgulhosa.' },
      { quem: 'gatito', texto: 'Ia sim. Devagar, mas ia.' },
    ],
  },
};
