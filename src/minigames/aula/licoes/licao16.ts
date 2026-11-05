import type { Licao } from '../tipos';

/**
 * LIÇÃO 16 — "Antigamente era assim": a caixa de fotos antigas do depósito.
 *
 * O PRETÉRITO IMPERFEITO — o cenário do passado: como era, o que se fazia
 * sempre, o que estava acontecendo. É o par da lição 11 (o perfeito: o fato
 * que acabou). O espanhol tem o mesmo tempo, e por isso mesmo as armadilhas
 * são de escrita: -aba vira -ava (hablaba → falava), o -ía perde o acento
 * (comía → comia, só o "nós" leva: comíamos), o "iba" vira IA e o "solía"
 * vira COSTUMAVA.
 *
 * A lembrança é do Gatito e das três irmãs, e é gostosa de propósito: o
 * Ari e o Renan só perguntam. A infância dos dois de verdade não se inventa
 * (fica para quando o Renan contar).
 */
export const LICAO_16: Licao = {
  id: 'antigamente-era-assim',
  numero: 16,
  titulo: 'Antigamente era assim',
  subtitulo: 'A caixa de fotos antigas do depósito',
  assunto: 'o pretérito imperfeito: era, tinha, fazia',
  emoji: '📸',
  cor: 'mostarda',
  explicacao: [
    [
      {
        tipo: 'objetivos',
        itens: [
          'contar como as coisas eram antigamente: era, tinha, fazia;',
          'escrever -ava e -ia (e não -aba e -ía);',
          'saber quando usar o imperfeito e quando usar o perfeito;',
          'dizer "costumava" no lugar do "solía".',
        ],
      },
      {
        tipo: 'cena',
        titulo: 'A caixa de fotos',
        lugar: 'O depósito da escola, com uma caixa de fotos antigas',
        falas: [
          { quem: 'gatito', texto: 'Olhem o que achei no depósito: fotos antigas da escola!' },
          { quem: 'sol', texto: '¿Essa é a escola? ¡É pequenininha!' },
          { quem: 'gatito', texto: 'Antigamente era assim. Tinha só uma sala, e eu dormia numa caixa de papelão.' },
          { quem: 'ari', texto: 'E vocês tinham ginásio?' },
          { quem: 'gatito', texto: 'Não! A gente treinava no corredor, e a bola vivia batendo na lousa.' },
          { quem: 'luna', texto: 'Eu corria o dia inteiro, pana. Não parava nunca.' },
          { quem: 'estrella', texto: 'Eu era bem tímida quando cheguei... Ainda sou. Mas falava ainda mais baixinho.' },
          { quem: 'sol', texto: '¡E eu GRITAVA! ...Quer dizer: eu grito!' },
          { quem: 'valentina', texto: 'E eu, antigamente, não tinha óculos de sol. Era uma época muito difícil.' },
          { quem: 'gatito', texto: 'Um dia, eu dormia na caixa quando o sino tocou pela primeira vez... e eu pulei de susto!' },
          { quem: 'renan', texto: 'Ari, repara: "dormia" é o cenário. "Tocou" é o que aconteceu.' },
        ],
      },
      {
        tipo: 'palavras',
        titulo: 'Palavras da lembrança',
        itens: [
          { emoji: '📸', pt: 'a foto', es: 'la foto' },
          { emoji: '📦', pt: 'a caixa', es: 'la caja' },
          { emoji: '🕰️', pt: 'antigamente', es: 'antiguamente' },
          { emoji: '⏳', pt: 'naquele tempo', es: 'en aquel tiempo' },
          { emoji: '🏫', pt: 'a escola', es: 'la escuela' },
          { emoji: '🧒', pt: 'quando eu era pequeno', es: 'cuando era pequeño' },
          { emoji: '💭', pt: 'a lembrança', es: 'el recuerdo' },
          { emoji: '😴', pt: 'costumava', es: 'solía' },
        ],
      },
    ],
    [
      {
        tipo: 'texto',
        titulo: 'O passado que era assim',
        texto: 'O **imperfeito** conta o **cenário** do passado: como era, o que a gente fazia **sempre**, o que **estava acontecendo**. Para os verbos em **-ar**, a terminação é **-ava**; para os em **-er** e **-ir**, é **-ia**.',
      },
      {
        tipo: 'tabela',
        colunas: ['', 'falar', 'comer', 'partir'],
        linhas: [
          ['eu', 'falava', 'comia', 'partia'],
          ['você · ele · ela', 'falava', 'comia', 'partia'],
          ['a gente', 'falava', 'comia', 'partia'],
          ['nós', 'falávamos', 'comíamos', 'partíamos'],
          ['vocês · eles', 'falavam', 'comiam', 'partiam'],
        ],
        nota: 'Eu, você, ele, ela e a gente usam a mesma forma: é o contexto que diz quem fala.',
      },
      {
        tipo: 'contraste',
        titulo: 'Quase igual, mas com outro som',
        pares: [
          { es: 'hablaba', pt: 'falava' },
          { es: 'cantaba', pt: 'cantava' },
          { es: 'comía', pt: 'comia' },
          { es: 'iba', pt: 'ia' },
          { es: 'veía', pt: 'via' },
        ],
      },
      {
        tipo: 'atencao',
        texto: 'Em português, o **-aba** vira **-ava** (com v!), e o **-ía** perde o acento: **comia**, **partia**. O acento só aparece no **nós**: falá**vamos**, comí**amos**. E o **ir** é regular no imperfeito: **ia**, e nunca "iba".',
      },
    ],
    [
      {
        tipo: 'tabela',
        titulo: 'Os que fogem da regra',
        colunas: ['Infinitivo', 'Imperfeito', 'Em espanhol'],
        linhas: [
          ['ser', 'era · éramos', 'era · éramos'],
          ['ter', 'tinha · tínhamos', 'tenía · teníamos'],
          ['vir', 'vinha · vínhamos', 'venía · veníamos'],
          ['pôr', 'punha · púnhamos', 'ponía · poníamos'],
        ],
        nota: 'São só quatro. Todos os outros seguem a regra: ver → via, fazer → fazia, dizer → dizia.',
      },
      {
        tipo: 'tabela',
        titulo: 'Imperfeito ou perfeito?',
        colunas: ['', 'Imperfeito', 'Perfeito (lição 11)'],
        linhas: [
          ['é o…', 'cenário, hábito, descrição', 'fato, o que aconteceu'],
          ['exemplo', 'Eu dormia numa caixa.', 'O sino tocou.'],
          ['pistas', 'sempre · todo dia · antigamente', 'ontem · de repente · uma vez'],
        ],
      },
      {
        tipo: 'exemplos',
        titulo: 'Os dois juntos',
        itens: [
          'Eu **dormia** quando o sino **tocou**.',
          'A escola **era** pequena e **tinha** só uma sala.',
          'Todo dia a gente **treinava** no corredor; um dia, a bola **bateu** na lousa.',
        ],
      },
      {
        tipo: 'dica',
        texto: 'O *solía* do espanhol, em português, é **costumava**: "Eu **costumava** dormir numa caixa." E para o que estava acontecendo, vale o **estava + gerúndio**: "Eu **estava dormindo** quando o sino tocou."',
      },
      {
        tipo: 'brasil',
        titulo: '"No meu tempo…"',
        texto: 'Os mais velhos adoram abrir a conversa com "**no meu tempo**..." — e lá vem história no imperfeito: "No meu tempo, a gente **brincava** na rua até escurecer". Quando ouvir isso, prepare o café: a conversa vai longe.',
      },
    ],
  ],
  exercicios: [
    {
      tipo: 'conversa',
      enunciado: 'O Gatito conta o passado. Escolha as perguntas do Ari.',
      com: 'gatito',
      turnos: [
        {
          fala: 'Antigamente a escola era bem pequena. Só tinha uma sala.',
          opcoes: ['E vocês têm ginásio?', 'E vocês tenían ginásio?', 'E vocês tinham ginásio?'],
          certa: 2,
          porque: 'Falando de antigamente, o imperfeito: tinham. O "tenían" é espanhol.',
        },
        {
          fala: 'Não! A gente treinava no corredor mesmo.',
          opcoes: ['E o que você fez o dia inteiro?', 'E o que você fazia o dia inteiro?', 'E o que você hacía o dia inteiro?'],
          certa: 1,
          porque: 'O hábito do dia a dia no passado pede o imperfeito: fazia.',
        },
        {
          fala: 'Eu dormia na caixa quando o sino tocou pela primeira vez!',
          opcoes: ['E o que você fazia?', 'E o que você fez?', 'E o que você faz?'],
          certa: 1,
          porque: 'O sino tocou: foi um fato. A reação também é um fato: o que você fez?',
        },
        {
          fala: 'Pulei de susto, e a caixa virou!',
          opcoes: ['Que susto! Você foi pequeno naquele tempo?', 'Que susto! Você era pequeno naquele tempo?', 'Que susto! Você erá pequeno naquele tempo?'],
          certa: 1,
          porque: 'Descrição do passado: era. Quem "foi" teria um começo e um fim.',
        },
      ],
    },
    {
      tipo: 'ligar',
      enunciado: 'Ligue o verbo ao imperfeito (eu).',
      pares: [
        ['falar', 'falava'],
        ['comer', 'comia'],
        ['partir', 'partia'],
        ['ser', 'era'],
        ['ter', 'tinha'],
        ['ir', 'ia'],
      ],
      porque: '-ar ganha -ava; -er e -ir ganham -ia. Só ser, ter, vir e pôr fogem da regra — e o ir é regular: ia.',
    },
    {
      tipo: 'classificar',
      enunciado: 'Cenário ou fato?',
      grupos: ['🕰️ imperfeito (cenário, hábito)', '⚡ perfeito (fato)'],
      itens: [
        { texto: 'Eu dormia numa caixa.', grupo: 0, porque: 'Cenário: onde ele dormia, sempre.' },
        { texto: 'O sino tocou.', grupo: 1, porque: 'Fato: aconteceu uma vez.' },
        { texto: 'Todo dia a gente treinava no corredor.', grupo: 0, porque: 'Hábito: todo dia.' },
        { texto: 'Ontem eu achei a caixa.', grupo: 1, porque: 'Fato com dia marcado: ontem.' },
        { texto: 'A escola era pequena.', grupo: 0, porque: 'Descrição: como a escola era.' },
        { texto: 'De repente, a lousa caiu.', grupo: 1, porque: 'De repente: um acontecimento.' },
      ],
    },
    {
      tipo: 'escolha',
      enunciado: 'Escolha a melhor opção.',
      itens: [
        {
          pergunta: 'Como se escreve o "hablaba" em português?',
          opcoes: ['falava', 'falaba', 'fálava'],
          certa: 0,
          porque: 'O som é de v: falava, cantava, brincava.',
        },
        {
          pergunta: 'Como se diz o "iba" do espanhol?',
          opcoes: ['ia', 'iba', 'ava'],
          certa: 0,
          porque: 'O ir é regular no imperfeito: eu ia, ele ia.',
        },
        {
          pergunta: 'Como se diz o "solía correr" do espanhol?',
          opcoes: ['costumava correr', 'soltava correr', 'sabia correr'],
          certa: 0,
          porque: 'O solía vira costumava.',
        },
        {
          pergunta: 'Eu ___ quando o telefone tocou. (dormir)',
          opcoes: ['dormia', 'dormi', 'durmia'],
          certa: 0,
          porque: 'O dormir era o cenário (imperfeito); o tocar, o fato.',
        },
      ],
    },
    {
      tipo: 'digitar',
      enunciado: 'Escreva o imperfeito.',
      novaPagina: true,
      itens: [
        { antes: '(ser) Antigamente a escola', depois: 'pequena.', aceitas: ['era'], porque: 'Ser → era.' },
        { antes: '(ter) Eu', depois: 'uma caixa de papelão.', aceitas: ['tinha'], porque: 'Ter → tinha.' },
        { antes: '(vir) Todo dia ele', depois: 'de ônibus.', aceitas: ['vinha'], porque: 'Vir → vinha.' },
        { antes: '(falar) Nós', depois: 'baixinho.', aceitas: ['falávamos'], porque: 'O nós leva acento: falávamos.' },
        { antes: '(ver) A Luna', depois: 'tudo da janela.', aceitas: ['via'], porque: 'Ver → via.' },
      ],
    },
    {
      tipo: 'lacunas',
      enunciado: 'Complete a lembrança do Gatito.',
      titulo: '📸 Atrás da foto',
      texto: 'Antigamente a escola {0} pequena. A gente não {1} ginásio e {2} no corredor. Um dia, quando a gente {3} o lanche, o sino {4} pela primeira vez!',
      respostas: ['era', 'tinha', 'treinava', 'comia', 'tocou'],
      distratores: ['foi', 'tive', 'comeu'],
      porque: [
        'Descrição do passado: era.',
        'Antigamente não existia ginásio: tinha.',
        'O que a gente fazia sempre: treinava.',
        'O cenário, enquanto o fato aconteceu: a gente comia o lanche.',
        'Um fato, de uma vez só: tocou.',
      ],
    },
    {
      tipo: 'erro',
      enunciado: 'Toque no pedaço errado.',
      itens: [
        {
          palavras: ['Antigamente', 'eu', 'falaba', 'baixinho.'],
          errada: 2,
          correcao: 'falava',
          porque: 'Em português o -aba vira -ava: falava.',
        },
        {
          palavras: ['A', 'escola', 'tenía', 'uma', 'sala.'],
          errada: 2,
          correcao: 'tinha',
          porque: 'Ter no imperfeito: tinha.',
        },
        {
          palavras: ['Eu', 'dormía', 'quando', 'o', 'sino', 'tocou.'],
          errada: 1,
          correcao: 'dormia',
          porque: 'O -ia não leva acento. Só o nós: dormíamos.',
        },
      ],
    },
    {
      tipo: 'vf',
      enunciado: 'Verdadeiro ou falso?',
      itens: [
        { frase: 'Em português, o imperfeito de falar é "falava" (com v), e não "falaba".', verdade: true, porque: 'O -aba do espanhol vira -ava.' },
        { frase: 'O ir, no imperfeito, é "iba", como em espanhol.', verdade: false, porque: 'É ia: eu ia, ele ia, nós íamos.' },
        { frase: 'Em "Eu dormia quando o sino tocou", o "dormia" é o cenário e o "tocou" é o fato.', verdade: true, porque: 'O imperfeito pinta o fundo; o perfeito é o que aconteceu.' },
        { frase: '"Costumava" é o jeito de dizer "solía" em português.', verdade: true, porque: 'Eu costumava dormir = yo solía dormir.' },
      ],
    },
  ],
  consigo: [
    'contar como as coisas eram: era, tinha, fazia, via;',
    'escrever -ava e -ia (e não -aba e -ía);',
    'escolher entre o imperfeito (cenário) e o perfeito (fato);',
    'usar "costumava" e "estava + gerúndio".',
  ],
  aula: {
    chama: 'qualquer',
    chamada: [
      { quem: 'estrella', texto: 'O sinal... Hoje a aula é sobre antigamente. Eu gosto dessas.' },
      { quem: 'sol', texto: '¡ANTIGAMENTE! ¡Eu lembro de TUDO! ...De quase tudo.' },
      { quem: 'luna', texto: '¡Vamos, panas! Quem chegar primeiro guarda o lugar!' },
    ],
    abertura: [
      { quem: 'gatito', texto: 'Boa tarde, turma! Fui ao depósito e achei uma caixa de fotos antigas.' },
      { quem: 'gatito', texto: 'Antigamente esta escola era bem diferente. Quem quer ver?' },
      { quem: 'sol', texto: '¡EU! ¡EU! ¡EU!' },
      { quem: 'valentina', texto: 'Profe, tem foto minha aí? Eu sempre saía bem nas fotos. Sempre.' },
      { quem: 'gatito', texto: 'Então abram na lição 16: "Antigamente era assim".' },
    ],
    encerramento: [
      { quem: 'gatito', texto: 'Muito bem, Ari! Agora você conta o passado com cenário e tudo.' },
      { quem: 'renan', texto: 'Dormia, tocou, pulou. Cenário e fato.' },
      { quem: 'gatito', texto: 'Isso! E a caixa de papelão eu vou guardar de lembrança.' },
      { quem: 'luna', texto: '¡Qué nota! ¡Quero ver mais fotos!' },
      { quem: 'valentina', texto: 'Antigamente eu achava o português difícil. Agora eu acho só... quase difícil.' },
    ],
  },
};
