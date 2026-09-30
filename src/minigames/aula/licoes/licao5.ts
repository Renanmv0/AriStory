import type { Licao } from '../tipos';

/**
 * LIÇÃO 5 — "Fica a dica!": um domingo no Villa Lobos.
 *
 * O verbo FICAR, o coringa do português: permanecer, estar localizado, mudar
 * de estado, dar um resultado, combinar. Em espanhol ele se espalha em
 * quedarse, quedar, ponerse e estar — e é por isso que o hispanofalante
 * tropeça (o "quedou", o "me fiquei"). A pegadinha de gente grande é o
 * "ficar com alguém", e ela entra de leve, pela dica do Gatito.
 */
export const LICAO_5: Licao = {
  id: 'fica-a-dica',
  numero: 5,
  titulo: 'Fica a dica!',
  subtitulo: 'Um domingo no Villa Lobos',
  assunto: 'o verbo ficar, o coringa do português',
  emoji: '📍',
  cor: 'azul',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'usar o verbo mais coringa do português;',
          'dizer onde um lugar fica;',
          'contar como você ficou: feliz, cansado, com fome;',
          'elogiar: "ficou lindo!".',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'Domingo de sol',
        lugar: 'Parque Villa Lobos, perto da roda gigante',
        falas: [
          { quem: 'luna', texto: '¡Qué nota! Vamos ficar aqui a tarde toda?' },
          { quem: 'ari', texto: 'Vamos! Onde fica a sorveteria?' },
          { quem: 'renan', texto: 'Fica ali, perto do lago.' },
          { quem: 'ari', texto: 'Fiquei com vontade de um sorvete de morango.' },
          { quem: 'luna', texto: 'E eu fico com o de chocolate!' },
          { quem: 'renan', texto: 'Ari, você ficou com um bigode de sorvete.' },
          { quem: 'luna', texto: 'Ficou muito fofo! Tira uma foto!' },
          { quem: 'ari', texto: 'A foto ficou ótima. Fiquei feliz.' },
          { quem: 'renan', texto: 'Ah... eu fiquei de trazer a toalha do piquenique. E esqueci.' },
          { quem: 'luna', texto: '¡Ay, Renan!' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'O ficar da cena',
        itens: [
          { emoji: '🏠', pt: 'ficar aqui', es: 'quedarse aquí' },
          { emoji: '📍', pt: 'onde fica…?', es: '¿dónde queda…?' },
          { emoji: '😋', pt: 'fiquei com vontade', es: 'me dieron ganas' },
          { emoji: '🍫', pt: 'eu fico com o de chocolate', es: 'me quedo con el de chocolate' },
          { emoji: '📸', pt: 'a foto ficou ótima', es: 'la foto quedó genial' },
          { emoji: '🧺', pt: 'fiquei de trazer', es: 'quedé en traer' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O verbo coringa',
        texto: '**Ficar** serve para quase tudo. Em espanhol, ele se espalha em vários verbos — *quedarse, quedar, ponerse, estar*. Os cinco jeitos principais:',
      },
      {
        tipo: 'tabela',
        colunas: ['O jeito', 'Exemplo', 'Em espanhol'],
        linhas: [
          ['🏠 permanecer', 'Vamos ficar em casa hoje.', 'quedarse'],
          ['📍 estar num lugar', 'A sorveteria fica perto do lago.', 'quedar · estar'],
          ['😊 mudar de estado', 'Fiquei feliz. Ele ficou nervoso.', 'ponerse · quedarse'],
          ['✨ o resultado', 'A foto ficou ótima.', 'quedar'],
          ['🤝 combinar', 'O Renan ficou de trazer a toalha.', 'quedar en'],
        ],
        nota: 'E o "ficar com": fiquei com fome, com medo, com vontade (= me dio hambre…); e "eu fico com o de chocolate" (= me quedo con).',
      },
      {
        tipo: 'tabela',
        titulo: 'Conjugando',
        colunas: ['', 'hoje', 'ontem'],
        linhas: [
          ['eu', 'fico', 'fiquei'],
          ['você · ele · ela · a gente', 'fica', 'ficou'],
          ['nós', 'ficamos', 'ficamos'],
          ['vocês · eles · elas', 'ficam', 'ficaram'],
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Ficar **não é reflexivo**: "eu fico em casa", nunca "eu me fico". E no passado o c vira qu: fi**qu**ei.',
      },
      {
        tipo: 'dica',
        texto: 'Cuidado com "ficar com alguém": entre os jovens, é um namorinho! Para contar que passou a tarde junto, diga "passei a tarde com a Luna".',
      },
      {
        tipo: 'brasil',
        titulo: 'Fica a dica!',
        texto: '"Fica a dica" é como o brasileiro dá um conselho sem mandar: "Leve guarda-chuva, fica a dica!". E "fica tranquilo" (ou "fica frio") é o jeito de acalmar alguém.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'classificar',
      enunciado: 'Qual é o jeito do ficar em cada frase?',
      grupos: ['🏠 permanecer', '📍 lugar', '😊 mudança', '✨ resultado'],
      itens: [
        { texto: 'Vamos ficar mais um pouco?', grupo: 0, porque: 'Não ir embora: permanecer (quedarse).' },
        { texto: 'O ginásio fica ao lado do saguão.', grupo: 1, porque: 'Onde está o ginásio: lugar.' },
        { texto: 'Fiquei nervoso na prova.', grupo: 2, porque: 'Não estava nervoso e passou a estar: mudança de estado.' },
        { texto: 'O bolo ficou uma delícia.', grupo: 3, porque: 'Como o bolo saiu: resultado.' },
        { texto: 'Onde fica o banheiro?', grupo: 1, porque: 'Pergunta de lugar: onde fica?' },
        { texto: 'A Luna ficou tímida.', grupo: 2, porque: 'Ela mudou: ficou tímida (se puso tímida).' },
        { texto: 'A tiara ficou linda em você.', grupo: 3, porque: 'Como a tiara caiu em você: resultado.' },
        { texto: 'Hoje eu fico em casa.', grupo: 0, porque: 'Não sair: permanecer.' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete o diário do Ari com o verbo ficar no passado.',
      titulo: 'Domingo, no Villa Lobos',
      texto: 'Ontem a gente {0} no parque até o pôr do sol. Eu {1} com vontade de sorvete. A foto que o Renan tirou {2} linda. No fim, nós {3} cansados, mas felizes — e os pompons da Luna {4} cheios de grama.',
      respostas: ['ficou', 'fiquei', 'ficou', 'ficamos', 'ficaram'],
      distratores: ['fico', 'me fiquei', 'quedou'],
      porque: [
        '"A gente" pede a 3ª pessoa: a gente ficou.',
        'Eu → fiquei (com qu).',
        'A foto (ela) → ficou.',
        'Nós → ficamos.',
        'Os pompons (eles) → ficaram.',
      ],
    },
    {
      tipo: 'conversa',
      enunciado: 'Mensagens da Luna. Escolha a resposta do Ari.',
      com: 'luna',
      turnos: [
        {
          fala: 'Ari, o que achou do meu uniforme novo dos Gatitos?',
          opcoes: ['Quedou lindo!', 'Ficou lindo!', 'Se ficou lindo!'],
          certa: 1,
          porque: 'Elogio de resultado: "ficou lindo", "ficou ótimo". "Quedar" não existe em português.',
        },
        {
          fala: 'E onde fica a sua casa?',
          opcoes: ['Fica perto do parque.', 'Queda perto do parque.', 'Está quedando perto do parque.'],
          certa: 0,
          porque: 'Para lugar: fica perto, fica longe, fica ali.',
        },
        {
          fala: 'A gente vai embora. Vocês vão ficar?',
          opcoes: ['Vamos nos ficar mais um pouco.', 'Vamos quedar mais um pouco.', 'Vamos ficar mais um pouco.'],
          certa: 2,
          porque: 'Ficar não é reflexivo: "vamos ficar", nunca "vamos nos ficar".',
        },
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Onde', 'queda', 'a', 'escola', 'do', 'Gatito?'],
          errada: 1,
          correcao: 'fica',
          porque: 'Lugar em português é com ficar: "Onde fica a escola?".',
        },
        {
          palavras: ['Ontem', 'eu', 'me', 'fiquei', 'em', 'casa.'],
          errada: 2,
          correcao: '(sem o "me")',
          porque: 'Ficar não é reflexivo: "Ontem eu fiquei em casa".',
        },
        {
          palavras: ['O', 'Renan', 'se puso', 'vermelho', 'de', 'vergonha.'],
          errada: 2,
          correcao: 'ficou',
          porque: '"Ponerse" + cor ou emoção vira "ficar": ficou vermelho, ficou nervoso.',
        },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Qual é a tradução certa?',
      itens: [
        {
          pergunta: '"Me quedé en casa."',
          opcoes: ['Eu me fiquei em casa.', 'Eu quedei em casa.', 'Eu fiquei em casa.'],
          certa: 2,
          porque: 'Quedarse = ficar, sem o "me": eu fiquei em casa.',
        },
        {
          pergunta: '"Me puse nervioso."',
          opcoes: ['Fiquei nervoso.', 'Me pus nervoso.', 'Pus nervoso.'],
          certa: 0,
          porque: 'Ponerse + emoção = ficar: fiquei nervoso.',
        },
        {
          pergunta: '"Quedamos en vernos el domingo."',
          opcoes: [
            'A gente quedou em se ver no domingo.',
            'A gente ficou de se ver no domingo.',
            'A gente ficou em se ver no domingo.',
          ],
          certa: 1,
          porque: 'Quedar en + verbo = ficar de + verbo: a gente ficou de se ver.',
        },
      ],
    },
    {
      tipo: 'ordenar',
      enunciado: 'Monte a frase.',
      itens: [
        { pedacos: ['O Renan', 'ficou', 'de', 'trazer', 'a toalha.'], porque: 'Ficar de + verbo = combinar de fazer (quedar en).' },
        { pedacos: ['Fiquei', 'com', 'vontade', 'de', 'sorvete.'], porque: 'Ficar com + vontade, fome, medo = passar a sentir.' },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Complete com o verbo ficar.',
      itens: [
        { antes: '(ontem) Eu', depois: 'com fome depois do treino.', aceitas: ['fiquei'], porque: 'Eu, no passado: fiquei (com qu).' },
        { antes: '(hoje) Onde', depois: 'o ginásio?', aceitas: ['fica'], porque: 'Lugar, no presente: onde fica?' },
        { antes: '(ontem) Vocês', depois: 'lindos na foto!', aceitas: ['ficaram'], porque: 'Vocês, no passado: ficaram.' },
      ],
    },
  ],
  consigo: [
    'dizer onde um lugar fica;',
    'contar como fiquei: feliz, nervoso, com fome;',
    'elogiar com "ficou lindo!";',
    'combinar com "ficar de";',
    'conjugar: fico, fica, fiquei, ficou, ficamos, ficaram.',
  ],
  aula: {
    chamada: [
      { quem: 'luna', texto: '¡Épale! Hoje a aula é sobre o verbo ficar. O Gatito diz que é o verbo mais importante do Brasil.' },
      { quem: 'luna', texto: 'Fica a dica: sentem na primeira fila! Eu vou na frente.' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Hoje tem o verbo mais coringa do português.' },
      { quem: 'renan', texto: 'Ficar.' },
      { quem: 'gatito', texto: 'Com o Renan soprando, ficou fácil. Lição 5: "Fica a dica!".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Você ficou craque no ficar, Ari.' },
      { quem: 'luna', texto: 'Eu fiquei com vontade de ir no Villa Lobos agora.' },
      { quem: 'gatito', texto: 'Fica a dica pra depois da aula.' },
    ],
  },
};
